import { ArrowUpRight, CalendarDays, GraduationCap } from "lucide-react";
import type { Batch } from "@/types/content";

type BatchCardProps = {
  batch: Batch;
  compact?: boolean;
};

export function BatchCard({ batch, compact = false }: BatchCardProps) {
  return (
    <article className="group card p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/40">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-primary">
          {batch.title}
        </span>
        <GraduationCap className="h-5 w-5 text-primary" aria-hidden="true" />
      </div>
      <h3 className="font-heading text-xl font-bold text-secondary">{batch.branch}</h3>
      <div className="mt-3 space-y-2 text-sm text-muted">
        <p className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />
          {batch.semester}
        </p>
        <p>{batch.session}</p>
      </div>
      <a
        href={batch.formUrl}
        target="_blank"
        rel="noreferrer"
        className={compact ? "secondary-button mt-5 w-full" : "gradient-button mt-6 w-full"}
      >
        {batch.button}
        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </article>
  );
}
