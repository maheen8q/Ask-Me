# Ask-Me

Student support site for NED University: step-by-step guides, a mentor directory, deadline reminders, a keyword FAQ helper and a support-team directory.

Plain HTML, CSS and JavaScript. No build step, no dependencies, no backend.

## Run it

- **Quickest:** open `index.html` in a browser.
- **Local server (optional):** `python3 -m http.server 8000`, then visit http://localhost:8000
- **Deploy:** upload the whole folder to any static host. Navigation uses `#/` links, so no server rewrites are needed.

## Update the content

Everything the department might change lives in **`js/data.js`**:

| Section | What it controls |
| --- | --- |
| `teams` | Support directory page (six teams) and the "who to contact" suggestions in the FAQ helper |
| `guides` | The six guides: exactly three steps each, plus the Who & Where block |
| `mentors` | Mentor directory. The department and topic filters are built from these entries automatically |
| `deadlines` | Deadline list, countdowns and reminders (`date` is `YYYY-MM-DD`, optional `time` is `HH:MM`) |
| `faq` | Intro text, suggested questions, fallback message and the keyword-matched answers |

All names, rooms, emails, phone numbers and dates in the file are **placeholders**. When real details are in, set `meta.sampleData` to `false` to hide the "Sample information" notices. Empty fields are fine: the site shows "to be confirmed" or "not listed" instead of breaking.

## How it works

- `js/lib.js` has the logic: countdown maths, reminder storage and FAQ keyword matching.
- `js/views.js` renders each page; `js/app.js` handles routing, the mobile menu and the live countdown.
- Reminder choices are saved in the browser's `localStorage` (key `askme.reminders.v1`). Nothing is sent anywhere, and reminders do not send emails or notifications.
- The FAQ helper only matches keywords against the list in `data.js`. It is not an AI chatbot, and it says so on the page.

## Design

Colours and fonts follow the Figma frames: navy `#182d3b`, maroon `#813a46`, hairline rules `#dcddd6`, Source Serif 4 for headings and DM Sans for text. The tokens are at the top of `css/styles.css`, and the fonts are included in `assets/fonts/`.

The photo on the support directory page (`assets/img/campus-staircase-library.png`) was cropped from the Figma export and is low resolution. Replace it with the original file at the same name for a sharper image.
