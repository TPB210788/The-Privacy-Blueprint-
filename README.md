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

The form is not wired to anything yet. Until it is, submitting shows a message
on the page and sends nothing anywhere.

**The whole job is one line.** Open `script.js`, find `FORM_ENDPOINT` near the
top, and paste your endpoint between the quotes:

```js
var FORM_ENDPOINT = 'https://formspree.io/f/xxxxxxx';
```

Where to get that endpoint:

| Provider | What you do | Free tier |
| --- | --- | --- |
| **Netlify Forms** | Only if you host on Netlify. Add `netlify data-netlify="true" name="waitlist"` to the `<form>` tag in `index.html` and delete its `action`. Leave `FORM_ENDPOINT` empty. Submissions appear in your Netlify dashboard | 100 a month |
| **Formspree** | Sign up, create a form, copy the URL it gives you | 50 a month |
| **Tally** | Build a form, publish it, use its endpoint | Unlimited |
| **Buttondown** | Good if you want the list to be a mailing list from day one | 100 subscribers |

Netlify Forms keeps the data with your host and adds no third party, so it is
the best fit for a privacy-first site if you are hosting there.

After connecting it:

1. Send yourself a test sign-up and check it arrives.
2. Turn on email notifications in the provider so you hear about new sign-ups.
3. Fill in the `Placeholder:` callouts in `privacy.html` and `cookies.html`
   with the provider's name, where it stores data, and whether it sets cookies.

The form already includes a hidden honeypot field named `_gotcha`, which most
providers understand as a spam trap and which real people never fill in.

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
