# The Privacy Blueprint

## TomorrowKit landing page

A static, mobile-first landing page for **TomorrowKit** — a school-admin assistant for busy UK
families. Tagline: *School admin, off your mental load.*

### Pages

| Path | File | What it is |
|---|---|---|
| `/` | `index.html` | Landing page, 11 sections (hero → final CTA) |
| `/privacy` | `privacy/index.html` | Privacy Notice, plain English |
| `/cookies` | `cookies/index.html` | Cookie Notice, plain English |

Shared assets live in `assets/css/styles.css` and `assets/js/main.js`.

### How it is built

Plain HTML, CSS and about 60 lines of JavaScript. No framework, no build step. Open `index.html`
in a browser and it works.

**Zero third-party requests.** No web fonts are fetched, no CDN is called, no analytics script is
embedded. The only outbound links on the whole site are two plain hyperlinks to the ICO. This was
verified by loading each page in a headless browser and recording every network request.

The JavaScript does two things only: toggles the mobile menu and shows the waitlist success state.
Everything else, including the FAQ accordion, works without it.

### Before you publish

1. **Wire up the waitlist form.** `#tally-embed` in `index.html` is a styled placeholder with the
   right fields. Replace its contents with the Tally embed. Keep the field set as it is — email,
   number of children, stages, optional free text — and keep the consent note underneath. Do not
   add pixels or marketing tags alongside it.
2. **Turn on analytics.** Use the host's built-in, cookieless analytics only (Framer analytics if
   hosting there). No Google Analytics, Meta Pixel, TikTok Pixel, Hotjar, Clarity or advertising
   trackers.
3. **Check the deployed site against the Cookie Notice.** Open browser dev tools on the live URL,
   look at Application → Cookies and Storage, and correct `cookies/index.html` if what is actually
   set differs from what the page describes. The page deliberately does not claim "no cookies".
4. **Fill in the supplier table** in `privacy/index.html` once hosting, form and email providers
   are confirmed, and set the real contact addresses (currently `privacy@tomorrowkit.co.uk` and
   `hello@tomorrowkit.co.uk`).
5. **Update both "Last updated" dates** if the notices change before launch.

### Design notes

- Warm cream background (`#F7F3EC`), deep forest text and buttons, muted sage accents, terracotta
  reserved for alerts and required-field markers.
- System sans-serif stack, so no font files are requested. Inter is used if the visitor happens to
  have it installed.
- Interface mockups are built in HTML and CSS rather than images, so they stay sharp, selectable
  and translatable. No photography, no children's faces.
- All colour pairs used for text meet WCAG 2.1 AA (4.5:1 or better); status is never signalled by
  colour alone, always with a symbol or word too.
- Tap targets are at least 44px, headings are semantic and in order, the mobile menu closes on
  Escape, and no page scrolls horizontally at 390px.

### Copy and compliance guardrails

The page deliberately avoids fake testimonials, invented user numbers, app-store ratings, and
absolute security claims such as "100% secure", "GDPR certified" or "military-grade encryption".
Everything about TomorrowKit is written as a product in development, because that is what it is.
