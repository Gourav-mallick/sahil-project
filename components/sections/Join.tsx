import { BatchCard } from "@/components/BatchCard";
import { MotionReveal } from "@/components/MotionReveal";
import type { JoinContent, Settings } from "@/types/content";

type JoinProps = {
  join: JoinContent;
  settings: Settings;
};

export function Join({ join, settings }: JoinProps) {
  return (
    <section id="join" className="bg-canvas py-20">
      <div className="section-shell">
        <MotionReveal className="mx-auto max-w-3xl text-center">
          <p className="section-kicker">Join</p>
          <h2 className="section-title">Choose your batch and register through Google Form</h2>
          <p className="mt-4 leading-7 text-muted">Need help before joining? Call {settings.supportNumber}.</p>
        </MotionReveal>

        <BatchGroup title="Active Batches" batches={join.activeBatches} />
        <BatchGroup title="Upcoming Batches" batches={join.upcomingBatches} compact />
      </div>
    </section>
  );
}

function BatchGroup({
  title,
  batches,
  compact = false
}: {
  title: string;
  batches: JoinContent["activeBatches"];
  compact?: boolean;
}) {
  if (!batches.length) {
    return null;
  }

  return (
    <div className="mt-12">
      <MotionReveal>
        <h3 className="font-heading text-2xl font-bold text-secondary">{title}</h3>
      </MotionReveal>
      <div
        className={`mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4 ${
          batches.length === 1 ? "md:flex md:justify-center" : ""
        }`}
      >
        {batches.map((batch, index) => (
          <MotionReveal
            key={`${batch.status}-${batch.branch}-${batch.semester}-${index}`}
            delay={index * 0.04}
            className={batches.length === 1 ? "w-full md:max-w-sm" : ""}
          >
            <BatchCard batch={batch} compact={compact} />
          </MotionReveal>
        ))}
      </div>
    </div>
  );
}
