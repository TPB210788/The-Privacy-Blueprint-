# TomorrowKit — landing site

A static, mobile-first landing site for TomorrowKit, a UK parenting app concept.
Plain HTML, CSS and a small amount of vanilla JavaScript. No frameworks, no build
step, no analytics, no trackers, no cookies.

**Core promise:** Know what they need tomorrow.
**Tagline:** School admin, off your mental load.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The landing page (hero, problem, product sections, how it works, waitlist, FAQ, final CTA) |
| `styles.css` | All styling. Design tokens live at the top under `:root` |
| `script.js` | Mobile menu, footer year, waitlist form validation. The page works without it |
| `privacy.html` | Plain-English privacy notice (pre-launch placeholder) |
| `cookies.html` | Plain-English cookie notice (pre-launch placeholder) |
| `assets/mockups/` | The supplied TomorrowKit product mockups, plus WebP versions for speed |

## Connect the waitlist form

The form is deliberately not wired to anything yet. Until you connect it, submitting
shows an on-page message and sends nothing anywhere.

1. Create a form with a provider you trust (Tally, Formspree, Netlify Forms, Buttondown).
2. In `index.html`, find the form with `id="waitlistForm"`.
3. Replace `action="REPLACE_WITH_FORM_ENDPOINT"` with your endpoint, for example
   `action="https://formspree.io/f/xxxxxxx"`.
4. Netlify Forms instead: add `netlify` and `name="waitlist"` to the `<form>` tag and
   remove the `action` attribute.
5. Check your provider's own cookie and privacy behaviour, then update `privacy.html`
   and `cookies.html` to match. Both files have `Placeholder:` callouts marking what
   needs filling in.

The form asks for an email address, number of children, stages and one optional
free-text question. It does not ask for children's names, school names, dates of
birth, addresses or phone numbers.

## Deploy

No build step. Upload the folder, or point the host at the repository.

- **Netlify** — drag the folder into Netlify Drop, or connect the repo. Build command:
  none. Publish directory: `/`. The optional `_headers` file adds security headers.
- **Vercel** — import the repo as a static project. Framework preset: Other. Root: `/`.
- **GitHub Pages** — Settings → Pages → deploy from a branch, root folder.

## Local preview

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Privacy and technical notes

- No Google Analytics, Meta Pixel, TikTok Pixel, Hotjar, advertising trackers or
  behavioural tracking.
- No cookies, no `localStorage`, no session storage.
- No social widgets or autoplay embeds.
- The only third-party request is the DM Sans webfont from Google Fonts. To remove it
  entirely, self-host the font files and update the `<link>` tags in all three HTML
  pages, then update the table in `cookies.html`.

## Images

The mockups in `assets/mockups/` are used exactly as supplied. Each is served through
a `<picture>` element: WebP first (full size plus a 640px version for phones), with the
original PNG as the fallback. If you replace a mockup, drop in the new PNG and
regenerate the two WebP files with the same names, or delete the `<source>` line for
that image.

## Accessibility

Semantic landmarks, one `<h1>` per page, alt text on every mockup, visible focus
styles, a skip link, keyboard-accessible menu and FAQ (native `<details>`), tap targets
of at least 44px and text contrast meeting WCAG AA.

---

TomorrowKit is currently a product concept in development. Features shown on the site
are illustrative and may change before release. A privacy-first product experiment from
The Privacy Blueprint.
