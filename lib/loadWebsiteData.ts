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

function settingValue(settingsSheet: Record<string, string>, keys: string[], fallback: string): string {
  return keys.map((key) => settingsSheet[key]).find(Boolean) || fallback;
}

export async function loadWebsiteData(): Promise<WebsiteData | null> {
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
    const joinRows = readTableSheet<Record<string, unknown>>(workbook, "Join");
    const contactSheet = readKeyValueSheet(workbook, "Contact");

    const settings: Settings = {
      primaryColor: settingValue(settingsSheet, ["primary_color"], fallbackData.settings.primaryColor),
      secondaryColor: settingValue(settingsSheet, ["secondary_color"], fallbackData.settings.secondaryColor),
      supportNumber: settingValue(settingsSheet, ["support_number"], fallbackData.settings.supportNumber),
      email: settingValue(settingsSheet, ["email"], fallbackData.settings.email),
      whatsappLink: settingValue(
        settingsSheet,
        ["whatsapp_link", "whats_app_link"],
        fallbackData.settings.whatsappLink
      ),
      logo: settingValue(settingsSheet, ["logo"], fallbackData.settings.logo),
      favicon: settingValue(settingsSheet, ["favicon"], fallbackData.settings.favicon),
      instituteName: settingValue(settingsSheet, ["institute_name"], fallbackData.settings.instituteName)
    };

    const join = makeJoinContent(joinRows, homeSheet, joinSheet);
    const activeBatch = join.activeBatches[0] || fallbackData.home.activeBatch;
    const comingBatch = join.upcomingBatches[0] || fallbackData.home.comingBatch;

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
        activeBatches: join.activeBatches,
        upcomingBatches: join.upcomingBatches
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

    return data;
  } catch {
    return null;
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

    const [courseRows, facultyRows, faqRows, noticeRows, joinRows, socialRows, testimonialRows, galleryRows] =
      await Promise.all([
        readGoogleTableSheet(sheetTabs.courses),
        readGoogleTableSheet(sheetTabs.faculty),
        readGoogleTableSheet(sheetTabs.faq),
        readGoogleTableSheet(sheetTabs.notice),
        readGoogleTableSheet(sheetTabs.join),
        readGoogleTableSheet(sheetTabs.socialLinks),
        readGoogleTableSheet(sheetTabs.testimonials),
        readGoogleTableSheet(sheetTabs.gallery)
      ]);

    const settings: Settings = {
      primaryColor: settingValue(settingsSheet, ["primary_color"], fallbackData.settings.primaryColor),
      secondaryColor: settingValue(settingsSheet, ["secondary_color"], fallbackData.settings.secondaryColor),
      supportNumber: settingValue(settingsSheet, ["support_number"], fallbackData.settings.supportNumber),
      email: settingValue(settingsSheet, ["email"], fallbackData.settings.email),
      whatsappLink: settingValue(
        settingsSheet,
        ["whatsapp_link", "whats_app_link"],
        fallbackData.settings.whatsappLink
      ),
      logo: settingValue(settingsSheet, ["logo"], fallbackData.settings.logo),
      favicon: settingValue(settingsSheet, ["favicon"], fallbackData.settings.favicon),
      instituteName: settingValue(settingsSheet, ["institute_name"], fallbackData.settings.instituteName)
    };

    const join = makeJoinContent(joinRows, homeSheet, joinSheet);
    const activeBatch = join.activeBatches[0] || fallbackData.home.activeBatch;
    const comingBatch = join.upcomingBatches[0] || fallbackData.home.comingBatch;

    return {
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
        activeBatches: join.activeBatches,
        upcomingBatches: join.upcomingBatches
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
      enrollmentSteps: splitList(homeSheet.enrollment_steps, [])
    };
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
    description:
      homeSheet[`${prefix}_batch_description`] ||
      joinSheet[`${prefix}_batch_description`] ||
      fallback.description,
    fees: homeSheet[`${prefix}_batch_fees`] || joinSheet[`${prefix}_batch_fees`] || fallback.fees,
    timing: homeSheet[`${prefix}_batch_timing`] || joinSheet[`${prefix}_batch_timing`] || fallback.timing,
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

function makeJoinContent(
  rows: Record<string, unknown>[],
  homeSheet: Record<string, string>,
  joinSheet: Record<string, string>
): WebsiteData["join"] {
  const batches = rows
    .map((row) => makeBatchFromRow(row))
    .filter((batch): batch is Batch => Boolean(batch));

  const activeBatches = batches.filter((batch) => batch.status === "active");
  const upcomingBatches = batches.filter((batch) => batch.status === "coming");

  if (activeBatches.length || upcomingBatches.length) {
    return {
      activeBatches,
      upcomingBatches
    };
  }

  if (!hasLegacyBatch(homeSheet, joinSheet, "active") && !hasLegacyBatch(homeSheet, joinSheet, "coming")) {
    return {
      activeBatches: [],
      upcomingBatches: []
    };
  }

  return {
    activeBatches: hasLegacyBatch(homeSheet, joinSheet, "active")
      ? [makeBatch(homeSheet, joinSheet, "active", fallbackData.home.activeBatch)]
      : [],
    upcomingBatches: hasLegacyBatch(homeSheet, joinSheet, "coming")
      ? [makeBatch(homeSheet, joinSheet, "coming", fallbackData.home.comingBatch)]
      : []
  };
}

function hasLegacyBatch(
  homeSheet: Record<string, string>,
  joinSheet: Record<string, string>,
  prefix: "active" | "coming"
): boolean {
  return Boolean(
    homeSheet[`${prefix}_batch_branch`] ||
      joinSheet[`${prefix}_batch_branch`] ||
      homeSheet[`${prefix}_batch_title`] ||
      joinSheet[`${prefix}_batch_title`] ||
      homeSheet[`${prefix}_batch_form`] ||
      joinSheet[`${prefix}_batch_form`]
  );
}

function makeBatchFromRow(row: Record<string, unknown>): Batch | null {
  const statusValue = pick(row, ["Status"]).toLowerCase();
  const status = ["active", "live", "running"].includes(statusValue)
    ? "active"
    : ["upcoming", "coming", "coming soon"].includes(statusValue)
      ? "coming"
      : null;

  if (!status) {
    return null;
  }

  const fallback = status === "active" ? fallbackData.home.activeBatch : fallbackData.home.comingBatch;

  return {
    title: pick(row, ["Title"], fallback.title),
    branch: pick(row, ["Branch"], fallback.branch),
    semester: pick(row, ["Semester"], fallback.semester),
    session: pick(row, ["Session"], fallback.session),
    description: pick(row, ["Description", "Details"], fallback.description),
    fees: pick(row, ["Fees", "Fee"], fallback.fees),
    timing: pick(row, ["Timing", "Time"], fallback.timing),
    button: pick(row, ["Button", "Button Text"], fallback.button),
    formUrl: pick(row, ["Form URL", "Form Url", "Form", "Google Form"], fallback.formUrl),
    status
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
