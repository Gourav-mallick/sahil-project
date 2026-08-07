import { normalizeKey } from "@/lib/excel-parser";

export type SheetRows = Record<string, string>[];

const defaultSheetId = "1O2JYWpTJk8Ek0MmV50Pz5HogEpFevZmwVk3YH59tNC4";

export const googleSheetId =
  process.env.GOOGLE_SHEET_ID || process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || defaultSheetId;

export async function readGoogleKeyValueSheet(sheetNames: string | string[]): Promise<Record<string, string>> {
  const rows = await readGoogleTableSheet(sheetNames);

  return rows.reduce<Record<string, string>>((acc, row) => {
    const key = normalizeKey(row.key || row.Key || "");
    const value = row.value || row.Value || "";
    if (key) {
      acc[key] = value;
    }
    return acc;
  }, {});
}

export async function readGoogleTableSheet(sheetNames: string | string[]): Promise<SheetRows> {
  if (!googleSheetId) {
    return [];
  }

  for (const sheetName of Array.isArray(sheetNames) ? sheetNames : [sheetNames]) {
    const url = `https://docs.google.com/spreadsheets/d/${googleSheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
      sheetName
    )}`;

    const response = await fetch(url, {
      cache: "no-store",
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      continue;
    }

    const rows = parseCsv(await response.text());
    if (rows.length) {
      return rows;
    }
  }

  return [];
}

function parseCsv(csv: string): SheetRows {
  const rows = parseCsvRows(csv).filter((row) => row.some((cell) => cell.trim()));
  const [headers = [], ...body] = rows;
  const normalizedHeaders = headers.map((header) => header.trim());

  return body.map((row) =>
    normalizedHeaders.reduce<Record<string, string>>((acc, header, index) => {
      acc[header] = row[index]?.trim() || "";
      return acc;
    }, {})
  );
}

function parseCsvRows(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    const next = csv[index + 1];

    if (char === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === "," && !quoted) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  row.push(cell);
  rows.push(row);
  return rows;
}
