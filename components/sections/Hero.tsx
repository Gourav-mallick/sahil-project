import Image from "next/image";
import { ArrowRight, CalendarCheck, Headphones, NotebookPen, PlayCircle, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { MotionReveal } from "@/components/MotionReveal";
import { YouTubePlayer } from "@/components/YouTubePlayer";
import type { HomeContent, Settings } from "@/types/content";
import { assetPath } from "@/utils/assets";

type HeroProps = {
  home: HomeContent;
  settings: Settings;
  activeBatchCount: number;
  upcomingBatchCount: number;
};

const valueProps: Array<[string, LucideIcon]> = [
  ["Live Classes", PlayCircle],
  ["Notes", NotebookPen],
  ["Practice", Target],
  ["Doubt Support", Headphones]
];

export function Hero({ home, settings, activeBatchCount, upcomingBatchCount }: HeroProps) {
  const heroImage = assetPath(home.heroImage);

  return (
    <section id="home" className="relative overflow-hidden bg-white">
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-amber-50 to-white" />
      <div className="section-shell relative grid min-h-[calc(100vh-5rem)] items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <MotionReveal>
          <div>
            <p className="section-kicker">Jharkhand Polytechnic Online Tuition</p>
            <h1 className="font-heading text-4xl font-extrabold tracking-normal text-secondary sm:text-5xl lg:text-6xl">
              {home.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">{home.heroSubtitle}</p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {valueProps.map(([label, Icon]) => (
                <div key={label} className="rounded-2xl border border-gray-100 bg-canvas p-4">
                  <Icon className="mb-3 h-5 w-5 text-primary" aria-hidden="true" />
                  <p className="text-sm font-semibold text-secondary">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href={home.activeBatch.formUrl} target="_blank" rel="noreferrer" className="gradient-button">
                Join Active Batch
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href={`tel:${settings.supportNumber}`} className="secondary-button">
                Contact Support
              </a>
            </div>

            <p className="mt-5 text-sm font-semibold text-muted">Support: {settings.supportNumber}</p>
          </div>
        </MotionReveal>

        <MotionReveal delay={0.12}>
          <div className="relative">
            {home.heroVideoUrl ? (
              <YouTubePlayer url={home.heroVideoUrl} title={`${home.heroTitle} video`} />
            ) : (
              <div className="overflow-hidden rounded-2xl bg-secondary shadow-soft">
                {heroImage ? (
                <Image
                  src={heroImage}
                  alt=""
                  width={720}
                  height={420}
                  priority
                  className="h-56 w-full object-cover opacity-90 sm:h-72"
                  />
                ) : (
                  <div className="flex h-56 w-full items-center justify-center bg-gradient-to-br from-secondary via-gray-800 to-amber-900 text-center text-white sm:h-72">
                    <div>
                      <p className="font-heading text-3xl font-bold">Diploma Coaching</p>
                      <p className="mt-2 text-sm text-amber-100">Live classes for diploma students</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <HeroBatchSummaryCard
                title="Current Active Batches"
                count={activeBatchCount}
                description="View all running batches with full details."
                button="View Active Batches"
              />
              <HeroBatchSummaryCard
                title="Upcoming Batches"
                count={upcomingBatchCount}
                description="Check upcoming sessions and registration details."
                button="View Upcoming Batches"
                muted
              />
            </div>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}

function HeroBatchSummaryCard({
  title,
  count,
  description,
  button,
  muted = false
}: {
  title: string;
  count: number;
  description: string;
  button: string;
  muted?: boolean;
}) {
  return (
    <article className="card p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/40">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-primary">{title}</span>
        <CalendarCheck className="h-5 w-5 text-primary" aria-hidden="true" />
      </div>
      <p className="font-heading text-4xl font-extrabold text-secondary">{count}</p>
      <p className="mt-1 text-sm font-semibold text-muted">{count === 1 ? "batch available" : "batches available"}</p>
      <p className="mt-4 text-sm leading-6 text-muted">{description}</p>
      <a href="#join" className={muted ? "secondary-button mt-5 w-full" : "gradient-button mt-5 w-full"}>
        {button}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </article>
  );
}
