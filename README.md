# Diploma Coaching Frontend

Premium landing site for Jharkhand Polytechnic online tuition. The site uses Next.js, TypeScript, Tailwind CSS, Framer Motion, Lucide icons, and Google Sheets as a live mini CMS.

## Run locally

```bash
npm install
npm run create:excel
npm run dev
```

Open `http://localhost:3000`.

## Live Google Sheets CMS

The website reads content section-wise from this Google Sheet:

```text
https://docs.google.com/spreadsheets/d/1O2JYWpTJk8Ek0MmV50Pz5HogEpFevZmwVk3YH59tNC4/edit
```

Set the Sheet ID in `.env.local`:

```text
NEXT_PUBLIC_GOOGLE_SHEET_ID=1O2JYWpTJk8Ek0MmV50Pz5HogEpFevZmwVk3YH59tNC4
GOOGLE_SHEET_ID=1O2JYWpTJk8Ek0MmV50Pz5HogEpFevZmwVk3YH59tNC4
```

For no-rebuild updates, the Google Sheet must be public enough for the website to fetch CSV data:

1. Open Google Sheet.
2. Click `Share`.
3. Set access to `Anyone with the link can view`.
4. Prefer clear tab names like `Settings`, `Home`, `Courses`, `FAQ`, etc.

The page uses dynamic rendering with `cache: "no-store"`, so content changes appear on refresh without a rebuild.

If you want simple numbered tabs, the loader also supports this order:

| Tab | Website section |
| --- | --- |
| Sheet1 | Settings |
| Sheet2 | Home |
| Sheet3 | About |
| Sheet4 | Courses |
| Sheet5 | Faculty |
| Sheet6 | FAQ |
| Sheet7 | Notice |
| Sheet8 | Join |
| Sheet9 | Contact |
| Sheet10 | SocialLinks |
| Sheet11 | Testimonials |
| Sheet12 | Gallery |

## Drive images

Images can live in Google Drive. Put the public Drive link directly in the sheet image cell.

Supported examples:

```text
https://drive.google.com/file/d/FILE_ID/view?usp=sharing
https://drive.google.com/open?id=FILE_ID
```

Each Drive image must be shared as `Anyone with the link can view`.

Local filenames still work too:

```text
hero.jpg
faculty-sahil.jpg
```

Those files are loaded from:

```text
public/assets/
```

## Optional Excel fallback

Replace this file:

```text
public/excel/website-data.xlsx
```

If the Google Sheet cannot be read, the site falls back to this Excel file. Images referenced inside Excel should be placed in:

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
| hero_video_url | https://www.youtube.com/watch?v=szj5j8-9L_c |
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

Use one row per batch card. Add as many active or upcoming rows as needed.

| Status | Title | Branch | Semester | Session | Description | Fees | Timing | Form URL | Button |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| active | Active Batch | Electrical Engineering | 4th Semester | Session 2024-2027 | Full syllabus live classes | Contact for fees | 7:00 PM | Google Form URL | Join Now |
| active | Active Batch | Civil Engineering | 3rd Semester | Session 2024-2027 | Notes plus practice | Contact for fees | 8:00 PM | Google Form URL | Join Now |
| upcoming | Coming Soon | 1st Semester | All Branches | Session 2026-2029 | Foundation batch | Announcing soon | Coming soon | Google Form URL | Register Now |

Allowed `Status` values:

```text
active
upcoming
coming
coming soon
```

The hero section uses the first `active` row and first `upcoming` row from this sheet.

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
