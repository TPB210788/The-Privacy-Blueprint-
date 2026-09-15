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

## The waitlist form

**Already connected — to Netlify Forms.** There is no endpoint to paste and no
API key. The form carries `data-netlify="true"`, so Netlify detects it when the
site deploys and stores sign-ups under **Forms → waitlist** in your site
dashboard. No third-party form company is involved and no cookie is set.

What you still need to do, once:

1. Deploy the site to Netlify (see below). The form is detected on that deploy.
2. In Netlify: **Forms → Settings and usage → Form notifications → Add
   notification → Email notification**, so new sign-ups reach your inbox.
3. Submit a test sign-up on the live site and check it appears in Forms.
4. Netlify stores submissions in the United States. Confirm the transfer
   safeguard you rely on and record it in `privacy.html`, where a callout marks
   the spot.

How it behaves: the form posts in the background and swaps itself for a
confirmation message, so the page never navigates away. With JavaScript off the
browser posts normally and Netlify shows its own confirmation page, so sign-ups
work either way. A hidden `_gotcha` field is the spam trap, declared to Netlify
with `netlify-honeypot`.

Free tier is 100 submissions a month. Moving to another provider later means
putting its endpoint in `FORM_ENDPOINT` in `script.js` and removing
`data-netlify` from the form tag.

## Deploy

No build step. Upload the folder, or point the host at the repository.

- **Netlify** (what this site is set up for) — connect the repository, or drag the
  folder into Netlify Drop. `netlify.toml` sets the publish directory, security
  headers and font caching, so there is nothing to configure in the UI.
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
- No third-party requests at all. Fraunces and Instrument Sans are served from
  `assets/fonts` rather than from Google Fonts.
- The calendar brand marks are inline SVG paths, so no logo files are fetched.
  Check each company's brand guidelines before launch if you keep them.

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
