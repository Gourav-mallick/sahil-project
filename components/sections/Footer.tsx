import Image from "next/image";
import type { Settings, SocialLink } from "@/types/content";
import { assetPath } from "@/utils/assets";

const quickLinks = [
  ["Home", "#home"],
  ["Courses", "#courses"],
  ["FAQ", "#faq"],
  ["Notice", "#notice"],
  ["Join", "#join"],
  ["Contact", "#contact"]
];

type FooterProps = {
  settings: Settings;
  socialLinks: SocialLink[];
};

export function Footer({ settings, socialLinks }: FooterProps) {
  const logo = assetPath(settings.logo);

  return (
    <footer className="bg-secondary py-12 text-white">
      <div className="section-shell grid gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            {logo ? (
              <Image
                src={logo}
                alt={settings.instituteName}
                width={40}
                height={40}
                className="h-10 w-10 rounded-xl object-contain"
              />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-heading text-sm font-bold">
                DC
              </span>
            )}
            <span className="font-heading text-lg font-bold">{settings.instituteName}</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-gray-300">Jharkhand Polytechnic online tuition with live classes, notes, practice, and support.</p>
        </div>

        <div>
          <h3 className="font-heading font-bold">Quick Links</h3>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-300">
            {quickLinks.map(([label, href]) => (
              <a key={href} href={href} className="hover:text-primary">
                {label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-heading font-bold">Social + Support</h3>
          <div className="mt-4 grid gap-3 text-sm text-gray-300">
            <a href={`tel:${settings.supportNumber}`} className="hover:text-primary">
              {settings.supportNumber}
            </a>
            <a href={`mailto:${settings.email}`} className="hover:text-primary">
              {settings.email}
            </a>
            {socialLinks.map((link) => (
              <a key={`${link.platform}-${link.url}`} href={link.url} target="_blank" rel="noreferrer" className="hover:text-primary">
                {link.platform}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="section-shell mt-10 border-t border-white/10 pt-6 text-sm text-gray-400">
        Copyright {new Date().getFullYear()} {settings.instituteName}. All rights reserved.
      </div>
    </footer>
  );
}
