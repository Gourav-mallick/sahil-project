import { createHash } from "crypto";
import type { WebsiteData } from "@/types/content";

export type SearchDocument = {
  id: string;
  sheet: string;
  rowNumber: number;
  text: string;
  contentHash: string;
};

function makeDocument(id: string, sheet: string, rowNumber: number, value: unknown): SearchDocument {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return {
    id,
    sheet,
    rowNumber,
    text,
    contentHash: createHash("sha256").update(text).digest("hex")
  };
}

export function extractSearchDocuments(data: WebsiteData): SearchDocument[] {
  const documents: SearchDocument[] = [];
  const add = (id: string, sheet: string, rowNumber: number, value: unknown) => {
    documents.push(makeDocument(id, sheet, rowNumber, value));
  };

  add("about", "About", 1, data.about);
  add("contact", "Contact", 1, { ...data.contact, ...data.settings });
  data.courses.forEach((item, index) => add(`courses-${index + 1}`, "Courses", index + 2, item));
  data.faculty.forEach((item, index) => add(`faculty-${index + 1}`, "Faculty", index + 2, item));
  data.faq.forEach((item, index) => add(`faq-${index + 1}`, "FAQ", index + 2, item));
  data.notice.forEach((item, index) => add(`notice-${index + 1}`, "Notice", index + 2, item));
  data.join.activeBatches.forEach((item, index) => add(`active-batches-${index + 1}`, "Join", index + 2, item));
  data.join.upcomingBatches.forEach((item, index) => add(`upcoming-batches-${index + 1}`, "Join", index + 2, item));
  data.enrollmentSteps.forEach((item, index) => add(`enrollment-step-${index + 1}`, "Home", index + 2, item));
  data.whyChooseUs.forEach((item, index) => add(`why-choose-us-${index + 1}`, "Home", index + 2, item));

  return documents;
}

export function keywordSearch(documents: SearchDocument[], query: string, limit = 5): string[] {
  const terms = query.toLowerCase().match(/[a-z0-9]+/g) || [];
  const intentTerms = new Map<string, string[]>([
    ["teacher", ["faculty", "instructor", "lecturer", "hod"]],
    ["instructor", ["faculty", "teacher", "lecturer", "hod"]],
    ["faculty", ["teacher", "instructor", "lecturer", "hod"]],
    ["enrollment", ["join", "register", "batch", "form"]],
    ["link", ["url", "form", "join", "register"]],
    ["registration", ["join", "enrollment", "form"]]
  ]);
  const expandedTerms = new Set(terms);
  terms.forEach((term) => intentTerms.get(term)?.forEach((relatedTerm) => expandedTerms.add(relatedTerm)));

  return documents
    .map((document) => {
      const text = document.text.toLowerCase();
      const score = Array.from(expandedTerms).reduce((total, term) => total + (text.includes(term) ? 1 : 0), 0);
      return { document, score };
    })
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map(({ document }) => document.text);
}