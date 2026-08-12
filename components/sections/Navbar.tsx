"use client";

import { Menu, Phone, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { Settings, SocialLink } from "@/types/content";
import { assetPath } from "@/utils/assets";

const navItems = [
  ["Home", "#home"],
  ["About", "#about"],
  ["Courses", "#courses"],
  ["Join", "#join"],
  ["Notice", "#notice"],
  ["FAQ", "#faq"],
  ["Contact", "#contact"]
];

type NavbarProps = {
  settings: Settings;
  socialLinks: SocialLink[];
};

export function Navbar({ settings, socialLinks }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const whatsapp = settings.whatsappLink || socialLinks.find((link) => /whatsapp/i.test(link.platform))?.url;
  const logoSrc = assetPath(settings.logo);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-xl">
      <nav className="section-shell flex h-20 items-center justify-between gap-4" aria-label="Primary">
        <a href="#home" className="flex items-center gap-3">
          {logoSrc ? (
            <Image
              src={logoSrc}
              alt={settings.instituteName}
              width={44}
              height={44}
              className="h-11 w-11 rounded-xl object-contain"
            />
          ) : (
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary font-heading text-sm font-bold text-white">
              DC
            </span>
          )}
          <span className="font-heading text-lg font-bold text-secondary">{settings.instituteName}</span>
        </a>

        <div className="hidden items-center gap-6 lg:flex">
          {navItems.map(([label, href]) => (
            <a key={href} href={href} className="text-sm font-semibold text-muted transition hover:text-primary">
              {label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <a href={`tel:${settings.supportNumber}`} className="secondary-button px-4 py-2">
            <Phone className="h-4 w-4" aria-hidden="true" />
            Call
          </a>
          {whatsapp ? (
            <a href={whatsapp} target="_blank" rel="noreferrer" className="gradient-button px-4 py-2">
              WhatsApp
            </a>
          ) : null}
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 text-secondary lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-gray-100 bg-white lg:hidden">
          <div className="section-shell grid gap-2 py-4">
            {navItems.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-semibold text-secondary hover:bg-amber-50"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
