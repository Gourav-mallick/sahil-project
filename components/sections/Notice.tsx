import { Megaphone } from "lucide-react";
import { MotionReveal } from "@/components/MotionReveal";
import type { NoticeItem } from "@/types/content";

type NoticeProps = {
  notices: NoticeItem[];
};

export function Notice({ notices }: NoticeProps) {
  return (
    <section id="notice" className="bg-white py-20">
      <div className="section-shell">
        <MotionReveal className="max-w-3xl">
          <p className="section-kicker">Notice Board</p>
          <h2 className="section-title">Latest batch and class updates</h2>
        </MotionReveal>

        <div
          className={`mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3 ${
            notices.length === 1 ? "md:flex md:justify-center" : ""
          }`}
        >
          {notices.map((notice, index) => (
            <MotionReveal
              key={`${notice.date}-${notice.title}`}
              delay={index * 0.04}
              className={`card p-6 ${notices.length === 1 ? "w-full md:max-w-sm" : ""}`}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-muted">{notice.date}</span>
                {notice.important ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-primary">
                    <Megaphone className="h-3.5 w-3.5" aria-hidden="true" />
                    Important
                  </span>
                ) : null}
              </div>
              <h3 className="font-heading text-xl font-bold text-secondary">{notice.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{notice.description}</p>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
