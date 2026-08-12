export type Settings = {
  primaryColor: string;
  secondaryColor: string;
  supportNumber: string;
  email: string;
  whatsappLink: string;
  logo: string;
  favicon: string;
  instituteName: string;
};

export type Batch = {
  title: string;
  branch: string;
  semester: string;
  session: string;
  description: string;
  fees: string;
  timing: string;
  button: string;
  formUrl: string;
  status: "active" | "coming";
};

export type HomeContent = {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroVideoUrl: string;
  activeBatch: Batch;
  comingBatch: Batch;
  careerGuidanceTitle: string;
  careerGuidanceDescription: string;
  careerGuidanceFormUrl: string;
  careerGuidanceButton: string;
};

export type AboutContent = {
  title: string;
  description: string;
  mission: string;
  vision: string;
};

export type Course = {
  branch: string;
  description: string;
  icon: string;
};

export type Faculty = {
  name: string;
  qualification: string;
  experience: string;
  image: string;
  bio: string;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type NoticeItem = {
  date: string;
  title: string;
  description: string;
  important: boolean;
  attachmentUrl?: string;
};

export type JoinContent = {
  activeBatches: Batch[];
  upcomingBatches: Batch[];
};

export type ContactContent = {
  title: string;
  address: string;
  mapUrl: string;
};

export type SocialLink = {
  platform: string;
  url: string;
};

export type Testimonial = {
  studentName: string;
  review: string;
  details?: string;
  whatYouLike?: string;
  rating: number;
  image: string;
};

export type GalleryItem = {
  image: string;
  caption: string;
};

export type WebsiteData = {
  settings: Settings;
  home: HomeContent;
  about: AboutContent;
  courses: Course[];
  faculty: Faculty[];
  faq: FAQItem[];
  notice: NoticeItem[];
  join: JoinContent;
  contact: ContactContent;
  socialLinks: SocialLink[];
  testimonials: Testimonial[];
  gallery: GalleryItem[];
  whyChooseUs: string[];
  enrollmentSteps: string[];
};
