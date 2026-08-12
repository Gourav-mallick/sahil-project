import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Diploma Coching | Jharkhand Polytechnic Online Tuition",
  description:
    "Premium online tuition for Jharkhand Polytechnic students with live classes, notes, practice, doubt support, notices, and Google Form enrollment.",
  metadataBase: new URL("https://diploma-coaching.vercel.app"),
  openGraph: {
    title: "Diploma Coching | Jharkhand Polytechnic Online Tuition",
    description:
      "Live online diploma coching with experienced faculty, affordable fees, notes, practice questions, and student support.",
    type: "website",
    locale: "en_IN"
  },
  twitter: {
    card: "summary_large_image",
    title: "Diploma Coching | Jharkhand Polytechnic Online Tuition",
    description:
      "Join online diploma coching batches for Jharkhand Polytechnic students."
  },
  icons: {
    icon: "/favicon.ico"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
