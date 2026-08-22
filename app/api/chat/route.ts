import { NextResponse } from "next/server";
import { extractSearchDocuments, keywordSearch } from "@/lib/knowledge-documents";
import { loadWebsiteData } from "@/lib/loadWebsiteData";
import { searchKnowledge, syncKnowledge } from "@/lib/vector-store";

export const runtime = "nodejs";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      message?: unknown;
      history?: unknown;
    };
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!message || message.length > 1000) {
      return NextResponse.json(
        { error: "Please send a question containing fewer than 1000 characters." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json({ error: "Chat service is not configured." }, { status: 500 });
    }

    const data = await loadWebsiteData();
    if (!data) {
      return NextResponse.json({ error: "Website information is currently unavailable." }, { status: 503 });
    }

    const documents = extractSearchDocuments(data);
    let relevantKnowledge: string[];
    try {
      await syncKnowledge(documents);
      relevantKnowledge = await searchKnowledge(message);
    } catch (error) {
      console.error("Vector search unavailable, using keyword fallback:", error instanceof Error ? error.message : "Unknown error");
      relevantKnowledge = keywordSearch(documents, message);
    }

    if (!relevantKnowledge.length) {
      relevantKnowledge = documents.slice(0, 5).map((document) => document.text);
    }

    const courseQuestion = /course|batch|semester|branch|fee|fees|price|timing|enroll|enrollment|join|register|session/i.test(message);
    if (courseQuestion) {
      const courseData = documents
        .filter((document) => document.sheet === "Join" || document.sheet === "Courses")
        .map((document) => document.text);
      relevantKnowledge = Array.from(new Set([...courseData, ...relevantKnowledge]));
    }

    const contactData = documents.find((document) => document.sheet === "Contact")?.text;
    if (contactData && !relevantKnowledge.includes(contactData)) {
      relevantKnowledge.push(contactData);
    }

    const history = Array.isArray(body.history)
      ? body.history.filter(
          (item): item is ChatMessage =>
            typeof item === "object" &&
            item !== null &&
            ((item as ChatMessage).role === "user" || (item as ChatMessage).role === "assistant") &&
            typeof (item as ChatMessage).content === "string"
        )
      : [];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
        temperature: 0.2,
        max_tokens: 500,
        stream: true,
        messages: [
          {
            role: "system",
            content: `You are the helpful student support assistant for ${data.settings.instituteName}.

Rules:
- Answer only from the retrieved website data below. Never invent fees, dates, batches, results, policies, links, or contact details.
- For any question about courses, batches, semesters, branches, fees, timings, sessions, enrollment, or joining, use the Join data first. It contains both active and upcoming batches and the complete available details.
- If the requested information is not present, clearly say that it is not available on the website and ask the user to contact support for more information.
- When information is unavailable, always provide the official phone number and email from the Contact data.
- Answer only what the user asked. Keep the answer short and do not add unrelated suggestions or repeated course details.
- Use a clickable Markdown link for any URL: [Open enrollment form](https://example.com).

Retrieved website data:
${relevantKnowledge.join("\n\n")}`
          },
          ...history.slice(-6),
          { role: "user", content: message }
        ]
      })
    });

    if (!response.ok) {
      console.error("Groq request failed:", response.status, (await response.text()).slice(0, 300));
      return NextResponse.json({ error: "The chat service could not answer right now." }, { status: 502 });
    }

    return new Response(response.body, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive"
      }
    });
  } catch (error) {
    console.error("Chat request failed:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Unable to connect to the knowledge or chat service right now." }, { status: 502 });
  }
}