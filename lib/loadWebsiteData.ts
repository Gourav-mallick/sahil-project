import { promises as fs } from "fs";
import path from "path";
import { fallbackData } from "@/lib/fallbackData";
import { pick, readKeyValueSheet, readTableSheet, readWorkbook } from "@/lib/excel-parser";
import { readGoogleKeyValueSheet, readGoogleTableSheet } from "@/lib/google-sheet-parser";
import type {
  Batch,
  ContactContent,
  Course,
  FAQItem,
  Faculty,
  GalleryItem,
  NoticeItem,
  Settings,
  SocialLink,
  Testimonial,
  WebsiteData
} from "@/types/content";

const excelPath = path.join(process.cwd(), "public", "excel", "website-data.xlsx");
const sheetTabs = {
  settings: ["Settings", "Sheet1"],
  home: ["Home", "Sheet2"],
  about: ["About", "Sheet3"],
  courses: ["Courses", "Sheet4"],
  faculty: ["Faculty", "Sheet5"],
  faq: ["FAQ", "Sheet6"],
  notice: ["Notice", "Sheet7"],
  join: ["Join", "Sheet8"],
  contact: ["Contact", "Sheet9"],
  socialLinks: ["SocialLinks", "Sheet10"],
  testimonials: ["Testimonials", "Sheet11"],
  gallery: ["Gallery", "Sheet12"]
};

export async function loadWebsiteData(): Promise<WebsiteData> {
  const googleData = await loadGoogleWebsiteData();
  if (googleData) {
    return googleData;
  }

  try {
    const buffer = await fs.readFile(excelPath);
    const workbook = readWorkbook(buffer);
    const settingsSheet = readKeyValueSheet(workbook, "Settings");
    const homeSheet = readKeyValueSheet(workbook, "Home");
    const aboutSheet = readKeyValueSheet(workbook, "About");
    const joinSheet = readKeyValueSheet(workbook, "Join");
    const contactSheet = readKeyValueSheet(workbook, "Contact");

    const settings: Settings = {
      primaryColor: settingsSheet.primary_color || fallbackData.settings.primaryColor,
      secondaryColor: settingsSheet.secondary_color || fallbackData.settings.secondaryColor,
      supportNumber: settingsSheet.support_number || fallbackData.settings.supportNumber,
      email: settingsSheet.email || fallbackData.settings.email,
      whatsappLink: settingsSheet.whatsapp_link || fallbackData.settings.whatsappLink,
      logo: settingsSheet.logo || fallbackData.settings.logo,
      favicon: settingsSheet.favicon || fallbackData.settings.favicon,
      instituteName: settingsSheet.institute_name || fallbackData.settings.instituteName
    };

    const activeBatch = makeBatch(homeSheet, joinSheet, "active", fallbackData.home.activeBatch);
    const comingBatch = makeBatch(homeSheet, joinSheet, "coming", fallbackData.home.comingBatch);

    const data: WebsiteData = {
      settings,
      home: {
        heroTitle: homeSheet.hero_title || fallbackData.home.heroTitle,
        heroSubtitle: homeSheet.hero_subtitle || fallbackData.home.heroSubtitle,
        heroImage: homeSheet.hero_image || fallbackData.home.heroImage,
        heroVideoUrl: homeSheet.hero_video_url || fallbackData.home.heroVideoUrl,
        activeBatch,
        comingBatch
      },
      about: {
        title: aboutSheet.title || fallbackData.about.title,
        description: aboutSheet.description || fallbackData.about.description,
        mission: aboutSheet.mission || fallbackData.about.mission,
        vision: aboutSheet.vision || fallbackData.about.vision
      },
      courses: readTableSheet<Record<string, unknown>>(workbook, "Courses").map<Course>((row) => ({
        branch: pick(row, ["Branch"], fallbackData.courses[0].branch),
        description: pick(row, ["Description"], fallbackData.courses[0].description),
        icon: pick(row, ["Icon"], "book-open")
      })),
      faculty: readTableSheet<Record<string, unknown>>(workbook, "Faculty").map<Faculty>((row) => ({
        name: pick(row, ["Name"], fallbackData.faculty[0].name),
        qualification: pick(row, ["Qualification"], fallbackData.faculty[0].qualification),
        experience: pick(row, ["Experience"], fallbackData.faculty[0].experience),
        image: pick(row, ["Image"], fallbackData.faculty[0].image),
        bio: pick(row, ["Bio"], fallbackData.faculty[0].bio)
      })),
      faq: readTableSheet<Record<string, unknown>>(workbook, "FAQ").map<FAQItem>((row) => ({
        question: pick(row, ["Question"]),
        answer: pick(row, ["Answer"])
      })),
      notice: readTableSheet<Record<string, unknown>>(workbook, "Notice")
        .map<NoticeItem>((row) => ({
          date: pick(row, ["Date"]),
          title: pick(row, ["Title"]),
          description: pick(row, ["Description"]),
          important: ["yes", "true", "important", "1"].includes(
            pick(row, ["Important", "Highlight"]).toLowerCase()
          )
        }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      join: {
        activeBatch,
        comingBatch
      },
      contact: makeContact(contactSheet),
      socialLinks: readTableSheet<Record<string, unknown>>(workbook, "SocialLinks").map<SocialLink>(
        (row) => ({
          platform: pick(row, ["Platform"]),
          url: pick(row, ["URL", "Url"])
        })
      ),
      testimonials: readTableSheet<Record<string, unknown>>(workbook, "Testimonials").map<Testimonial>(
        (row) => ({
          studentName: pick(row, ["Student Name", "Name"], fallbackData.testimonials[0].studentName),
          review: pick(row, ["Review"], fallbackData.testimonials[0].review),
          rating: Number(pick(row, ["Rating"], String(fallbackData.testimonials[0].rating))) || 5,
          image: pick(row, ["Image"], fallbackData.testimonials[0].image)
        })
      ),
      gallery: readTableSheet<Record<string, unknown>>(workbook, "Gallery").map<GalleryItem>((row) => ({
        image: pick(row, ["Image"]),
        caption: pick(row, ["Caption"])
      })),
      whyChooseUs: splitList(homeSheet.why_choose_us, fallbackData.whyChooseUs),
      enrollmentSteps: splitList(homeSheet.enrollment_steps, fallbackData.enrollmentSteps)
    };

    return withArrayFallbacks(data);
  } catch {
    return fallbackData;
  }
}

async function loadGoogleWebsiteData(): Promise<WebsiteData | null> {
  try {
    const [settingsSheet, homeSheet, aboutSheet, joinSheet, contactSheet] = await Promise.all([
      readGoogleKeyValueSheet(sheetTabs.settings),
      readGoogleKeyValueSheet(sheetTabs.home),
      readGoogleKeyValueSheet(sheetTabs.about),
      readGoogleKeyValueSheet(sheetTabs.join),
      readGoogleKeyValueSheet(sheetTabs.contact)
    ]);

    if (!Object.keys(settingsSheet).length && !Object.keys(homeSheet).length) {
      return null;
    }

    const [courseRows, facultyRows, faqRows, noticeRows, socialRows, testimonialRows, galleryRows] =
      await Promise.all([
        readGoogleTableSheet(sheetTabs.courses),
        readGoogleTableSheet(sheetTabs.faculty),
        readGoogleTableSheet(sheetTabs.faq),
        readGoogleTableSheet(sheetTabs.notice),
        readGoogleTableSheet(sheetTabs.socialLinks),
        readGoogleTableSheet(sheetTabs.testimonials),
        readGoogleTableSheet(sheetTabs.gallery)
      ]);

    const settings: Settings = {
      primaryColor: settingsSheet.primary_color || fallbackData.settings.primaryColor,
      secondaryColor: settingsSheet.secondary_color || fallbackData.settings.secondaryColor,
      supportNumber: settingsSheet.support_number || fallbackData.settings.supportNumber,
      email: settingsSheet.email || fallbackData.settings.email,
      whatsappLink: settingsSheet.whatsapp_link || fallbackData.settings.whatsappLink,
      logo: settingsSheet.logo || fallbackData.settings.logo,
      favicon: settingsSheet.favicon || fallbackData.settings.favicon,
      instituteName: settingsSheet.institute_name || fallbackData.settings.instituteName
    };

    const activeBatch = makeBatch(homeSheet, joinSheet, "active", fallbackData.home.activeBatch);
    const comingBatch = makeBatch(homeSheet, joinSheet, "coming", fallbackData.home.comingBatch);

    return withArrayFallbacks({
      settings,
      home: {
        heroTitle: homeSheet.hero_title || fallbackData.home.heroTitle,
        heroSubtitle: homeSheet.hero_subtitle || fallbackData.home.heroSubtitle,
        heroImage: homeSheet.hero_image || fallbackData.home.heroImage,
        heroVideoUrl: homeSheet.hero_video_url || fallbackData.home.heroVideoUrl,
        activeBatch,
        comingBatch
      },
      about: {
        title: aboutSheet.title || fallbackData.about.title,
        description: aboutSheet.description || fallbackData.about.description,
        mission: aboutSheet.mission || fallbackData.about.mission,
        vision: aboutSheet.vision || fallbackData.about.vision
      },
      courses: courseRows.map<Course>((row) => ({
        branch: pick(row, ["Branch"], fallbackData.courses[0].branch),
        description: pick(row, ["Description"], fallbackData.courses[0].description),
        icon: pick(row, ["Icon"], "book-open")
      })),
      faculty: facultyRows.map<Faculty>((row) => ({
        name: pick(row, ["Name"], fallbackData.faculty[0].name),
        qualification: pick(row, ["Qualification"], fallbackData.faculty[0].qualification),
        experience: pick(row, ["Experience"], fallbackData.faculty[0].experience),
        image: pick(row, ["Image"], fallbackData.faculty[0].image),
        bio: pick(row, ["Bio"], fallbackData.faculty[0].bio)
      })),
      faq: faqRows.map<FAQItem>((row) => ({
        question: pick(row, ["Question"]),
        answer: pick(row, ["Answer"])
      })),
      notice: noticeRows
        .map<NoticeItem>((row) => ({
          date: pick(row, ["Date"]),
          title: pick(row, ["Title"]),
          description: pick(row, ["Description"]),
          important: ["yes", "true", "important", "1"].includes(
            pick(row, ["Important", "Highlight"]).toLowerCase()
          )
        }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      join: {
        activeBatch,
        comingBatch
      },
      contact: makeContact(contactSheet),
      socialLinks: socialRows.map<SocialLink>((row) => ({
        platform: pick(row, ["Platform"]),
        url: pick(row, ["URL", "Url"])
      })),
      testimonials: testimonialRows.map<Testimonial>((row) => ({
        studentName: pick(row, ["Student Name", "Name"], fallbackData.testimonials[0].studentName),
        review: pick(row, ["Review"], fallbackData.testimonials[0].review),
        rating: Number(pick(row, ["Rating"], String(fallbackData.testimonials[0].rating))) || 5,
        image: pick(row, ["Image"], fallbackData.testimonials[0].image)
      })),
      gallery: galleryRows.map<GalleryItem>((row) => ({
        image: pick(row, ["Image"]),
        caption: pick(row, ["Caption"])
      })),
      whyChooseUs: splitList(homeSheet.why_choose_us, fallbackData.whyChooseUs),
      enrollmentSteps: splitList(homeSheet.enrollment_steps, fallbackData.enrollmentSteps)
    });
  } catch {
    return null;
  }
}

function makeBatch(
  homeSheet: Record<string, string>,
  joinSheet: Record<string, string>,
  prefix: "active" | "coming",
  fallback: Batch
): Batch {
  return {
    title: homeSheet[`${prefix}_batch_title`] || joinSheet[`${prefix}_batch_title`] || fallback.title,
    branch: homeSheet[`${prefix}_batch_branch`] || joinSheet[`${prefix}_batch_branch`] || fallback.branch,
    semester:
      homeSheet[`${prefix}_batch_semester`] || joinSheet[`${prefix}_batch_semester`] || fallback.semester,
    session: homeSheet[`${prefix}_batch_session`] || joinSheet[`${prefix}_batch_session`] || fallback.session,
    button:
      homeSheet[`${prefix}_batch_button`] ||
      joinSheet[`${prefix}_batch_button`] ||
      homeSheet[`${prefix}_button`] ||
      joinSheet[`${prefix}_button`] ||
      fallback.button,
    formUrl:
      homeSheet[`${prefix}_batch_form`] ||
      joinSheet[`${prefix}_batch_form`] ||
      homeSheet[`${prefix}_form`] ||
      joinSheet[`${prefix}_form`] ||
      fallback.formUrl,
    status: prefix === "active" ? "active" : "coming"
  };
}

function makeContact(contactSheet: Record<string, string>): ContactContent {
  return {
    title: contactSheet.title || fallbackData.contact.title,
    address: contactSheet.address || fallbackData.contact.address,
    mapUrl: contactSheet.map_url || fallbackData.contact.mapUrl
  };
}

function splitList(value: string | undefined, fallback: string[]): string[] {
  if (!value) {
    return fallback;
  }

  return value
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function withArrayFallbacks(data: WebsiteData): WebsiteData {
  return {
    ...data,
    courses: data.courses.length ? data.courses : fallbackData.courses,
    faculty: data.faculty.length ? data.faculty : fallbackData.faculty,
    faq: data.faq.length ? data.faq : fallbackData.faq,
    notice: data.notice.length ? data.notice : fallbackData.notice,
    socialLinks: data.socialLinks.length ? data.socialLinks : fallbackData.socialLinks,
    testimonials: data.testimonials.length ? data.testimonials : fallbackData.testimonials,
    gallery: data.gallery.length ? data.gallery : fallbackData.gallery
  };
}
