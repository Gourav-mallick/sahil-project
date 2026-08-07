# Diploma Coaching Frontend

Premium static landing site for Jharkhand Polytechnic online tuition. The site uses Next.js, TypeScript, Tailwind CSS, Framer Motion, Lucide icons, and one Excel workbook as a mini CMS.

## Run locally

```bash
npm install
npm run create:excel
npm run dev
```

Open `http://localhost:3000`.

## Update website content

Replace this file:

```text
public/excel/website-data.xlsx
```

Then redeploy the site. Images referenced inside Excel should be placed in:

```text
public/assets/
```

Excel cells should contain only image filenames, for example:

```text
hero.jpg
faculty-sahil.jpg
batch-banner.png
```

## Excel workbook schema

Use one workbook named `website-data.xlsx`.

### Settings

| key | value |
| --- | --- |
| Primary Color | #F59E0B |
| Secondary Color | #111827 |
| Support Number | +91 7870948200 |
| Email | sahilkrray732@gmail.com |
| WhatsApp Link | https://wa.me/917870948200 |
| Logo | logo.png |
| Favicon | favicon.ico |
| Institute Name | Diploma Coaching |

### Home

| key | value |
| --- | --- |
| hero_title | Jharkhand Polytechnic Online Tuition |
| hero_subtitle | Learn From Experienced Faculty |
| hero_image | hero.jpg |
| active_batch_title | Active Batch |
| active_batch_branch | Electrical Engineering |
| active_batch_semester | 4th Semester |
| active_batch_session | Session 2024-2027 |
| active_batch_button | Join Now |
| active_batch_form | Google Form URL |
| coming_batch_title | Coming Soon |
| coming_batch_branch | 1st Semester |
| coming_batch_semester | All Branches |
| coming_batch_session | Session 2026-2029 |
| coming_batch_button | Register Now |
| coming_batch_form | Google Form URL |
| why_choose_us | Live Classes \| Easy Teaching \| Complete Syllabus |
| enrollment_steps | Click Join Now \| Google Form Opens \| Fill Student Details |

### About

| key | value |
| --- | --- |
| title | About Diploma Coaching |
| description | About section text |
| mission | Mission text |
| vision | Vision text |

### Courses

| Branch | Description | Icon |
| --- | --- | --- |
| Electrical Engineering | Description | zap |

Supported icon examples: `zap`, `circuit-board`, `radio`, `building-2`, `book-open`, `smartphone`, `users`.

### Faculty

| Name | Qualification | Experience | Image | Bio |
| --- | --- | --- | --- | --- |
| Sahil Ray | Diploma + B.Tech | More than 1.5 years | faculty.jpg | Short introduction |

### FAQ

| Question | Answer |
| --- | --- |
| How to Join? | Click Join Now and fill the Google Form. |

### Notice

| Date | Title | Description | Important |
| --- | --- | --- | --- |
| 2026-08-06 | Active batch enrollment open | Notice text | yes |

### Join

Same batch keys as `Home` can be used here. `Home` values take priority when present.

### Contact

| key | value |
| --- | --- |
| title | Contact Support |
| address | Jharkhand, India |
| map_url | Optional Google Map URL |

### SocialLinks

| Platform | URL |
| --- | --- |
| WhatsApp | https://wa.me/917870948200 |

### Testimonials

| Student Name | Review | Rating | Image |
| --- | --- | --- | --- |
| Student Name | Review text | 5 | student.jpg |

### Gallery

| Image | Caption |
| --- | --- |
| class.jpg | Live class |

## Folder structure

```text
app/
components/
  sections/
hooks/
lib/
utils/
public/
  assets/
  excel/
types/
styles/
```

Each section receives typed props from `WebsiteData`, so future sheets such as Results, Blog, Events, or Achievements can be added with a new type, loader entry, and component.
