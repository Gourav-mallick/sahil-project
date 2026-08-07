import { CheckCircle2 } from "lucide-react";
import { MotionReveal } from "@/components/MotionReveal";

type WhyChooseUsProps = {
  items: string[];
};

export function WhyChooseUs({ items }: WhyChooseUsProps) {
  return (
    <section className="bg-canvas py-16">
      <div className="section-shell">
        <MotionReveal>
          <p className="section-kicker">Why choose us</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {items.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <span className="text-sm font-semibold text-secondary">{item}</span>
              </div>
            ))}
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
