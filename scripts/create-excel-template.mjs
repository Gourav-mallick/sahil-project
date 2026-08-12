import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import * as XLSX from "xlsx";

const outputDir = path.join(process.cwd(), "public", "excel");
const outputPath = path.join(outputDir, "website-data.xlsx");

const sheets = {
  Settings: [
    ["key", "value"],
    ["Primary Color", "#F59E0B"],
    ["Secondary Color", "#111827"],
    ["Support Number", "+91 7870948200"],
    ["Email", "sahilkrray732@gmail.com"],
    ["WhatsApp Link", "https://wa.me/917870948200"],
    ["Logo", "logo.png"],
    ["Favicon", "favicon.ico"],
    ["Institute Name", "Diploma Coaching"]
  ],
  Home: [
    ["key", "value"],
    ["hero_title", "Jharkhand Polytechnic Online Tuition"],
    ["hero_subtitle", "Learn from experienced faculty with live classes, notes, practice, and doubt support."],
    ["hero_image", "hero.jpg"],
    ["hero_video_url", "https://www.youtube.com/watch?v=szj5j8-9L_c"],
    ["active_batch_title", "Active Batch"],
    ["active_batch_branch", "Electrical Engineering"],
    ["active_batch_semester", "4th Semester"],
    ["active_batch_session", "Session 2024-2027"],
    ["active_batch_button", "Join Now"],
    ["active_batch_form", "https://forms.google.com"],
    ["coming_batch_title", "Coming Soon"],
    ["coming_batch_branch", "1st Semester"],
    ["coming_batch_semester", "All Branches"],
    ["coming_batch_session", "Session 2026-2029"],
    ["coming_batch_button", "Register Now"],
    ["coming_batch_form", "https://forms.google.com"],
    ["career_guidance_title", "Career Guidance"],
    [
      "career_guidance_description",
      "Get personal guidance for branch choice, semester planning, exams, jobs, and higher studies."
    ],
    ["career_guidance_form_url", "https://forms.google.com"],
    ["career_guidance_button", "Book Guidance"],
    ["why_choose_us", "Live Classes|Easy Teaching|Complete Syllabus|Handwritten Notes|PDF Notes|Practice Questions|Doubt Solving|Affordable Fees|Mobile Friendly|Personal Support"],
    ["enrollment_steps", "Click Join Now|Google Form Opens|Fill Student Details|Pay Fees|Upload Payment Screenshot|Submit|Receive WhatsApp Confirmation"]
  ],
  About: [
    ["key", "value"],
    ["title", "About Diploma Coaching"],
    ["description", "A focused online tuition platform for Jharkhand Polytechnic students."],
    ["mission", "Make quality diploma education affordable and accessible from home."],
    ["vision", "Help every student build strong engineering fundamentals with consistent guidance."]
  ],
  Courses: [
    ["Branch", "Description", "Icon"],
    ["Electrical Engineering", "Core electrical concepts, machines, power systems, and semester exam preparation.", "zap"],
    ["Electrical & Electronics Engineering", "Balanced support for electrical circuits, electronics, and applied subjects.", "circuit-board"],
    ["Electronics & Communication Engineering", "Clear learning path for electronics, communication, and digital systems.", "radio"],
    ["Civil Engineering", "Structured coaching for civil fundamentals and exam readiness.", "building-2"]
  ],
  Faculty: [
    ["Name", "Qualification", "Experience", "Image", "Bio"],
    ["Sahil Ray", "Diploma in Electrical Engineering, B.Tech in Electrical Engineering", "More than 1.5 years as Lecturer and HOD In-charge", "faculty.jpg", "Experienced diploma faculty focused on easy teaching and student confidence."]
  ],
  FAQ: [
    ["Question", "Answer"],
    ["How do I join?", "Click Join Now, fill the Google Form, complete payment, and submit your payment screenshot."],
    ["Will I get notes?", "Yes, students receive handwritten notes, PDF notes, and practice questions."]
  ],
  Notice: [
    ["Date", "Title", "Description", "Important"],
    ["2026-08-06", "Active batch enrollment open", "Electrical Engineering 4th Semester enrollment is open.", "yes"]
  ],
  Join: [
    ["Status", "Title", "Branch", "Semester", "Session", "Description", "Fees", "Timing", "Form URL", "Button"],
    [
      "active",
      "Active Batch",
      "Electrical Engineering",
      "4th Semester",
      "Session 2024-2027",
      "Full syllabus live classes with notes, practice questions, and doubt support.",
      "Contact for fees",
      "7:00 PM",
      "https://forms.google.com",
      "Join Now"
    ],
    [
      "active",
      "Active Batch",
      "Electrical & Electronics Engineering",
      "4th Semester",
      "Session 2024-2027",
      "Subject-wise support with weekly practice and doubt clearing.",
      "Contact for fees",
      "8:00 PM",
      "https://forms.google.com",
      "Join Now"
    ],
    [
      "upcoming",
      "Coming Soon",
      "1st Semester",
      "All Branches",
      "Session 2026-2029",
      "Foundation batch for new diploma students.",
      "Announcing soon",
      "Coming soon",
      "https://forms.google.com",
      "Register Now"
    ],
    [
      "upcoming",
      "Coming Soon",
      "Civil Engineering",
      "3rd Semester",
      "Session 2025-2028",
      "Upcoming civil branch semester batch.",
      "Announcing soon",
      "Coming soon",
      "https://forms.google.com",
      "Register Now"
    ]
  ],
  Contact: [
    ["key", "value"],
    ["title", "Contact Support"],
    ["address", "Jharkhand, India"],
    ["map_url", ""]
  ],
  SocialLinks: [["Platform", "URL"], ["WhatsApp", "https://wa.me/917870948200"]],
  Testimonials: [["Student Name", "Review", "Rating", "Image"], ["Diploma Student", "Classes are simple to understand and notes helped me prepare.", 5, "student.jpg"]],
  Gallery: [["Image", "Caption"], ["class.jpg", "Live online class"], ["notes.jpg", "Notes and practice"]]
};

const workbook = XLSX.utils.book_new();

for (const [name, rows] of Object.entries(sheets)) {
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(rows), name);
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(outputPath, XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }));
console.log(`Created ${outputPath}`);
