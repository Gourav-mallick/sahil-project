"use client";

import { LoaderCircle, RotateCcw, Send, X } from "lucide-react";
import { FormEvent, ReactNode, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const initialMessage: Message = {
  role: "assistant",
  content: "Hi! I can help with courses, batches, fees, enrollment, notices, and support."
};

const initialSuggestions = [
  "Which courses are available?",
  "Show active batches",
  "What are the fees and timings?",
  "How do I enroll?",
  "Who is the teacher?"
];

function getSuggestions(messages: Message[]) {
  const latestUserMessage = [...messages].reverse().find((message) => message.role === "user")?.content.toLowerCase() || "";

  if (!latestUserMessage) return initialSuggestions;
  if (/course|branch|semester/.test(latestUserMessage)) {
    return ["Show active batches", "Show upcoming batches", "What are the fees?", "How do I enroll?"];
  }
  if (/batch|session|timing|schedule/.test(latestUserMessage)) {
    return ["What are the batch fees?", "Show enrollment link", "Show upcoming batches", "Contact support"];
  }
  if (/fee|price|cost|payment/.test(latestUserMessage)) {
    return ["Which courses are available?", "Show active batches", "How do I enroll?", "Contact support"];
  }
  if (/enroll|join|register|form|link/.test(latestUserMessage)) {
    return ["Open enrollment form", "What documents are needed?", "Show active batches", "Contact support"];
  }
  if (/teacher|faculty|instructor|lecturer|hod/.test(latestUserMessage)) {
    return ["What is the teacher's qualification?", "What courses are taught?", "Show active batches", "Contact support"];
  }
  return ["View available courses", "Show active batches", "Contact support"];
}

function renderInlineText(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\(https?:\/\/[^)]+\)|<https?:\/\/[^>]+>|https?:\/\/\S+)/g);
  return parts.map((part, index) => {
    const markdownLink = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    const url = markdownLink?.[2] || part.match(/^<?(https?:\/\/[^>]+)>?$/)?.[1];
    if (url) {
      return <a key={`${part}-${index}`} href={url} target="_blank" rel="noreferrer" className="font-medium text-primary underline">{markdownLink?.[1] || url}</a>;
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function renderAssistantMessage(content: string): ReactNode {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];
  let table: string[][] = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push(<p key={`paragraph-${blocks.length}`}>{renderInlineText(paragraph.join(" "))}</p>);
    paragraph = [];
  };

  const flushList = () => {
    if (!list.length) return;
    blocks.push(
      <ul key={`list-${blocks.length}`} className="list-disc space-y-1 pl-5">
        {list.map((item, index) => <li key={`${item}-${index}`}>{renderInlineText(item)}</li>)}
      </ul>
    );
    list = [];
  };

  const flushTable = () => {
    if (!table.length) return;
    const [headers, ...rows] = table;
    blocks.push(
      <div key={`table-${blocks.length}`} className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full border-collapse text-left text-xs">
          <thead className="bg-gray-100 text-secondary">
            <tr>{headers.map((header, index) => <th key={`${header}-${index}`} className="border-b border-gray-200 px-3 py-2 font-semibold">{renderInlineText(header)}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-gray-100 last:border-0">
                {row.map((cell, cellIndex) => <td key={`${cell}-${cellIndex}`} className="px-3 py-2 align-top">{renderInlineText(cell)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    table = [];
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    const nextLine = lines[index + 1]?.trim() || "";
    const isTableHeader = line.includes("|") && /^\|?\s*[-:]+\s*(\|\s*[-:]+\s*)+\|?$/.test(nextLine);
    const isTableRow = line.includes("|") && line.split("|").filter(Boolean).length >= 2;

    if (isTableHeader) {
      flushParagraph();
      flushList();
      table = [line.split("|").map((cell) => cell.trim()).filter(Boolean)];
      index += 1;
      continue;
    }
    if (table.length && isTableRow) {
      table.push(line.split("|").map((cell) => cell.trim()).filter(Boolean));
      continue;
    }
    if (table.length) flushTable();
    if (!line) {
      flushParagraph();
      flushList();
    } else if (/^[-*]\s+/.test(line)) {
      flushParagraph();
      list.push(line.replace(/^[-*]\s+/, ""));
    } else if (/^#{1,3}\s+/.test(line)) {
      flushParagraph();
      flushList();
      blocks.push(<strong key={`heading-${blocks.length}`} className="block text-sm font-semibold text-secondary">{renderInlineText(line.replace(/^#{1,3}\s+/, ""))}</strong>);
    } else {
      flushList();
      paragraph.push(line);
    }
  }

  flushTable();
  flushParagraph();
  flushList();
  return <div className="space-y-3">{blocks}</div>;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function sendMessage(event?: FormEvent, suggestedMessage?: string) {
    event?.preventDefault();
    const content = (suggestedMessage ?? input).trim();
    if (!content || isLoading) return;

    const nextMessages = [...messages, { role: "user" as const, content }];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, history: messages.slice(-6) })
      });
      if (!response.ok) {
        const result = (await response.json()) as { error?: string };
        throw new Error(result.error || "Unable to get an answer.");
      }
      if (!response.body) throw new Error("The chat service returned no response.");

      setMessages([...nextMessages, { role: "assistant", content: "" }]);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let finished = false;

      while (!finished) {
        const { value, done } = await reader.read();
        buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") {
            finished = true;
            break;
          }

          try {
            const chunk = JSON.parse(payload) as { choices?: Array<{ delta?: { content?: string } }> };
            const token = chunk.choices?.[0]?.delta?.content || "";
            if (token) {
              setMessages((current) => {
                const updated = [...current];
                const last = updated[updated.length - 1];
                updated[updated.length - 1] = { ...last, content: last.content + token };
                return updated;
              });
            }
          } catch {
            // Ignore incomplete provider events.
          }
        }
        if (done) break;
      }
    } catch (error) {
      setMessages([
        ...nextMessages,
        { role: "assistant", content: error instanceof Error ? error.message : "Unable to answer right now." }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function resetChat() {
    setMessages([initialMessage]);
    setInput("");
  }

  const suggestions = getSuggestions(messages);

  return (
    <div className="fixed bottom-5 right-5 z-50 sm:bottom-7 sm:right-7">
      {isOpen ? (
        <section className="flex h-[min(620px,calc(100vh-7rem))] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl" aria-label="Student support chat">
          <header className="flex items-center justify-between bg-secondary px-5 py-4 text-white">
            <div>
              <p className="font-heading text-base font-semibold">Student Support</p>
              <p className="mt-0.5 text-xs text-gray-300">Ask about the information on this website</p>
            </div>
            <div className="flex items-center gap-1">
              <button type="button" onClick={resetChat} className="rounded-lg p-2 text-gray-300 transition hover:bg-white/10 hover:text-white" aria-label="Start a new chat" title="Start a new chat">
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => setIsOpen(false)} className="rounded-lg p-2 text-gray-300 transition hover:bg-white/10 hover:text-white" aria-label="Close chat" title="Close chat">
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4" aria-live="polite">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "whitespace-pre-wrap rounded-br-md bg-primary text-white" : "rounded-bl-md border border-gray-200 bg-white text-secondary"}`}>
                  {message.role === "assistant" ? renderAssistantMessage(message.content) : message.content}
                </div>
              </div>
            ))}
            {!isLoading ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {suggestions.map((suggestion) => (
                  <button key={suggestion} type="button" onClick={() => void sendMessage(undefined, suggestion)} className="rounded-full border border-primary/30 bg-white px-3 py-2 text-left text-xs font-medium text-secondary transition hover:border-primary hover:text-primary">
                    {suggestion}
                  </button>
                ))}
              </div>
            ) : null}
            {isLoading ? <LoaderCircle className="h-5 w-5 animate-spin text-primary" aria-label="Assistant is typing" /> : null}
          </div>

          <form onSubmit={(event) => void sendMessage(event)} className="flex gap-2 border-t border-gray-200 bg-white p-3">
            <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask a question..." aria-label="Your question" className="min-w-0 flex-1 rounded-xl border-gray-200 text-sm focus:border-primary focus:ring-primary" maxLength={1000} disabled={isLoading} />
            <button type="submit" disabled={!input.trim() || isLoading} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50" aria-label="Send question" title="Send question">
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </section>
      ) : (
        <button type="button" onClick={() => setIsOpen(true)} className="chatbot-launcher rounded-full bg-white px-5 py-3 text-sm font-semibold text-secondary shadow-lg shadow-amber-500/20 transition hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2" aria-label="Ask AI a question" title="Ask AI a question">
          Student support
        </button>
      )}
    </div>
  );
}