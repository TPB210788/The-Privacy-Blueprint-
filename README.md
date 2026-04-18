# Privacy Health Check — The Privacy Blueprint

A single-page React app that helps UK small businesses assess their data protection compliance under UK GDPR. Users answer 10 multiple-choice questions and receive an instant RAG (Red/Amber/Green) rating, their top 3 priority fixes, and an email capture for a personalised full report.

## Tech stack

- **React 18** with Vite
- **Tailwind CSS** for styling
- **Google Fonts** — Playfair Display + Inter
- No backend required (v1 logs email submissions to the browser console)

---

## Running locally

### Prerequisites

- Node.js 18+ ([download](https://nodejs.org))
- npm (comes with Node)

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/tpb210788/the-privacy-blueprint-.git
cd the-privacy-blueprint-

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Building for production

```bash
npm run build
```

The compiled output goes to `dist/`. Preview it locally with:

```bash
npm run preview
```

---

## Deploying to Vercel

### Option A — Vercel CLI (recommended)

```bash
npm install -g vercel
vercel
```

Follow the prompts. Vercel will auto-detect Vite and set the correct build settings.

### Option B — GitHub integration

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Add New Project**.
3. Import your GitHub repository.
4. Vercel auto-detects Vite — leave all build settings as default.
5. Click **Deploy**.

Every push to `main` will trigger a new deployment automatically.

The `vercel.json` at the root handles SPA routing (all paths rewrite to `index.html`).

---

## Connecting Mailchimp (v2)

Email submissions currently log to the browser console:

```js
// src/components/Results.jsx — EmailCapture component
console.log('Privacy Health Check lead:', { name, email, timestamp })
```

To connect Mailchimp:

1. Create a [Mailchimp account](https://mailchimp.com) and set up an audience.
2. Replace the `console.log` with a `fetch()` call to Mailchimp's API, or use a serverless function on Vercel (so you don't expose your API key client-side):

```js
// Example using a Vercel serverless function at /api/subscribe
await fetch('/api/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email }),
})
```

3. Create `api/subscribe.js` in the project root with your Mailchimp API logic.

---

## Project structure

```
├── index.html               # App shell, Google Fonts link
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json              # SPA routing rewrite
└── src/
    ├── main.jsx             # React entry point
    ├── App.jsx              # Screen routing + state
    ├── index.css            # Tailwind directives + component classes
    ├── data/
    │   └── questions.js     # All 10 questions, scoring logic, fix messages
    └── components/
        ├── Landing.jsx      # Start screen
        ├── Question.jsx     # Single question with progress bar
        └── Results.jsx      # Score, RAG rating, priority fixes, email form
```

## Customising questions

All questions, answer options, scores, and fix messages live in `src/data/questions.js`. The scoring is:

| Answer colour | Points |
|---|---|
| Green | 2 |
| Amber | 1 |
| Red | 0 |

Maximum score: **20** (10 questions × 2 points).

RAG thresholds:

| Rating | Score range |
|---|---|
| Green | 15–20 |
| Amber | 8–14 |
| Red | 0–7 |

---

© The Privacy Blueprint
