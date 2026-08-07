import { Award, Goal, Sparkles } from "lucide-react";
import Image from "next/image";
import { MotionReveal } from "@/components/MotionReveal";
import type { AboutContent, Faculty } from "@/types/content";
import { assetPath, initials } from "@/utils/assets";

type AboutProps = {
  about: AboutContent;
  faculty: Faculty[];
};

export function About({ about, faculty }: AboutProps) {
  const lead = faculty[0];
  const image = lead ? assetPath(lead.image) : "";

  return (
    <section id="about" className="bg-canvas py-20">
      <div className="section-shell grid gap-8 lg:grid-cols-[1fr_0.85fr]">
        <MotionReveal className="card p-6 sm:p-8">
          <p className="section-kicker">About + Faculty</p>
          <h2 className="section-title">{about.title}</h2>
          <p className="mt-5 text-base leading-8 text-muted">{about.description}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-amber-50 p-5">
              <Goal className="mb-4 h-6 w-6 text-primary" aria-hidden="true" />
              <h3 className="font-heading text-lg font-bold text-secondary">Mission</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{about.mission}</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-5">
              <Sparkles className="mb-4 h-6 w-6 text-primary" aria-hidden="true" />
              <h3 className="font-heading text-lg font-bold text-secondary">Vision</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{about.vision}</p>
            </div>
          </div>
        </MotionReveal>

        {lead ? (
          <MotionReveal delay={0.1} className="card p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row lg:flex-col">
              {image ? (
                <Image
                  src={image}
                  alt={lead.name}
                  width={112}
                  height={112}
                  className="h-28 w-28 rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-secondary font-heading text-3xl font-bold text-white">
                  {initials(lead.name)}
                </div>
              )}
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-primary">
                  <Award className="h-4 w-4" aria-hidden="true" />
                  Faculty Spotlight
                </div>
                <h3 className="font-heading text-2xl font-bold text-secondary">{lead.name}</h3>
                <p className="mt-3 text-sm font-semibold text-secondary">{lead.qualification}</p>
                <p className="mt-2 text-sm text-muted">{lead.experience}</p>
                <p className="mt-4 leading-7 text-muted">{lead.bio}</p>
              </div>
            </div>
          </MotionReveal>
        ) : null}
      </div>
    </section>
  );
}
