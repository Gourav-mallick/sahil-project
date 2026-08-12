import type { WebsiteData } from "@/types/content";

const activeBatch = {
  title: "Active Batch",
  branch: "Electrical Engineering",
  semester: "4th Semester",
  session: "Session 2024-2027",
  description: "Full syllabus live classes with notes, practice questions, and doubt support.",
  fees: "Contact for fees",
  timing: "Evening batch",
  button: "Join Now",
  formUrl: "https://forms.google.com",
  status: "active" as const
};

const comingBatch = {
  title: "Coming Soon",
  branch: "1st Semester",
  semester: "All Branches",
  session: "Session 2026-2029",
  description: "Foundation batch for new diploma students with concept clarity from day one.",
  fees: "Announcing soon",
  timing: "Coming soon",
  button: "Register Now",
  formUrl: "https://forms.google.com",
  status: "coming" as const
};

export const fallbackData: WebsiteData = {
  settings: {
    primaryColor: "#F59E0B",
    secondaryColor: "#111827",
    supportNumber: "+91 7870948200",
    email: "sahilkrray732@gmail.com",
    whatsappLink: "https://wa.me/917870948200",
    logo: "",
    favicon: "favicon.ico",
    instituteName: "Diploma Coching"
  },
  home: {
    heroTitle: "Jharkhand Polytechnic Online Tuition",
    heroSubtitle: "Learn from experienced faculty with live classes, notes, practice, and doubt support.",
    heroImage: "",
    heroVideoUrl: "https://www.youtube.com/watch?v=szj5j8-9L_c",
    activeBatch,
    comingBatch,
    careerGuidanceTitle: "Career Guidance",
    careerGuidanceDescription:
      "Get personal guidance for branch choice, semester planning, exams, jobs, and higher studies.",
    careerGuidanceFormUrl: "https://forms.google.com",
    careerGuidanceButton: "Book Guidance"
  },
  about: {
    title: "About Diploma Coching",
    description:
      "A focused online tuition platform for Jharkhand Polytechnic students who want concept clarity, exam preparation, and personal academic support.",
    mission: "Make quality diploma education affordable and accessible from home.",
    vision: "Help every student build strong engineering fundamentals with consistent guidance."
  },
  courses: [
    {
      branch: "Electrical Engineering",
      description: "Core electrical concepts, machines, power systems, and semester exam preparation.",
      icon: "zap"
    },
    {
      branch: "Electrical & Electronics Engineering",
      description: "Balanced support for electrical circuits, electronics, machines, and applied subjects.",
      icon: "circuit-board"
    },
    {
      branch: "Electronics & Communication Engineering",
      description: "Clear learning path for electronics, communication, digital systems, and practice.",
      icon: "radio"
    },
    {
      branch: "Civil Engineering",
      description: "Structured coaching for civil fundamentals, drawing, surveying, and exam readiness.",
      icon: "building-2"
    }
  ],
  faculty: [
    {
      name: "Sahil Ray",
      qualification: "Diploma in Electrical Engineering, B.Tech in Electrical Engineering",
      experience: "More than 1.5 years as Lecturer and HOD In-charge",
      image: "",
      bio: "Experienced diploma faculty focused on easy teaching, practical examples, and student confidence."
    }
  ],
  faq: [
    {
      question: "How do I join a batch?",
      answer: "Click Join Now, fill the Google Form, complete payment, and submit your payment screenshot."
    },
    {
      question: "Will I get notes?",
      answer: "Yes, students receive handwritten notes, PDF notes, and practice questions."
    },
    {
      question: "Can I study on mobile?",
      answer: "Yes, the classes and study material are mobile-friendly."
    },
    {
      question: "How does support work?",
      answer: "Students can contact the support number or WhatsApp for batch and class help."
    }
  ],
  notice: [
    {
      date: "2026-08-06",
      title: "Active batch enrollment open",
      description: "Electrical Engineering 4th Semester enrollment is open for online classes.",
      important: true
    },
    {
      date: "2026-07-25",
      title: "Coming soon batch registration",
      description: "1st Semester students can register interest for the upcoming batch.",
      important: false
    }
  ],
  join: {
    activeBatches: [
      activeBatch,
      {
        ...activeBatch,
        branch: "Electrical & Electronics Engineering",
        semester: "4th Semester",
        timing: "Weekend support"
      }
    ],
    upcomingBatches: [
      comingBatch,
      {
        ...comingBatch,
        branch: "Civil Engineering",
        semester: "3rd Semester",
        session: "Session 2025-2028"
      }
    ]
  },
  contact: {
    title: "Contact Support",
    address: "Jharkhand, India",
    mapUrl: ""
  },
  socialLinks: [
    {
      platform: "WhatsApp",
      url: "https://wa.me/917870948200"
    }
  ],
  testimonials: [
    {
      studentName: "Diploma Student",
      review: "Classes are simple to understand and the notes helped me prepare with confidence.",
      rating: 5,
      image: ""
    }
  ],
  gallery: [
    {
      image: "",
      caption: "Live online class"
    },
    {
      image: "",
      caption: "Notes and practice"
    },
    {
      image: "",
      caption: "Student support"
    }
  ],
  whyChooseUs: [
    "Live Classes",
    "Easy Teaching",
    "Complete Syllabus",
    "Handwritten Notes",
    "PDF Notes",
    "Practice Questions",
    "Doubt Solving",
    "Affordable Fees",
    "Mobile Friendly",
    "Personal Support"
  ],
  enrollmentSteps: [
    "Click Join Now",
    "Google Form Opens",
    "Fill Student Details",
    "Pay Fees",
    "Upload Payment Screenshot",
    "Submit",
    "Receive WhatsApp Confirmation"
  ]
};
