import { createHash } from "crypto";
import { EmbeddingModel, FlagEmbedding } from "fastembed";
import type { SearchDocument } from "@/lib/knowledge-documents";

const collectionName = process.env.QDRANT_COLLECTION || "sahil_knowledge";
const embeddingSize = 384;
const qdrantUrl = process.env.QDRANT_URL?.replace(/\/$/, "");
const qdrantApiKey = process.env.QDRANT_API_KEY?.trim();

type QdrantPoint = {
  id: string | number;
  payload?: {
    id?: string;
    text?: string;
    sheet?: string;
    contentHash?: string;
  };
  score?: number;
};

type QdrantResponse<T> = {
  result?: T;
};

type QdrantScrollResult = {
  points?: QdrantPoint[];
};

let embeddingModelPromise: Promise<FlagEmbedding> | undefined;

function pointId(documentId: string) {
  const hash = createHash("sha256").update(documentId).digest("hex").slice(0, 32);
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-5${hash.slice(13, 16)}-${hash.slice(16, 20)}-${hash.slice(20)}`;
}

function assertQdrantConfig() {
  if (!qdrantUrl || !qdrantApiKey) {
    throw new Error("Qdrant is not configured.");
  }
}

async function qdrantRequest<T>(path: string, init?: RequestInit): Promise<T> {
  assertQdrantConfig();
  const baseUrl = qdrantUrl as string;
  const apiKey = qdrantApiKey as string;
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
      ...init?.headers
    }
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Qdrant request failed with status ${response.status}: ${details.slice(0, 300)}`);
  }

  return (await response.json()) as T;
}

async function getEmbeddingModel() {
  embeddingModelPromise ??= FlagEmbedding.init({ model: EmbeddingModel.AllMiniLML6V2 });
  return embeddingModelPromise;
}

async function embedDocuments(documents: SearchDocument[]) {
  const model = await getEmbeddingModel();
  const vectors: number[][] = [];
  for await (const batch of model.passageEmbed(documents.map((document) => document.text))) {
    vectors.push(...batch.map((vector) => Array.from(vector)));
  }
  return vectors;
}

async function embedQuery(query: string) {
  const model = await getEmbeddingModel();
  return Array.from(await model.queryEmbed(query));
}

async function ensureCollection() {
  try {
    await qdrantRequest(`/collections/${encodeURIComponent(collectionName)}`);
  } catch {
    await qdrantRequest(`/collections/${encodeURIComponent(collectionName)}`, {
      method: "PUT",
      body: JSON.stringify({ vectors: { size: embeddingSize, distance: "Cosine" } })
    });
  }
}

async function getStoredDocuments(): Promise<QdrantPoint[]> {
  const response = await qdrantRequest<QdrantResponse<QdrantScrollResult>>(
    `/collections/${encodeURIComponent(collectionName)}/points/scroll`,
    {
      method: "POST",
      body: JSON.stringify({ limit: 1000, with_payload: true, with_vector: false })
    }
  );
  return response.result?.points || [];
}

export async function syncKnowledge(documents: SearchDocument[]) {
  await ensureCollection();
  const stored = await getStoredDocuments();
  const storedById = new Map(
    stored
      .filter((point) => point.payload?.id)
      .map((point) => [point.payload?.id as string, point])
  );
  const changed = documents.filter(
    (document) => storedById.get(document.id)?.payload?.contentHash !== document.contentHash
  );
  const currentIds = new Set(documents.map((document) => document.id));
  const removedIds = stored
    .filter((point) => point.payload?.id && !currentIds.has(point.payload.id))
    .map((point) => point.id);

  if (changed.length) {
    const vectors = await embedDocuments(changed);
    await qdrantRequest(`/collections/${encodeURIComponent(collectionName)}/points?wait=true`, {
      method: "PUT",
      body: JSON.stringify({
        points: changed.map((document, index) => ({
          id: pointId(document.id),
          vector: vectors[index],
          payload: document
        }))
      })
    });
  }

  if (removedIds.length) {
    await qdrantRequest(`/collections/${encodeURIComponent(collectionName)}/points/delete?wait=true`, {
      method: "POST",
      body: JSON.stringify({ points: removedIds })
    });
  }
}

export async function searchKnowledge(query: string, limit = 5): Promise<string[]> {
  const vector = await embedQuery(query);
  const response = await qdrantRequest<QdrantResponse<QdrantScrollResult>>(
    `/collections/${encodeURIComponent(collectionName)}/points/query`,
    {
      method: "POST",
      body: JSON.stringify({ query: vector, limit, with_payload: true })
    }
  );
  return (response.result?.points || [])
    .filter((point) => point.payload?.text)
    .map((point) => point.payload?.text as string);
}