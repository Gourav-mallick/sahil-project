import { Star } from "lucide-react";
import Image from "next/image";
import { MotionReveal } from "@/components/MotionReveal";
import type { Testimonial } from "@/types/content";
import { assetPath, initials } from "@/utils/assets";

type TestimonialsProps = {
  testimonials: Testimonial[];
};

export function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <section className="bg-white py-20">
      <div className="section-shell">
        <MotionReveal className="max-w-3xl">
          <p className="section-kicker">Testimonials</p>
          <h2 className="section-title">Student feedback that builds trust</h2>
        </MotionReveal>

        <div
          className={`mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3 ${
            testimonials.length === 1 ? "md:flex md:justify-center" : ""
          }`}
        >
          {testimonials.map((item, index) => {
            const image = assetPath(item.image);
            return (
              <MotionReveal
                key={`${item.studentName}-${index}`}
                delay={index * 0.04}
                className={`card p-6 ${testimonials.length === 1 ? "w-full md:max-w-sm" : ""}`}
              >
                <div className="flex items-center gap-4">
                  {image ? (
                    <Image
                      src={image}
                      alt={item.studentName}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary font-heading font-bold text-white">
                      {initials(item.studentName)}
                    </span>
                  )}
                  <div>
                    <h3 className="font-heading font-bold text-secondary">{item.studentName}</h3>
                    <div className="mt-1 flex gap-1 text-primary" aria-label={`${item.rating} star rating`}>
                      {Array.from({ length: Math.min(item.rating, 5) }).map((_, starIndex) => (
                        <Star key={starIndex} className="h-4 w-4 fill-current" aria-hidden="true" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-7 text-muted">{item.review}</p>
              </MotionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
