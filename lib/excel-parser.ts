import * as XLSX from "xlsx";

export type Workbook = XLSX.WorkBook;

export function readWorkbook(buffer: Buffer): Workbook {
  return XLSX.read(buffer, { type: "buffer", cellDates: true });
}

export function readKeyValueSheet(workbook: Workbook, sheetName: string): Record<string, string> {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    return {};
  }

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
    raw: false
  });

  return rows.reduce<Record<string, string>>((acc, row) => {
    const key = normalizeKey(String(row.key || row.Key || row.KEY || ""));
    const value = String(row.value || row.Value || row.VALUE || "");
    if (key) {
      acc[key] = value;
    }
    return acc;
  }, {});
}

export function readTableSheet<T extends Record<string, unknown>>(
  workbook: Workbook,
  sheetName: string
): T[] {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    return [];
  }

  return XLSX.utils.sheet_to_json<T>(sheet, {
    defval: "",
    raw: false
  });
}

export function normalizeKey(value: string): string {
  return value
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();
}

export function pick(row: Record<string, unknown>, keys: string[], fallback = ""): string {
  const normalized = Object.entries(row).reduce<Record<string, unknown>>((acc, [key, value]) => {
    acc[normalizeKey(key)] = value;
    return acc;
  }, {});

  for (const key of keys) {
    const value = normalized[normalizeKey(key)];
    if (value !== undefined && String(value).trim()) {
      return String(value).trim();
    }
  }

  return fallback;
}
