import { AlertTriangle, MessageCircle } from "lucide-react";

const reportNumber = process.env.NEXT_PUBLIC_FALLBACK_WHATSAPP_NUMBER || "919798734927";

export function MissingContent() {
  const message = encodeURIComponent(
    "Website content sheet missing or not readable. Please check Google Sheet or website-data.xlsx."
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-4 py-16">
      <section className="card max-w-2xl p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-primary">
          <AlertTriangle className="h-7 w-7" aria-hidden="true" />
        </div>
        <p className="section-kicker mt-6">Content Missing</p>
        <h1 className="font-heading text-3xl font-bold text-secondary">Website data is not available</h1>
        <p className="mt-4 leading-7 text-muted">
          Google Sheet data or `public/excel/website-data.xlsx` could not be read. Please update the sheet,
          import the Excel template, or report this issue on WhatsApp.
        </p>
        <a
          href={`https://wa.me/${reportNumber}?text=${message}`}
          target="_blank"
          rel="noreferrer"
          className="gradient-button mt-7"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Report on WhatsApp
        </a>
      </section>
    </main>
  );
}
