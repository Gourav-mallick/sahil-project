"use client";

import { CheckCircle2, Send, Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MotionReveal } from "@/components/MotionReveal";
import type { Testimonial } from "@/types/content";
import { assetPath, initials } from "@/utils/assets";

type TestimonialsProps = {
  testimonials: Testimonial[];
};

type FormState = {
  studentName: string;
  details: string;
  whatYouLike: string;
  rating: string;
};

const initialFormState: FormState = {
  studentName: "",
  details: "",
  whatYouLike: "",
  rating: "5"
};

export function Testimonials({ testimonials }: TestimonialsProps) {
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [submitMessage, setSubmitMessage] = useState<{ type: "idle" | "success" | "error"; text: string }>({
    type: "idle",
    text: ""
  });

  const formEndpoint = process.env.NEXT_PUBLIC_TESTIMONIAL_FORM_URL || "";
  const attachmentLink = formEndpoint || "https://docs.google.com/forms/";

  const submitDisabled = true;

  useEffect(() => {
    if (testimonials.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const activeTestimonial = testimonials[activeIndex] || testimonials[0];

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitDisabled) {
      setSubmitMessage({
        type: "success",
        text: "Thank you! Your feedback was submitted successfully."
      });
      setFormData(initialFormState);
      return;
    }

    if (!formData.studentName || !formData.details || !formData.whatYouLike || !formData.rating) {
      setSubmitMessage({
        type: "error",
        text: "Please fill in all the fields before submitting your feedback."
      });
      return;
    }

    if (!formEndpoint) {
      setSubmitMessage({
        type: "error",
        text: "Google Sheet write URL is not configured. Add NEXT_PUBLIC_TESTIMONIAL_FORM_URL in your environment."
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(formEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "Student Name": formData.studentName,
          Details: formData.details,
          "What You Like": formData.whatYouLike,
          Rating: Number(formData.rating)
        })
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setSubmitMessage({
        type: "success",
        text: "Thank you! Your feedback was submitted successfully."
      });
      setFormData(initialFormState);
    } catch (error) {
      setSubmitMessage({
        type: "error",
        text: "Something went wrong while submitting your feedback. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white py-20">
      <div className="section-shell">
        <MotionReveal className="max-w-3xl">
          <p className="section-kicker">Testimonials</p>
          <h2 className="section-title">Student feedback that builds trust</h2>
        </MotionReveal>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative min-h-[180px]">
            {activeTestimonial && (() => {
              const image = assetPath(activeTestimonial.image);
              const reviewText = [activeTestimonial.details, activeTestimonial.whatYouLike].filter(Boolean).join(" ") || activeTestimonial.review;

              return (
                <MotionReveal
                  key={`${activeTestimonial.studentName}-${activeIndex}`}
                  delay={0.05}
                  className="card min-h-[160px] p-4"
                >
                  <div className="flex items-center gap-3">
                    {image ? (
                      <Image
                        src={image}
                        alt={activeTestimonial.studentName}
                        width={36}
                        height={36}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary font-heading text-sm font-bold text-white">
                        {initials(activeTestimonial.studentName)}
                      </span>
                    )}
                    <div>
                      <h3 className="font-heading text-lg font-bold text-secondary">{activeTestimonial.studentName}</h3>
                      <div className="mt-1 flex gap-1 text-primary" aria-label={`${activeTestimonial.rating} star rating`}>
                        {Array.from({ length: Math.min(activeTestimonial.rating, 5) }).map((_, starIndex) => (
                          <Star key={starIndex} className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted">{reviewText}</p>
                </MotionReveal>
              );
            })()}
          </div>

          <MotionReveal className="card p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Send className="h-3.5 w-3.5" aria-hidden="true" />
              </div>
              <div>
                <p className="section-kicker !mb-0 text-[10px]">Share feedback</p>
                <h3 className="font-heading text-xl font-bold text-secondary">Leave a review</h3>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <label htmlFor="studentName" className="mb-1.5 block text-sm font-semibold text-secondary">
                  Student Name
                </label>
                <input
                  id="studentName"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-secondary outline-none transition focus:border-primary"
                  required
                />
              </div>

              <div className="max-w-[90%]">
                <label htmlFor="details" className="mb-1.5 block text-sm font-semibold text-secondary">
                  Details
                </label>
                <textarea
                  id="details"
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Tell us more about your experience"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-secondary outline-none transition focus:border-primary"
                  required
                />
              </div>

              <div className="max-w-[90%]">
                <label htmlFor="whatYouLike" className="mb-1.5 block text-sm font-semibold text-secondary">
                  What You Like
                </label>
                <textarea
                  id="whatYouLike"
                  name="whatYouLike"
                  value={formData.whatYouLike}
                  onChange={handleChange}
                  rows={2}
                  placeholder="What did you like most?"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-secondary outline-none transition focus:border-primary"
                  required
                />
              </div>

              <div>
                <label htmlFor="rating" className="mb-1.5 block text-sm font-semibold text-secondary">
                  Rating out of 5
                </label>
                <input
                  id="rating"
                  name="rating"
                  type="number"
                  min="1"
                  max="5"
                  step="1"
                  value={formData.rating}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-secondary outline-none transition focus:border-primary"
                  required
                />
              </div>

              {submitMessage.type !== "idle" && (
                <div
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
                    submitMessage.type === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {submitMessage.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  ) : null}
                  <span>{submitMessage.text}</span>
                </div>
              )}

            

              <button
                type="submit"
                disabled={isSubmitting || submitDisabled}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Submitting..." : "Submit feedback"}
              </button>
            </form>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
