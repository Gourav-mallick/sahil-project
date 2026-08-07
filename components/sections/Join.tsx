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

        <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2">
          <MotionReveal>
            <BatchCard batch={join.activeBatch} />
          </MotionReveal>
          <MotionReveal delay={0.08}>
            <BatchCard batch={join.comingBatch} compact />
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
