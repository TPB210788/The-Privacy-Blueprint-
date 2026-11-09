"""Builds the static pages in netlify-site/ from one place.

Run:  python3 tools/build_site.py
Then zip the contents of netlify-site/ and drag the zip onto Netlify.
Shared look lives in netlify-site/assets/site.css and site.js.
"""
import json
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "netlify-site"
SITE = "https://theprivacyblueprint.co.uk"
QUIZ = "https://the-privacy-blueprint.vercel.app/"
BOOK = "https://calendar.app.google/XFwWHg2UYvFwZjiEA"
ACTION = "https://shop.beacons.ai/theprivacyblueprint/107a12ce-2d3d-4edd-ae25-ed67a79b2ab6"
LINKEDIN = "https://linkedin.com/company/the-privacy-blueprint"
EMAIL = "hello@theprivacyblueprint.co.uk"
PRIVACY = "https://the-privacy-blueprint.vercel.app/privacy-policy"
EXT = 'target="_blank" rel="noopener noreferrer"'

# ---------- Icons (simple line icons, 24px grid) ----------
_P = {
    "shield": '<path d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-3z"/><path d="M9 12l2 2 4-4"/>',
    "lock": '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>',
    "clock": '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    "inbox": '<path d="M3 13l3-8h12l3 8v6H3z"/><path d="M3 13h5l1 3h6l1-3h5"/>',
    "scale": '<path d="M12 4v16M5 20h14M6 8h12"/><path d="M6 8l-3 6a3 3 0 006 0zM18 8l-3 6a3 3 0 006 0z"/>',
    "check": '<path d="M5 12.5l4.5 4.5L19 7"/>',
    "clipboard": '<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4h6v3H9z"/><path d="M9 12h6M9 16h4"/>',
    "phone": '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2"/>',
    "search": '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    "wrench": '<path d="M14.5 6.5a4 4 0 00-5.4 5.1L4 16.7 7.3 20l5.1-5.1a4 4 0 005.1-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',
    "refresh": '<path d="M20 11a8 8 0 00-14.9-3M4 4v4h4"/><path d="M4 13a8 8 0 0014.9 3M20 20v-4h-4"/>',
    "doc": '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>',
    "table": '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M9 10v9"/>',
    "alert": '<path d="M12 3l9 16H3z"/><path d="M12 10v4M12 17h.01"/>',
    "archive": '<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v11h14V9M10 13h4"/>',
    "handshake": '<path d="M3 12l4-4 4 2 3-2 4 2 3 2"/><path d="M7 8l-4 4 6 6 2-2M21 12l-6 6-2-2M11 16l2-2M13 18l2-2"/>',
    "map": '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>',
    "rocket": '<path d="M5 15c-1 1-1.5 4-1.5 4s3-.5 4-1.5M9 13l2 2"/><path d="M14 4c3 0 6 3 6 6l-7 7-6-6 7-7z"/><circle cx="15" cy="9" r="1.5"/>',
    "code": '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13 6l-2 12"/>',
    "users": '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0112 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14a5 5 0 015 5"/>',
    "heart": '<path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z"/>',
    "chart": '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    "cpu": '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
    "msg": '<path d="M4 5h16v11H8l-4 4z"/>',
    "cookie": '<path d="M12 3a9 9 0 109 9 3 3 0 01-3-3 3 3 0 01-3-3 3 3 0 01-3-3z"/><path d="M8 11h.01M12 15h.01M9 16h.01"/>',
    "book": '<path d="M4 4h6a3 3 0 013 3v13a2 2 0 00-2-2H4zM20 4h-6a3 3 0 00-3 3"/><path d="M20 4v14h-7"/>',
    "arrow": '<path d="M5 12h14M13 6l6 6-6 6"/>',
    "menu": '<path d="M4 6h16M4 12h16M4 18h16"/>',
    "linkedin": '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7h.01M12 17v-4a2 2 0 014 0v4M12 10v7"/>',
    "mail": '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    "calendar": '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
}


def ic(name, cls=""):
    c = f' class="{cls}"' if cls else ""
    return (f'<svg{c} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" '
            f'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{_P[name]}</svg>')


LOGO = ('<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2l11 4.5v8.8c0 7-4.7 12-11 14.7C9.7 27.3 5 22.3 5 15.3V6.5z" fill="#1F4D3A"/>'
        '<circle cx="16" cy="14" r="3.2" fill="#9BE0B4"/><path d="M14.6 16.5h2.8l.9 6h-4.6z" fill="#9BE0B4"/></svg>')
LOGO_LIGHT = LOGO.replace('fill="#1F4D3A"', 'fill="#2E6B50"')

NAV = [("Services", "/services/"), ("About", "/about/"), ("Resources", "/resources/"), ("FAQs", "/faqs/")]


def page(slug, title, desc, body, extra_head=""):
    url = SITE + slug
    links = "".join(
        f'<a href="{h}" class="nav-link{" active" if h == slug else ""}">{t}</a>' for t, h in NAV)
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>{title}</title>
  <meta name="description" content="{desc}">
  <link rel="canonical" href="{url}">
  <meta property="og:title" content="{title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="{url}">
  <meta property="og:image" content="{SITE}/assets/img/office-plants.webp">
  <meta name="theme-color" content="#1F4D3A">
  <meta name="robots" content="index, follow">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="/assets/fonts/fraunces-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/assets/site.css">
{extra_head}</head>
<body>
  <header class="site-header">
    <nav class="nav-inner" aria-label="Main">
      <a href="/" class="brand">{LOGO}The Privacy Blueprint</a>
      <div class="nav-links" id="nav-links">
        {links}
        <a href="{QUIZ}" {EXT} class="nav-link">Free Health Check</a>
        <a href="{BOOK}" {EXT} class="btn nav-cta">Book a call</a>
      </div>
      <button class="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="nav-links">{ic("menu")}</button>
    </nav>
  </header>

  <main>
{body}
  </main>

  <footer class="site-footer">
    <div class="wrap">
      <div class="footer-grid">
        <div>
          <a href="/" class="brand">{LOGO_LIGHT}The Privacy Blueprint</a>
          <p>Practical, documented, jargon free privacy support for founders, SMEs, agencies and charities.</p>
          <p style="margin-top:10px">ICO registration: C1883894</p>
        </div>
        <div>
          <h4>Explore</h4>
          <ul>
            <li><a href="/services/">Services</a></li>
            <li><a href="/about/">About</a></li>
            <li><a href="/resources/">Resources</a></li>
            <li><a href="/faqs/">FAQs</a></li>
            <li><a href="{QUIZ}" {EXT}>Free Health Check</a></li>
          </ul>
        </div>
        <div>
          <h4>Get in touch</h4>
          <ul>
            <li><a href="mailto:{EMAIL}">{EMAIL}</a></li>
            <li><a href="{BOOK}" {EXT}>Book a free 20-minute call</a></li>
            <li><a href="{LINKEDIN}" {EXT}>LinkedIn</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-legal">
        <span>© <span id="year">2026</span> The Privacy Blueprint</span>
        <a href="{PRIVACY}" {EXT}>Privacy Policy</a>
        <a href="/cookie-policy/">Cookie Policy</a>
        <span>No tracking. No ad cookies.</span>
      </div>
    </div>
  </footer>

  <div class="cookie" id="cookie-notice" role="region" aria-label="Cookie notice">
    {ic("cookie")}
    <div>
      <strong>No tracking cookies here.</strong> This site doesn't use analytics or advertising cookies. We only remember that you've seen this message. <a href="/cookie-policy/">Cookie policy</a>
      <div><button class="btn btn-mint" data-cookie-ok type="button">Got it</button></div>
    </div>
  </div>

  <script src="/assets/site.js" defer></script>
</body>
</html>
'''


def photo(name, alt):
    return (f'<div class="photo reveal"><img src="/assets/img/{name}.webp" alt="{alt}" '
            f'width="1400" height="1050" loading="lazy" decoding="async"></div>')


def cta_band(title="Find out where you stand in 5 minutes",
             text="Take the free Privacy Health Check. Ten questions, an instant Red, Amber or Green rating, and your top priorities. No sign up needed."):
    return f'''
    <section class="section-tight"><div class="wrap">
      <div class="cta-band reveal">
        {ic("shield", "deco")}
        <h2>{title}</h2>
        <p>{text}</p>
        <div class="btn-row" style="margin-top:26px">
          <a href="{QUIZ}" {EXT} class="btn btn-mint">Take the free Health Check {ic("arrow")}</a>
          <a href="{BOOK}" {EXT} class="btn btn-ghost">Book a free 20-minute call</a>
        </div>
      </div>
    </div></section>
'''


DELIVERABLES = [
    ("doc", "Privacy and cookie policies", "Clear, accurate notices that match what you actually do."),
    ("table", "Record of Processing (ROPA)", "A living map of what data you hold, why, and where it goes."),
    ("search", "DPIAs", "Risk assessments for new projects, products and AI tools."),
    ("inbox", "DSAR process", "A step by step way to answer access and deletion requests on time."),
    ("alert", "Breach response plan", "Know exactly what to do in the first 72 hours."),
    ("archive", "Retention schedule", "How long you keep each type of data, and when to delete it."),
    ("handshake", "Supplier agreements", "DPAs in place with the tools and partners that handle your data."),
    ("map", "Prioritised action plan", "What to fix, in what order, in plain English."),
]


def deliverables(dark=True):
    cards = "".join(
        f'<div class="card reveal"><div class="icon">{ic(i)}</div><h3>{t}</h3><p>{d}</p></div>'
        for i, t, d in DELIVERABLES)
    cls = "bg-forest" if dark else "bg-paper"
    return f'''
    <section class="section {cls}"><div class="wrap">
      <div class="section-head center">
        <p class="kicker">What your business gets</p>
        <h2>Documents and processes you can actually use</h2>
        <p class="lead">Not a report that sits in a folder. Practical outputs that make you compliant and show it.</p>
      </div>
      <div class="grid g4 compact">{cards}</div>
    </div></section>
'''


JOURNEY = [
    ("clipboard", "var(--red)", "Free Health Check", "10 questions and an instant Red, Amber or Green score.", "Free, 5 mins"),
    ("phone", "#D0762F", "Discovery call", "We talk through your setup, goals and the best next step.", "Free, 20 mins"),
    ("search", "var(--amber)", "Assess", "A £75 Action Plan or a full Gap Assessment across 16 areas.", "From £75"),
    ("wrench", "#6E9A3A", "Fix", "Policies, ROPA, DPIAs and processes put in place properly.", "Fixed fee"),
    ("refresh", "var(--green)", "Stay compliant", "Ongoing oversight as your business and the law change.", "From £750/mo"),
]


def journey():
    steps = "".join(
        f'''<div class="j-step reveal"><div class="j-node" style="--c:{c}">{ic(i)}<span class="j-num">{n}</span></div>
        <div><h3>{t}</h3><p>{d}</p><span class="pill">{p}</span></div></div>'''
        for n, (i, c, t, d, p) in enumerate(JOURNEY, 1))
    return f'''
    <section class="section bg-sand2" id="how-it-works"><div class="wrap">
      <div class="section-head center">
        <p class="kicker">How it works</p>
        <h2>From uncertain to compliant in five steps</h2>
        <p class="lead">Start free, see where you stand, and only pay for what your business actually needs.</p>
      </div>
      <div class="journey">{steps}</div>
      <div class="center" style="margin-top:40px">
        <a href="{QUIZ}" {EXT} class="btn">Start step 1: the free Health Check {ic("arrow")}</a>
      </div>
    </div></section>
'''


def hero_card():
    rows = [("Privacy policy", "Good", "var(--green)", 100), ("Cookie consent", "Needs work", "var(--amber)", 55),
            ("Supplier DPAs", "Action", "var(--red)", 20), ("Breach plan", "Needs work", "var(--amber)", 50)]
    r = "".join(
        f'''<div style="display:grid;grid-template-columns:1fr auto;gap:6px 12px;align-items:center;padding:9px 0;border-bottom:1px solid var(--line)">
        <span style="font-size:14px;color:var(--ink)">{t}</span><span style="font-size:12px;font-weight:600;color:{c}">{l}</span>
        <span style="grid-column:1/-1;height:6px;border-radius:6px;background:var(--sand-2);overflow:hidden"><span style="display:block;height:100%;width:{w}%;background:{c};border-radius:6px"></span></span></div>'''
        for t, l, c, w in rows)
    return f'''<div class="hero-art reveal">
        <div style="background:var(--paper);border-radius:22px;padding:26px;box-shadow:0 30px 60px rgba(0,0,0,.25);max-width:420px;margin-left:auto;color:var(--ink)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <span style="font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--leaf)">Privacy Health Check</span>
            <span class="icon" style="width:38px;height:38px;margin:0;border-radius:10px">{ic("shield")}</span>
          </div>
          <div style="display:flex;align-items:baseline;gap:10px;margin-bottom:6px">
            <span style="font-family:Fraunces,serif;font-size:3.2rem;font-weight:600;line-height:1">12</span><span style="color:var(--muted)">/ 20</span>
            <span style="margin-left:auto;font-size:12px;font-weight:600;color:#8A5A00;background:#FBEBC8;padding:5px 11px;border-radius:999px">Amber rating</span>
          </div>
          {r}
          <p style="font-size:13px;color:var(--muted);margin-top:14px">Example result. Yours takes 5 minutes.</p>
        </div>
      </div>'''


# ---------- HOME ----------
def home():
    stats = [
        ("72 hrs", "stat-red", "to report a serious data breach to the ICO."),
        ("1 month", "stat-amber", "to respond when someone asks for a copy of their data."),
        ("£17.5m", "", "maximum UK GDPR fine, or 4% of global turnover if higher."),
    ]
    st = "".join(f'<div class="card reveal"><div class="stat {c}">{n}</div><p>{t}</p></div>' for n, c, t in stats)
    who = ["Founders building data protection into their products from day one",
           "SaaS and AI startups navigating UK GDPR and the Data (Use and Access) Act 2025",
           "SMEs that need structured compliance without the cost of a full-time hire",
           "Agencies handling client data who need a credible, documented position",
           "Charities and third sector organisations with limited compliance resource"]
    svcs = [
        ("map", "Start here", "Privacy Action Plan", "A personal review of your Health Check results and setup, with a 30/60/90 day plan.", "£75", "/services/#start-here", True),
        ("search", "Service 01", "GDPR Gap Assessment", "A structured audit across 16 compliance areas with risk-weighted scoring and a clear action plan.", "From £850", "/services/#gap-assessment", False),
        ("cpu", "Service 02", "DPIA and AI Governance", "Impact assessments to ICO standard, plus governance reviews for AI tools you build or buy.", "From £650", "/services/#dpia", False),
        ("refresh", "Service 03", "Fractional Privacy Support", "A senior privacy practitioner in your team every month, without a full-time hire.", "From £750/mo", "/services/#fractional", False),
    ]
    sc = "".join(
        f'''<div class="card svc reveal{" svc-featured" if f else ""}"><div class="icon">{ic(i)}</div><p class="tag">{tag}</p><h3>{t}</h3><p>{d}</p>
        <div class="price"><strong>{p}</strong><a href="{h}" class="text-link">Find out more →</a></div></div>'''
        for i, tag, t, d, p, h, f in svcs)
    body = f'''
    <section class="hero"><div class="wrap">
      <div class="hero-grid">
        <div>
          <p class="kicker">Independent privacy consultancy</p>
          <h1>GDPR compliance that's practical, documented and jargon free</h1>
          <p class="lead">For founders, SMEs, agencies and charities. Gap assessments, DPIAs and ongoing privacy support from a practitioner with ten years of in-house experience.</p>
          <div class="btn-row">
            <a href="{QUIZ}" {EXT} class="btn btn-mint">Take the free Health Check {ic("arrow")}</a>
            <a href="{BOOK}" {EXT} class="btn btn-ghost">Book a free call</a>
          </div>
        </div>
        {hero_card()}
      </div>
    </div></section>

    <div class="trust"><div class="wrap"><ul>
      <li>{ic("check")} 10 years in-house experience</li>
      <li>{ic("shield")} ICO registered: C1883894</li>
      <li>{ic("scale")} Updated for the Data (Use and Access) Act 2025</li>
      <li>{ic("lock")} Fixed fees, no surprises</li>
    </ul></div></div>

    <section class="section"><div class="wrap">
      <div class="section-head center">
        <p class="kicker">Why it matters</p>
        <h2>The deadlines most small businesses don't know about</h2>
        <p class="lead">UK GDPR applies whatever your size. Most businesses only find out when a customer, a client or the ICO asks.</p>
      </div>
      <div class="grid g3">{st}</div>
    </div></section>

    {journey()}

    <section class="section"><div class="wrap split">
      {photo("office-plants", "Bright, plant filled office workspace")}
      <div class="reveal">
        <p class="kicker">Who we work with</p>
        <h2>Built for businesses navigating real compliance risk</h2>
        <ul class="checks" style="margin-top:18px">{"".join(f"<li>{w}</li>" for w in who)}</ul>
      </div>
    </div></section>

    {deliverables()}

    <section class="section"><div class="wrap">
      <div class="section-head center">
        <p class="kicker">Services</p>
        <h2>Support at every stage</h2>
        <p class="lead">Start small with a £75 Action Plan, or choose the engagement that fits where you are.</p>
      </div>
      <div class="grid g2">{sc}</div>
    </div></section>

    <section class="section bg-paper"><div class="wrap split flip">
      {photo("desk-review", "Reviewing compliance documents at a laptop")}
      <div class="reveal">
        <p class="kicker">Ten years in-house. One practical approach.</p>
        <h2>Grounded in real operational experience</h2>
        <p class="muted">The Privacy Blueprint is run by an in-house privacy practitioner with ten years of experience at a major UK charity: building an organisation-wide DPIA process, managing subject access requests at volume, and reporting privacy metrics directly to the C-suite.</p>
        <p class="muted">That experience is built into a proprietary gap assessment covering 16 compliance areas with risk-weighted scoring, updated for the Data (Use and Access) Act 2025.</p>
        <a href="/about/" class="text-link">More about our approach →</a>
      </div>
    </div></section>

    <section class="section bg-forest center"><div class="wrap">
      <p class="quote reveal">"Practical. Documented. No jargon. Compliance that helps your business move faster, not slower."</p>
    </div></section>

    {cta_band()}
'''
    return page("/", "The Privacy Blueprint | Practical GDPR Consultancy",
                "Practical, jargon free UK GDPR support for founders, SMEs, agencies and charities. Free Privacy Health Check, gap assessments, DPIAs and fractional privacy support.",
                body)


# ---------- ABOUT ----------
def about():
    facts = [
        ("clock", "10 years", "running a privacy function inside a major UK charity"),
        ("search", "Organisation wide", "DPIA process built and run from the ground up"),
        ("inbox", "High volume", "data subject access requests managed end to end"),
        ("chart", "Board level", "privacy metrics reported directly to the C-suite"),
        ("clipboard", "16 areas", "covered by our risk-weighted gap assessment, updated for the Data (Use and Access) Act 2025"),
        ("shield", "ICO registered", "registration number C1883894"),
    ]
    fc = "".join(f'<div class="card reveal"><div class="icon">{ic(i)}</div><div class="stat" style="font-size:1.6rem">{t}</div><p>{d}</p></div>' for i, t, d in facts)
    values = [("map", "Practical", "Advice that fits how your business actually runs, not a theoretical framework."),
              ("doc", "Documented", "Everything written down, so you can show compliance as well as achieve it."),
              ("msg", "No jargon", "Plain English throughout. You'll always know what to do and why.")]
    vc = "".join(f'<div class="card reveal"><div class="icon">{ic(i)}</div><h3>{t}</h3><p>{d}</p></div>' for i, t, d in values)
    body = f'''
    <section class="hero page-hero"><div class="wrap hero-grid">
      <div>
        <p class="kicker">About</p>
        <h1>A consultancy built on operational experience</h1>
        <p class="lead">Not advisory distance. Ten years of running privacy inside a real organisation, now applied to yours.</p>
        <a href="{BOOK}" {EXT} class="btn btn-mint">Book a free 20-minute call {ic("arrow")}</a>
      </div>
      {photo("bright-desk", "Calm, bright home office desk")}
    </div></section>

    <section class="section"><div class="wrap split">
      <div class="reveal">
        <p class="kicker">The approach</p>
        <h2>Most privacy consultants come from legal or advisory backgrounds. This is different.</h2>
        <p class="muted">The Privacy Blueprint is built on ten years of in-house experience running a privacy function inside a major UK charity, solving real compliance problems at real operational scale.</p>
        <p class="muted">That means the work is grounded in what actually happens inside an organisation: the DPIA request that arrives at the wrong time, the subject access request that lands on a Friday afternoon, the supplier with no data processing agreement, the reporting line that needs educating rather than just a policy document.</p>
      </div>
      {photo("signing-documents", "Reviewing and signing compliance paperwork")}
    </div></section>

    <section class="section bg-sand2"><div class="wrap">
      <div class="section-head center">
        <p class="kicker">At a glance</p>
        <h2>Experience you can rely on</h2>
      </div>
      <div class="grid g3">{fc}</div>
    </div></section>

    <section class="section"><div class="wrap split flip">
      <div class="reveal">
        <p class="kicker">The philosophy</p>
        <h2>Privacy compliance should be enabling, not obstructing</h2>
        <p class="muted">A well run privacy function helps organisations build trust, move faster on products and data initiatives, and avoid the regulatory and reputational cost of getting it wrong.</p>
        <p class="muted">The Privacy Blueprint exists to make that kind of compliance accessible to founders, SMEs and growing teams who can't justify a full-time privacy hire but need the real thing, not a checkbox exercise.</p>
      </div>
      {photo("handshake", "Handshake agreeing a new engagement")}
    </div></section>

    <section class="section bg-forest"><div class="wrap">
      <div class="section-head center"><p class="kicker">What to expect</p><h2>Three promises on every engagement</h2></div>
      <div class="grid g3">{vc}</div>
    </div></section>

    <!--
      TESTIMONIALS: add real client quotes here when you have them.
      Faceless friendly format: quote, then initials plus business type.
      <section class="section"><div class="wrap narrow center">
        <p class="kicker">What clients say</p>
        <p class="quote" style="color:var(--ink)">"Quote goes here."</p>
        <p class="muted" style="margin-top:14px">S.M., founder, online coaching business</p>
      </div></section>
    -->

    {cta_band("Ready to get compliant?", "Start with the free Health Check, or book a free 20-minute call to talk through your business. No obligation, no sales pitch.")}
'''
    return page("/about/", "About | The Privacy Blueprint",
                "Ten years of in-house data protection experience at a major UK charity. A practitioner's approach to GDPR compliance for founders, SMEs and agencies.", body)


# ---------- SERVICES ----------
def aside(rows, price, note, btn_text="Book a free 20-minute call", href=BOOK):
    r = "".join(f'<div class="row">{k}<strong>{v}</strong></div>' for k, v in rows)
    n = f'<p style="font-size:13px;color:var(--muted);margin-top:12px">{note}</p>' if note else ""
    return f'''<div class="aside reveal"><div class="big">{price}</div>{r}{n}<a href="{href}" {EXT} class="btn">{btn_text}</a></div>'''


def lst(items):
    return '<ul class="checks">' + "".join(f"<li>{i}</li>" for i in items) + "</ul>"


def services():
    tiers = [("Essentials", "£750", ["Around 4 hours a month", "Email support", "Monthly check-in call"]),
             ("Standard", "£1,250", ["Around 1 day a month", "DPIA reviews", "Quarterly privacy report"]),
             ("Embedded", "£2,000", ["Up to 1 day a week", "Acting as your part-time privacy lead"])]
    tc = "".join(f'<div class="tier"><div class="tier-name">{n}</div><div class="tier-price">{p} <span>/ month</span></div><ul>{"".join(f"<li>{x}</li>" for x in l)}</ul></div>' for n, p, l in tiers)
    body = f'''
    <section class="hero page-hero"><div class="wrap hero-grid">
      <div>
        <p class="kicker">Services</p>
        <h1>Support scoped to where you are</h1>
        <p class="lead">Start small with a £75 Action Plan, or choose one of three engagements built around what your business actually needs.</p>
        <div class="btn-row">
          <a href="#start-here" class="btn btn-mint">See where to start {ic("arrow")}</a>
          <a href="{BOOK}" {EXT} class="btn btn-ghost">Book a free call</a>
        </div>
      </div>
      {photo("typing-laptop", "Working through compliance tasks on a laptop")}
    </div></section>

    {journey()}

    <section class="section" id="start-here"><div class="wrap detail">
      <div class="reveal">
        <span class="num-badge">{ic("map")}</span>
        <p class="kicker">Start here</p>
        <h2>Privacy Action Plan</h2>
        <p class="muted">Not ready for a full engagement? Take the free Health Check, then get a personal review of your results and a prioritised plan built for your business.</p>
        <p class="sub-head">What's included</p>
        {lst(["Manual review of your Health Check results and current setup", "Prioritised 30/60/90 day action plan", "15 minute follow up call", "Delivered within 5 working days"])}
        <p style="margin-top:18px"><a href="{QUIZ}" {EXT} class="text-link">Haven't taken the Health Check yet? Start here →</a></p>
      </div>
      {aside([("Delivery", "Within 5 working days"), ("Format", "Written plan plus 15 min call")], "£75", "Credited in full against a Gap Assessment booked within 30 days.", "Get your Action Plan", ACTION)}
    </div></section>

    <section class="section bg-paper" id="gap-assessment"><div class="wrap detail">
      <div class="reveal">
        <span class="num-badge">01</span>
        <h2>GDPR Gap Assessment</h2>
        <p class="muted">A structured audit of your data protection position across 16 compliance areas, using a proprietary risk-weighted scoring method. A clear, prioritised picture of where you stand and what to fix first.</p>
        <p class="sub-head">What's included</p>
        {lst(["Assessment across 16 areas, including lawful basis, consent, data subject rights, breach management, supplier agreements, retention, international transfers and Data (Use and Access) Act 2025 readiness", "Risk-weighted scoring for each area, prioritised by severity", "Written report with findings and a clear action plan", "30 minute debrief call to walk through the report"])}
        <p class="sub-head">Who it's for</p>
        {lst(["Businesses starting out who want to understand their gaps before investing in fixes", "Organisations preparing for a contract with a large client or public sector body", "Companies that have grown quickly and aren't sure their setup has kept pace"])}
        <div class="callout"><strong>Bonus:</strong> move to a monthly retainer within 30 days and we'll credit your assessment fee against your first month.</div>
      </div>
      {aside([("Timeline", "5 to 10 working days"), ("Includes", "Report, scoring and debrief call")], "From £850", "")}
    </div></section>

    <section class="section" id="dpia"><div class="wrap detail">
      <div class="reveal">
        <span class="num-badge">02</span>
        <h2>DPIA and AI Governance</h2>
        <p class="muted">Data Protection Impact Assessments completed in line with ICO guidance, plus AI governance reviews for businesses developing or buying AI tools.</p>
        <div class="callout"><strong>What is a DPIA?</strong> A structured way to spot and reduce the privacy risks of a new project, system or product. Under UK GDPR it's legally required for some high-risk processing. Getting it wrong means a project is non-compliant before it starts.</div>
        <p class="sub-head">What's included</p>
        {lst(["Scoping session to decide whether a full DPIA or a documented threshold assessment is needed", "Full DPIA completed to ICO standard where required", "AI governance review: data flows, model inputs, supplier agreements and ICO guidance alignment", "Written output ready to share with stakeholders, regulators or clients"])}
        <p class="sub-head">Who it's for</p>
        {lst(["Businesses launching new products, features or data-heavy projects", "Founders and SaaS companies building or integrating AI tools", "Teams who've tried a DPIA internally but aren't confident it meets ICO requirements"])}
      </div>
      {aside([("Timeline", "5 to 15 working days"), ("Complex AI reviews", "From £1,000")], "From £650", "")}
    </div></section>

    <section class="section bg-paper" id="fractional"><div class="wrap">
      <div class="detail">
        <div class="reveal">
          <span class="num-badge">03</span>
          <h2>Fractional Privacy Support</h2>
          <p class="muted">Ongoing privacy oversight on a monthly retainer. The equivalent of a senior privacy practitioner in your team, without the cost of a full-time hire.</p>
          <p class="sub-head">What the retainer covers</p>
          {lst(["Oversight and advisory time every month", "DPIA review and sign-off", "Record of Processing Activities (ROPA) maintenance", "Subject access and erasure request support", "Input on product and market expansion decisions", "Rapid response support for data incidents"])}
        </div>
        {aside([("Minimum term", "Three months"), ("Best for", "Growing teams, agencies, charities")], "From £750/mo", "Not sure which level fits? We'll recommend one on your free call.")}
      </div>
      <p class="sub-head" style="margin-top:44px">Retainer levels</p>
      <div class="grid g3 reveal">{tc}</div>
    </div></section>

    {deliverables()}

    <section class="section-tight"><div class="wrap center">
      <p class="muted">Got questions about pricing, timelines or how it works? <a href="/faqs/" class="text-link">Read the FAQs →</a></p>
    </div></section>

    {cta_band("Not sure which one is right for you?", "Every engagement starts with a free 20-minute call. We'll talk through your business, your current setup and the best path forward. No pressure, no sales pitch.")}
'''
    return page("/services/", "Services | The Privacy Blueprint",
                "GDPR gap assessment, DPIA, AI governance and fractional privacy support for growing businesses. Fixed fees, practical outputs, plain English.", body)


# ---------- RESOURCES ----------
def resources():
    body = f'''
    <section class="hero page-hero"><div class="wrap narrow">
      <p class="kicker">Resources</p>
      <h1>Tools to help you get GDPR right</h1>
      <p class="lead">Free tools and practical next steps for understanding and implementing data protection in your business.</p>
    </div></section>

    <section class="section"><div class="wrap split">
      <div class="reveal">
        <p class="kicker">Free tool</p>
        <h2>Privacy Health Check</h2>
        <p class="muted">Not sure where your business stands? Answer 10 questions about the most common compliance gaps and get an instant Red, Amber or Green rating, a full breakdown and a prioritised action plan.</p>
        {lst(["Takes under 5 minutes", "No sign up required", "Instant results you can save or print"])}
        <div style="margin-top:24px"><a href="{QUIZ}" {EXT} class="btn">Take the free Health Check {ic("arrow")}</a></div>
      </div>
      {photo("checklist-notebook", "Working through a checklist in a notebook")}
    </div></section>

    <section class="section bg-sand2"><div class="wrap">
      <div class="section-head center"><p class="kicker">Next steps</p><h2>Where to go from here</h2></div>
      <div class="grid g3">
        <div class="card svc reveal"><div class="icon">{ic("map")}</div><h3>Privacy Action Plan</h3><p>Turn your Health Check results into a personal 30/60/90 day plan, with a 15 minute call.</p><div class="price"><strong>£75</strong><a href="{ACTION}" {EXT} class="text-link">Get yours →</a></div></div>
        <div class="card svc reveal"><div class="icon">{ic("book")}</div><h3>Frequently asked questions</h3><p>Plain English answers on ICO registration, cookies, fines, pricing and working with us.</p><div class="price"><span></span><a href="/faqs/" class="text-link">Read the FAQs →</a></div></div>
        <div class="card svc reveal"><div class="icon">{ic("linkedin")}</div><h3>Follow on LinkedIn</h3><p>Updates on UK GDPR, the Data (Use and Access) Act 2025 and data protection news.</p><div class="price"><span></span><a href="{LINKEDIN}" {EXT} class="text-link">Follow →</a></div></div>
      </div>
      <!--
        TEMPLATES: when the Practitioner Toolkit is ready, add a card here, e.g.
        <div class="card svc reveal"><div class="icon">(icon)</div><h3>Practitioner Toolkit</h3><p>Description</p>
        <div class="price"><strong>£99</strong><a href="LINK" class="text-link">Buy →</a></div></div>
      -->
    </div></section>

    {cta_band()}
'''
    return page("/resources/", "Resources | The Privacy Blueprint",
                "Free GDPR Privacy Health Check, practical next steps and plain English data protection resources from The Privacy Blueprint.", body)


# ---------- FAQS ----------
FAQS = [
    ("GDPR and your business", [
        ("Does UK GDPR apply to my small business?",
         "Almost certainly. UK GDPR applies to any business that handles personal data about people, whatever its size. That includes customer names and emails, mailing lists, staff records, enquiry forms and payment details. A few record keeping rules are lighter for smaller organisations, but the core duties apply to everyone."),
        ("Do I need to register with the ICO?",
         "Most businesses that handle personal data must pay the ICO's annual data protection fee, unless they're exempt. For most micro businesses it starts at £52 a year (£47 by direct debit). The ICO has a short online self assessment to check whether you need to pay. It's also question 8 of our <a href=\"" + QUIZ + "\" target=\"_blank\" rel=\"noopener noreferrer\">free Health Check</a>."),
        ("What happens if I get it wrong?",
         "The ICO can issue reprimands, enforcement notices and fines of up to £17.5 million or 4% of global annual turnover. For small businesses, the more common risks are customer complaints, subject access requests you can't answer in time, and losing contracts with larger clients who ask for evidence of compliance."),
        ("Do I need a cookie banner?",
         "If your website uses non-essential cookies, such as most analytics, advertising or social media pixels, you generally need consent first, with an equally easy way to say no. Strictly necessary cookies don't need consent. The Data (Use and Access) Act 2025 relaxes the rules for some low risk cookies, but you still need to tell people clearly what you use."),
        ("What is the Data (Use and Access) Act 2025?",
         "It's the biggest update to UK data protection law since UK GDPR. Its changes are being introduced in stages and cover areas including cookies, how organisations handle data protection complaints, legitimate interests and automated decision making. Our Gap Assessment checks your readiness for it."),
    ]),
    ("Working with us", [
        ("Which service is right for me?",
         "If you're not sure where you stand, start with the <a href=\"" + QUIZ + "\" target=\"_blank\" rel=\"noopener noreferrer\">free Health Check</a>. If you want a personal plan you can work through yourself, choose the £75 Action Plan. For a full professional audit, choose the Gap Assessment. If you're launching something new or using AI, a DPIA. If you want ongoing support, the Fractional retainer. Or <a href=\"" + BOOK + "\" target=\"_blank\" rel=\"noopener noreferrer\">book a free call</a> and we'll recommend one."),
        ("Who will I be working with?",
         "An experienced privacy practitioner with ten years of in-house experience at a major UK charity. The same person works on your engagement from start to finish."),
        ("Is this legal advice?",
         "No. The Privacy Blueprint provides practical privacy consultancy from an operational practitioner, not legal advice from a solicitor. If something needs formal legal advice, we'll tell you."),
        ("What happens on the free 20-minute call?",
         "We talk through your business, the data you handle, your current setup and what you want to achieve. You'll leave with a clear recommended next step. No obligation and no sales pitch."),
        ("Is what I share kept confidential?",
         "Yes. Everything you share is treated as confidential and only used to deliver your engagement, in line with our <a href=\"" + PRIVACY + "\" target=\"_blank\" rel=\"noopener noreferrer\">privacy policy</a>."),
    ]),
    ("Pricing and timelines", [
        ("How much does it cost?",
         "The Privacy Action Plan is £75. Gap Assessments start from £850, DPIAs from £650 (complex AI reviews from £1,000), and Fractional Privacy Support from £750 a month. Every project gets a clear written scope and fee before work starts."),
        ("Are prices fixed?",
         "Yes. Projects are quoted as a fixed fee after scoping, and retainers are a set monthly fee. No surprises."),
        ("How long does it take?",
         "Action Plans are delivered within 5 working days. Gap Assessments take 5 to 10 working days and DPIAs 5 to 15 working days, depending on complexity."),
        ("Is there a minimum term for the retainer?",
         "Yes, three months. After that it continues month to month."),
        ("Can I upgrade later?",
         "Yes. The £75 Action Plan is credited in full against a Gap Assessment booked within 30 days, and a Gap Assessment fee is credited against your first retainer month if you move to a retainer within 30 days."),
    ]),
    ("The free Health Check", [
        ("Is the Health Check really free?",
         "Yes. Ten questions, no sign up, and your results appear instantly on screen. You can save or print them."),
        ("What happens to my answers?",
         "Your answers stay in your browser unless you choose to email yourself a copy of your results. If you do, we use your email address only to send your report, as set out in our <a href=\"" + PRIVACY + "\" target=\"_blank\" rel=\"noopener noreferrer\">privacy policy</a>."),
    ]),
]


def faqs():
    groups = ""
    ld = []
    for g, qs in FAQS:
        items = "".join(f'<details class="faq"><summary>{q}</summary><div class="a"><p>{a}</p></div></details>' for q, a in qs)
        groups += f'<div class="faq-group reveal"><h2>{g}</h2>{items}</div>'
        for q, a in qs:
            import re
            ld.append({"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": re.sub(r"<[^>]+>", "", a)}})
    schema = json.dumps({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": ld}, ensure_ascii=False)
    body = f'''
    <section class="hero page-hero"><div class="wrap narrow">
      <p class="kicker">FAQs</p>
      <h1>Questions, answered in plain English</h1>
      <p class="lead">Everything you might want to know about GDPR, working with us and pricing. Can't find your answer? <a href="mailto:{EMAIL}" style="color:var(--mint)">Email us</a>.</p>
    </div></section>

    <section class="section"><div class="wrap narrow">{groups}</div></section>

    {cta_band("Still have a question?", "Book a free 20-minute call and ask us anything, or start with the free Health Check to see where you stand.")}
'''
    head = f'  <script type="application/ld+json">{schema}</script>\n'
    return page("/faqs/", "FAQs | The Privacy Blueprint",
                "Plain English answers on UK GDPR, ICO registration, cookies, fines, pricing and working with The Privacy Blueprint.", body, head)


# ---------- COOKIE POLICY ----------
def cookies():
    body = f'''
    <section class="hero page-hero"><div class="wrap narrow">
      <p class="kicker">Cookie policy</p>
      <h1>We don't track you</h1>
      <p class="lead">This website does not use analytics, advertising or social media tracking cookies.</p>
    </div></section>
    <section class="section"><div class="wrap narrow">
      <div class="card" style="box-shadow:none">
        <h2 style="font-size:1.4rem">What this site stores</h2>
        <p class="muted">We store one small item in your browser's local storage, called <code>tpb-cookie-notice</code>. It only remembers that you've dismissed the cookie notice, so we don't show it again. It contains no personal information and is never sent to us. You can clear it at any time in your browser settings.</p>
        <h2 style="font-size:1.4rem;margin-top:28px">No third party requests</h2>
        <p class="muted">Fonts and images on this site are hosted on our own server, so loading a page doesn't send your details to font or image providers.</p>
        <h2 style="font-size:1.4rem;margin-top:28px">Links to other services</h2>
        <p class="muted">Some links take you to other services: our free Health Check, our booking calendar (Google Calendar), our shop (Beacons) and LinkedIn. Those services have their own privacy and cookie policies, which apply once you're on their sites.</p>
        <h2 style="font-size:1.4rem;margin-top:28px">Changes and contact</h2>
        <p class="muted">If we ever add analytics or other non-essential cookies, we'll update this policy and ask for your consent first. Questions? Email <a href="mailto:{EMAIL}" class="text-link">{EMAIL}</a>.</p>
        <p class="muted" style="margin-top:20px;font-size:13px">Last updated: November 2026</p>
      </div>
    </div></section>
'''
    return page("/cookie-policy/", "Cookie Policy | The Privacy Blueprint",
                "The Privacy Blueprint does not use tracking or advertising cookies. Here's exactly what this site stores.", body)


FAVICON = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M16 2l11 4.5v8.8c0 7-4.7 12-11 14.7C9.7 27.3 5 22.3 5 15.3V6.5z" fill="#1F4D3A"/>'
           '<circle cx="16" cy="14" r="3.2" fill="#9BE0B4"/><path d="M14.6 16.5h2.8l.9 6h-4.6z" fill="#9BE0B4"/></svg>')

if __name__ == "__main__":
    pages = {"index.html": home(), "about/index.html": about(), "services/index.html": services(),
             "resources/index.html": resources(), "faqs/index.html": faqs(), "cookie-policy/index.html": cookies()}
    for path, html in pages.items():
        p = OUT / path
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(html, encoding="utf-8")
        print("wrote", p.relative_to(OUT.parent))
    (OUT / "assets" / "favicon.svg").write_text(FAVICON, encoding="utf-8")
    urls = ["/", "/services/", "/about/", "/resources/", "/faqs/", "/cookie-policy/"]
    (OUT / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "".join(f"  <url><loc>{SITE}{u}</loc></url>\n" for u in urls) + "</urlset>\n", encoding="utf-8")
