import { Mail, MapPin, Phone } from "lucide-react";
import { MotionReveal } from "@/components/MotionReveal";
import type { ContactContent, Settings } from "@/types/content";

type ContactProps = {
  contact: ContactContent;
  settings: Settings;
};

export function Contact({ contact, settings }: ContactProps) {
  return (
    <section id="contact" className="bg-white py-20">
      <div className="section-shell grid gap-8 lg:grid-cols-[0.8fr_1fr]">
        <MotionReveal>
          <p className="section-kicker">Contact</p>
          <h2 className="section-title">{contact.title}</h2>
          <p className="mt-4 leading-7 text-muted">Reach support for admission, payment, batch timing, and class help.</p>
        </MotionReveal>

        <MotionReveal className="card grid gap-4 p-6 md:grid-cols-3">
          <a href={`tel:${settings.supportNumber}`} className="min-w-0 rounded-2xl bg-canvas p-5">
            <Phone className="mb-4 h-6 w-6 text-primary" aria-hidden="true" />
            <p className="text-sm font-semibold text-muted">Support</p>
            <p className="mt-2 font-heading font-bold text-secondary">{settings.supportNumber}</p>
          </a>
          <a href={`mailto:${settings.email}`} className="min-w-0 rounded-2xl bg-canvas p-5">
            <Mail className="mb-4 h-6 w-6 text-primary" aria-hidden="true" />
            <p className="text-sm font-semibold text-muted">Email</p>
            <p className="mt-2 text-sm font-bold leading-6 text-secondary [overflow-wrap:anywhere] sm:text-base">
              {settings.email}
            </p>
          </a>
          <div className="min-w-0 rounded-2xl bg-canvas p-5">
            <MapPin className="mb-4 h-6 w-6 text-primary" aria-hidden="true" />
            <p className="text-sm font-semibold text-muted">Location</p>
            <p className="mt-2 font-heading font-bold text-secondary">{contact.address}</p>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
