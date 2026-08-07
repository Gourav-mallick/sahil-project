import { MotionReveal } from "@/components/MotionReveal";

type EnrollmentProps = {
  steps: string[];
};

export function Enrollment({ steps }: EnrollmentProps) {
  return (
    <section className="bg-white py-20">
      <div className="section-shell">
        <MotionReveal className="max-w-3xl">
          <p className="section-kicker">Enrollment Process</p>
          <h2 className="section-title">A simple 7-step admission timeline</h2>
        </MotionReveal>

        <div className="mt-10 grid gap-4 md:grid-cols-7">
          {steps.map((step, index) => (
            <MotionReveal key={step} delay={index * 0.04}>
              <div className="relative h-full rounded-2xl border border-gray-100 bg-canvas p-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-bold text-white">
                  {index + 1}
                </span>
                <p className="mt-4 text-sm font-semibold leading-6 text-secondary">{step}</p>
              </div>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
