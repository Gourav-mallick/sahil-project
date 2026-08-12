import Image from "next/image";
import { ArrowRight, Compass, Headphones, NotebookPen, PlayCircle, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { MotionReveal } from "@/components/MotionReveal";
import { YouTubePlayer } from "@/components/YouTubePlayer";
import type { HomeContent, Settings } from "@/types/content";
import { assetPath } from "@/utils/assets";

type HeroProps = {
  home: HomeContent;
  settings: Settings;
};

const valueProps: Array<[string, LucideIcon]> = [
  ["Live Classes", PlayCircle],
  ["Notes", NotebookPen],
  ["Practice", Target],
  ["Doubt Support", Headphones]
];

export function Hero({ home, settings }: HeroProps) {
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
              <a href="#join" className="gradient-button">
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
                      <p className="font-heading text-3xl font-bold">Diploma Coching</p>
                      <p className="mt-2 text-sm text-amber-100">Live classes for diploma students</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            <CareerGuidanceCard home={home} />
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}

function CareerGuidanceCard({ home }: { home: HomeContent }) {
  return (
    <article className="card mt-5 p-5 transition duration-300 hover:-translate-y-1 hover:border-primary/40">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-primary">
          {home.careerGuidanceTitle}
        </span>
        <Compass className="h-5 w-5 text-primary" aria-hidden="true" />
      </div>
      <h3 className="font-heading text-2xl font-bold text-secondary">{home.careerGuidanceTitle}</h3>
      <p className="mt-3 text-sm leading-6 text-muted">{home.careerGuidanceDescription}</p>
      <a
        href={home.careerGuidanceFormUrl}
        target="_blank"
        rel="noreferrer"
        className="gradient-button mt-5 w-full"
      >
        {home.careerGuidanceButton}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </a>
    </article>
  );
}
