import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Courses } from "@/components/sections/Courses";
import { FAQ } from "@/components/sections/FAQ";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Join } from "@/components/sections/Join";
import { MissingContent } from "@/components/MissingContent";
import { Navbar } from "@/components/sections/Navbar";
import { Notice } from "@/components/sections/Notice";
import { loadWebsiteData } from "@/lib/loadWebsiteData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const data = await loadWebsiteData();

  if (!data) {
    return <MissingContent />;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: data.settings.instituteName,
    email: data.settings.email,
    telephone: data.settings.supportNumber,
    url: "https://diploma-coaching.vercel.app",
    sameAs: data.socialLinks.map((link) => link.url)
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar settings={data.settings} socialLinks={data.socialLinks} />
      <main>
        <Hero
          home={data.home}
          settings={data.settings}
        />
        <About about={data.about} faculty={data.faculty} />
        <Courses courses={data.courses} />
        <Join join={data.join} settings={data.settings} />
        <Notice notices={data.notice} />
        <FAQ faqs={data.faq} />
        <Contact contact={data.contact} settings={data.settings} />
      </main>
      <Footer settings={data.settings} socialLinks={data.socialLinks} />
    </>
  );
}
