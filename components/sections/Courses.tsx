import { ArrowUpRight } from "lucide-react";
import { IconBadge } from "@/components/IconBadge";
import { MotionReveal } from "@/components/MotionReveal";
import type { Course } from "@/types/content";

type CoursesProps = {
  courses: Course[];
};

export function Courses({ courses }: CoursesProps) {
  return (
    <section id="courses" className="bg-white py-20">
      <div className="section-shell">
        <MotionReveal className="max-w-3xl">
          <p className="section-kicker">Courses</p>
          <h2 className="section-title">Diploma branches covered with structured learning</h2>
        </MotionReveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {courses.map((course, index) => (
            <MotionReveal key={course.branch} delay={index * 0.04} className="card p-6">
              <IconBadge name={course.icon} label={course.branch} />
              <h3 className="mt-5 font-heading text-xl font-bold text-secondary">{course.branch}</h3>
              <p className="mt-3 min-h-24 text-sm leading-6 text-muted">{course.description}</p>
              <a href="#join" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">
                Learn more
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
