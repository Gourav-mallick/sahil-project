import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Courses } from "@/components/sections/Courses";
import { Enrollment } from "@/components/sections/Enrollment";
import { FAQ } from "@/components/sections/FAQ";
import { Footer } from "@/components/sections/Footer";
import { Gallery } from "@/components/sections/Gallery";
import { Hero } from "@/components/sections/Hero";
import { Join } from "@/components/sections/Join";
import { Navbar } from "@/components/sections/Navbar";
import { Notice } from "@/components/sections/Notice";
import { Testimonials } from "@/components/sections/Testimonials";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { loadWebsiteData } from "@/lib/loadWebsiteData";

export default async function HomePage() {
  const data = await loadWebsiteData();

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
        <Hero home={data.home} settings={data.settings} />
        <About about={data.about} faculty={data.faculty} />
        <Courses courses={data.courses} />
        <WhyChooseUs items={data.whyChooseUs} />
        <Enrollment steps={data.enrollmentSteps} />
        <FAQ faqs={data.faq} />
        <Notice notices={data.notice} />
        <Gallery gallery={data.gallery} />
        <Testimonials testimonials={data.testimonials} />
        <Join join={data.join} settings={data.settings} />
        <Contact contact={data.contact} settings={data.settings} />
      </main>
      <Footer settings={data.settings} socialLinks={data.socialLinks} />
    </>
  );
}
