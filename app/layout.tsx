import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["500", "600", "700", "800"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Diploma Coaching | Jharkhand Polytechnic Online Tuition",
  description:
    "Premium online tuition for Jharkhand Polytechnic students with live classes, notes, practice, doubt support, notices, and Google Form enrollment.",
  metadataBase: new URL("https://diploma-coaching.vercel.app"),
  openGraph: {
    title: "Diploma Coaching | Jharkhand Polytechnic Online Tuition",
    description:
      "Live online diploma coaching with experienced faculty, affordable fees, notes, practice questions, and student support.",
    type: "website",
    locale: "en_IN"
  },
  twitter: {
    card: "summary_large_image",
    title: "Diploma Coaching | Jharkhand Polytechnic Online Tuition",
    description:
      "Join online diploma coaching batches for Jharkhand Polytechnic students."
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
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body>{children}</body>
    </html>
  );
}
