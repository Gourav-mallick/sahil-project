"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { MotionReveal } from "@/components/MotionReveal";
import type { FAQItem } from "@/types/content";

type FAQProps = {
  faqs: FAQItem[];
};

export function FAQ({ faqs }: FAQProps) {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="bg-canvas py-20">
      <div className="section-shell grid gap-8 lg:grid-cols-[0.7fr_1fr]">
        <MotionReveal>
          <p className="section-kicker">FAQ</p>
          <h2 className="section-title">Answers before you join</h2>
          <p className="mt-4 leading-7 text-muted">
            Common student questions about batches, notes, payment, recordings, and support.
          </p>
        </MotionReveal>

        <MotionReveal className="card divide-y divide-gray-100 overflow-hidden">
          {faqs.map((item, index) => {
            const isOpen = open === index;
            return (
              <div key={item.question}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left font-heading font-semibold text-secondary"
                  onClick={() => setOpen(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                >
                  {item.question}
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-primary transition ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen ? <p className="px-5 pb-5 text-sm leading-7 text-muted">{item.answer}</p> : null}
              </div>
            );
          })}
        </MotionReveal>
      </div>
    </section>
  );
}
