"""Builds the static pages in netlify-site/ from one place.

Run:  python3 tools/build_site.py
Then zip the contents of netlify-site/ and drag the zip onto Netlify.
Shared look lives in netlify-site/assets/site.css and site.js.
"""
import json
import re
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

_P = {
    "menu": '<path d="M4 7h16M4 12h16M4 17h16"/>',
    "mail": '<rect x="3" y="5" width="18" height="14"/><path d="M3 7l9 6 9-6"/>',
    "calendar": '<rect x="3" y="5" width="18" height="16"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    "linkedin": '<rect x="3" y="3" width="18" height="18"/><path d="M8 10v7M8 7h.01M12 17v-4a2 2 0 014 0v4M12 10v7"/>',
}


def ic(name):
    return (f'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" '
            f'stroke-linecap="square" aria-hidden="true">{_P[name]}</svg>')


# Logo: a simple keyhole inside a blueprint style square frame
LOGO = '<img src="/assets/logo.svg" alt="" width="34" height="34">'

NAV = [("Services", "/services/"), ("About", "/about/"), ("Resources", "/resources/"), ("FAQs", "/faqs/")]


def page(slug, title, desc, body, extra_head=""):
    url = SITE + slug
    links = "".join(f'<a href="{h}" class="nav-link{" active" if h == slug else ""}">{t}</a>' for t, h in NAV)
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
  <meta name="theme-color" content="#1C2B4A">
  <meta name="robots" content="index, follow">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="/assets/fonts/playfair-display-latin-500-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/assets/site.css">
{extra_head}</head>
<body>
  <header class="site-header">
    <nav class="nav-inner" aria-label="Main">
      <a href="/" class="brand">{LOGO}The Privacy Blueprint</a>
      <div class="nav-links" id="nav-links">
        {links}
        <a href="{QUIZ}" {EXT} class="nav-link">Health Check</a>
        <a href="{BOOK}" {EXT} class="btn btn-solid nav-cta">Book a call</a>
      </div>
      <button class="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="nav-links">{ic("menu")}</button>
    </nav>
  </header>

  <main>
{body}
  </main>

  <footer class="site-footer">
    <div class="wrap">
      <div class="footer-inner">
        <div>
          <a href="/" class="brand" style="margin-bottom:14px">{LOGO}The Privacy Blueprint</a>
          <p>Independent privacy and UK GDPR consultancy for founders, SMEs, agencies and charities.</p>
          <p style="margin-top:8px">ICO registration C1883894</p>
        </div>
        <div>
          <h4>Explore</h4>
          <ul>
            <li><a href="/services/">Services</a></li>
            <li><a href="/about/">About</a></li>
            <li><a href="/resources/">Resources</a></li>
            <li><a href="/faqs/">FAQs</a></li>
            <li><a href="{QUIZ}" {EXT}>Free Privacy Health Check</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
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
      </div>
    </div>
  </footer>

  <div class="cookie" id="cookie-notice" role="region" aria-label="Cookie notice">
    <div class="wrap">
      <p><strong>Cookie notice</strong>This website doesn't use tracking, analytics or advertising cookies. We only remember that you've closed this message. See our <a href="/cookie-policy/">cookie policy</a>.</p>
      <button class="btn btn-sage" data-cookie-ok type="button">OK</button>
    </div>
  </div>

  <script src="/assets/site.js" defer></script>
</body>
</html>
'''


def figure(name, alt, quote=None, by=None):
    cap = f'<div class="figure-caption"><q>{quote}</q><span>{by}</span></div>' if quote else ""
    return (f'<div class="figure"><img src="/assets/img/{name}.webp" alt="{alt}" width="1400" height="1050" '
            f'loading="lazy" decoding="async">{cap}</div>')


def ticks(items):
    return '<ul class="ticks">' + "".join(f"<li>{i}</li>" for i in items) + "</ul>"


def page_hero(label, title, lede, buttons=""):
    return f'''
    <section class="bg-navy blueprint page-hero"><div class="wrap">
      <p class="label">{label}</p>
      <h1 style="max-width:820px">{title}</h1>
      <p class="lede">{lede}</p>
      {buttons}
    </div></section>
'''


def contact_block(title="Let's <em>talk</em>",
                  text="Book a free, no obligation 20-minute call. We'll talk through your business, the data you handle and the most sensible next step. No obligation and no sales pitch."):
    return f'''
    <section class="contact">
      <div class="bg-sage">
        <p class="label">Get in touch</p>
        <h2>{title}</h2>
        <p style="max-width:460px">{text}</p>
        <div class="contact-lines" style="margin-top:28px">
          <a href="mailto:{EMAIL}">{ic("mail")} {EMAIL}</a>
          <a href="{LINKEDIN}" {EXT}>{ic("linkedin")} The Privacy Blueprint on LinkedIn</a>
        </div>
      </div>
      <div>
        <p class="label">What happens next</p>
        <ol>
          <li>Pick a time that suits you for a free 20-minute call.</li>
          <li>We talk through your setup, your concerns and your goals.</li>
          <li>You get a clear recommendation, with a fixed fee if you'd like help.</li>
        </ol>
        <div class="btn-row">
          <a href="{BOOK}" {EXT} class="btn btn-solid">Book your free call</a>
          <a href="{QUIZ}" {EXT} class="btn">Take the Health Check first</a>
        </div>
      </div>
    </section>
'''


PATH = [
    ("Free Health Check", "Ten questions and an instant Red, Amber or Green score for your business.", "Free, 5 minutes"),
    ("Discovery call", "We talk through your setup, your goals and the most sensible next step.", "Free, 20 minutes"),
    ("Assess", "A £75 Action Plan, or a full Gap Assessment across 16 compliance areas.", "From £75"),
    ("Fix", "Policies, ROPA, DPIAs and processes put in place properly and documented.", "Fixed fee"),
    ("Stay compliant", "Ongoing oversight as your business grows and the law changes.", "From £750 a month"),
]


def path_section(bg="bg-white"):
    steps = "".join(
        f'<li><div class="marker">{n:02d}</div><div><h3>{t}</h3><p>{d}</p><span class="cost">{c}</span></div></li>'
        for n, (t, d, c) in enumerate(PATH, 1))
    return f'''
    <section class="section {bg}" id="how-it-works"><div class="wrap">
      <div class="center" style="margin-bottom:56px">
        <p class="label">How it works</p>
        <h2>A clear route to <em>compliance</em></h2>
        <p class="lede">Start free, see exactly where you stand, and only pay for what your business actually needs.</p>
      </div>
      <ol class="path">{steps}</ol>
      <div class="center" style="margin-top:48px"><a href="{QUIZ}" {EXT} class="btn btn-solid">Start with the free Health Check</a></div>
    </div></section>
'''


DELIVERABLES = [
    ("Privacy and cookie policies", "Accurate notices that match what you actually do."),
    ("Record of Processing (ROPA)", "A living map of the data you hold, why, and where it goes."),
    ("Data Protection Impact Assessments", "Risk assessments for new projects, products and AI tools."),
    ("Subject access request process", "A step by step way to respond on time, every time."),
    ("Breach response plan", "Exactly what to do in the first 72 hours."),
    ("Retention schedule", "How long to keep each type of data, and when to delete it."),
    ("Supplier agreements", "Data processing agreements in place with your tools and partners."),
    ("Prioritised action plan", "What to fix first, what can wait, and who owns each step."),
]


def deliverables(photo="desk-review", title="Documents and processes <em>you can use</em>"):
    items = "".join(f'<li><span class="num">{n:02d}</span><div><b>{t}</b><small>{d}</small></div></li>'
                    for n, (t, d) in enumerate(DELIVERABLES, 1))
    return f'''
    <section class="over-photo" style="background-image:url('/assets/img/{photo}.webp')">
      <div class="wrap">
        <div class="panel">
          <p class="label">What your business gets</p>
          <h2>{title}</h2>
          <p>Not a report that sits in a folder. Every engagement leaves you with practical outputs that make you compliant, and let you prove it to clients, partners and the ICO.</p>
          <a href="/services/" class="btn" style="margin-top:14px">See our services</a>
        </div>
        <ul class="list">{items}</ul>
      </div>
    </section>
'''


SERVICES = [
    ("Start here", "Privacy Action Plan", "A personal review of your Health Check results and setup, with a prioritised 30/60/90 day plan and a 15 minute call.", "£75", "5 working days", "/services/#start-here", True),
    ("No. 01", "GDPR Gap Assessment", "A structured audit across 16 compliance areas with risk-weighted scoring, a written report and a debrief call.", "From £850", "5 to 10 days", "/services/#gap-assessment", False),
    ("No. 02", "DPIA and AI Governance", "Impact assessments to ICO standard, plus governance reviews for AI tools you build or buy.", "From £650", "5 to 15 days", "/services/#dpia", False),
    ("No. 03", "Fractional Privacy Support", "A senior privacy practitioner in your team every month, without the cost of a full-time hire.", "From £750", "Per month", "/services/#fractional", False),
]


def service_rows():
    return '<div class="services">' + "".join(
        f'''<a href="{h}" class="svc-row{" start" if s else ""}"><span class="num">{n}</span><h3>{t}</h3><p>{d}</p>
        <div class="price">{p}<small>{w}</small></div></a>''' for n, t, d, p, w, h, s in SERVICES) + "</div>"


def tiles():
    return f'''
    <section class="section bg-navy blueprint"><div class="wrap">
      <div class="tiles">
        <div class="tile"><p class="kick">Free tool</p><h3>Privacy Health Check</h3><p>Ten questions, an instant Red, Amber or Green rating and your top priorities. No sign up.</p><a href="{QUIZ}" {EXT} class="btn">Take the check</a></div>
        <div class="tile"><p class="kick">Next step</p><h3>Privacy Action Plan</h3><p>Turn your results into a personal 30/60/90 day plan, with a 15 minute follow up call. £75.</p><a href="{ACTION}" {EXT} class="btn">Get your plan</a></div>
        <div class="tile"><p class="kick">Common questions</p><h3>FAQs</h3><p>Answers on ICO registration, cookies, fines, pricing and working together.</p><a href="/faqs/" class="btn">Read the FAQs</a></div>
      </div>
    </div></section>
'''


# ---------- HOME ----------
def home():
    who = ["Founders building data protection into their products from day one",
           "SaaS and AI startups navigating UK GDPR and the Data (Use and Access) Act 2025",
           "SMEs that need structured compliance without a full-time hire",
           "Agencies handling client data who need a credible, documented position",
           "Charities and third sector organisations with limited compliance resource"]
    body = f'''
    <section class="hero">
      <div class="hero-text bg-navy blueprint">
        <p class="label">Independent privacy consultancy</p>
        <h1>UK GDPR made <em>practical</em> for growing businesses</h1>
        <p class="lede">Gap assessments, DPIAs and ongoing privacy support for founders, SMEs, agencies and charities. Led by a practitioner with ten years of in-house privacy experience.</p>
        <div class="btn-row">
          <a href="{QUIZ}" {EXT} class="btn btn-sage">Free Health Check</a>
          <a href="{BOOK}" {EXT} class="btn btn-light">Book a free call</a>
        </div>
      </div>
      <div class="hero-photo">
        <img src="/assets/img/office-plants.webp" alt="Bright, plant filled office" width="1400" height="1050" fetchpriority="high">
        <p class="note">Practical. Documented. Proportionate.<span>The Privacy Blueprint</span></p>
      </div>
    </section>

    <div class="strip"><ul>
      <li><strong>10 years</strong>in-house experience</li>
      <li><strong>16 areas</strong>risk-weighted assessment</li>
      <li><strong>DUAA 2025</strong>ready and up to date</li>
      <li><strong>C1883894</strong>ICO registered</li>
    </ul></div>

    <section class="section"><div class="wrap">
      <div class="split split-top" style="margin-bottom:48px">
        <div><p class="label">Why it matters</p><h2>The deadlines most small businesses <em>don't know</em></h2></div>
        <p class="lede head-note">UK GDPR applies whatever your size. Most businesses only discover these rules when a customer, a client or the ICO asks. By then, the clock is already running.</p>
      </div>
      <div class="figures">
        <div><b>72 hours</b><p>to report a serious personal data breach to the ICO.</p></div>
        <div><b>1 month</b><p>to respond when someone asks for a copy of their data.</p></div>
        <div><b>£17.5m</b><p>maximum UK GDPR fine, or 4% of global turnover if higher.</p></div>
      </div>
    </div></section>

    <section class="section bg-sage"><div class="wrap split">
      <div>
        <p class="label">Who we work with</p>
        <h2>Built for businesses handling <em>real</em> data</h2>
        {ticks(who)}
      </div>
      {figure("bright-desk", "Calm, bright workspace")}
    </div></section>

    {deliverables()}

    <section class="section"><div class="wrap">
      <div class="split split-top" style="margin-bottom:40px">
        <div><p class="label">Services</p><h2>Support at <em>every</em> stage</h2></div>
        <p class="lede head-note">Start small with a £75 Action Plan, or choose the engagement that fits where your business is right now. Every project has a fixed, written fee.</p>
      </div>
      {service_rows()}
    </div></section>

    {path_section()}

    <section class="section"><div class="wrap split">
      {figure("signing-documents", "Reviewing compliance paperwork", "Compliance should help your business move faster, not slower.", "Our philosophy")}
      <div>
        <span class="tag">About us</span>
        <h2>Grounded in <em>operational</em> experience</h2>
        <p>The Privacy Blueprint is run by an in-house privacy practitioner with ten years of experience leading privacy inside a large UK organisation: building an organisation-wide DPIA process, managing subject access requests at volume, and reporting privacy metrics directly to the C-suite.</p>
        <p>That experience is built into a proprietary gap assessment covering 16 compliance areas, updated for the Data (Use and Access) Act 2025.</p>
        <a href="/about/" class="btn" style="margin-top:12px">More about our approach</a>
      </div>
    </div></section>

    {tiles()}

    {contact_block()}
'''
    return page("/", "The Privacy Blueprint | Practical UK GDPR Consultancy",
                "Practical UK GDPR support for founders, SMEs, agencies and charities. Free Privacy Health Check, gap assessments, DPIAs and fractional privacy support.",
                body)


# ---------- ABOUT ----------
def about():
    facts = [
        ("10 years", "leading the privacy function inside a large UK organisation"),
        ("Organisation wide", "DPIA process built and run from the ground up"),
        ("High volume", "subject access requests managed end to end"),
        ("Board level", "privacy metrics reported directly to the C-suite"),
        ("16 areas", "covered by our risk-weighted gap assessment, updated for the Data (Use and Access) Act 2025"),
        ("ICO registered", "registration number C1883894"),
    ]
    fl = "".join(f'<li><span class="num">{n:02d}</span><div><b>{t}</b><span>{d}</span></div></li>' for n, (t, d) in enumerate(facts, 1))
    promises = [("Practical", "Advice that fits how your business actually runs, not a theoretical framework."),
                ("Documented", "Everything written down, so you can show compliance as well as achieve it."),
                ("Proportionate", "Advice scaled to your size and risk. No gold plating and no paperwork for its own sake.")]
    pr = "".join(f'<div class="tile"><p class="kick">Promise {n:02d}</p><h3>{t}</h3><p>{d}</p></div>' for n, (t, d) in enumerate(promises, 1))
    body = f'''
    {page_hero("About", "A consultancy built on <em>operational</em> experience", "Not advisory distance. Ten years of running privacy inside a real organisation, now applied to yours.")}

    <section class="section"><div class="wrap split">
      {figure("desk-review", "Reviewing compliance documents at a desk", "Privacy compliance should be enabling, not obstructing.", "The Privacy Blueprint")}
      <div>
        <span class="tag">Our approach</span>
        <h2>Most privacy consultants come from legal or advisory backgrounds. <em>This is different.</em></h2>
        <p>The Privacy Blueprint is built on ten years of in-house experience running the privacy function inside a large UK organisation, solving real compliance problems at real operational scale.</p>
        <p>That means the work is grounded in what actually happens inside an organisation: the DPIA request that arrives at the wrong time, the subject access request that lands on a Friday afternoon, the supplier with no data processing agreement, the reporting line that needs educating rather than just a policy document.</p>
      </div>
    </div></section>

    <section class="section bg-white"><div class="wrap">
      <div class="split split-top" style="margin-bottom:40px">
        <div><p class="label">At a glance</p><h2>Experience you can <em>rely on</em></h2></div>
        <p class="lede head-note">The same experienced practitioner works on every engagement, from the first call to the final document.</p>
      </div>
      <ul class="facts">{fl}</ul>
    </div></section>

    <section class="section bg-sage"><div class="wrap split">
      <div>
        <p class="label">Our philosophy</p>
        <h2>Compliance that helps you <em>move faster</em></h2>
        <p>A well run privacy function helps organisations build trust, move faster on products and data projects, and avoid the regulatory and reputational cost of getting it wrong.</p>
        <p>The Privacy Blueprint exists to make that kind of compliance accessible to founders, SMEs and growing teams who can't justify a full-time privacy hire but need the real thing, not a checkbox exercise.</p>
      </div>
      {figure("handshake", "Agreeing a new engagement")}
    </div></section>

    <section class="section bg-navy blueprint"><div class="wrap">
      <div class="center" style="margin-bottom:48px"><p class="label">What to expect</p><h2>Three promises on <em>every</em> engagement</h2></div>
      <div class="tiles">{pr}</div>
    </div></section>

    <!--
      TESTIMONIALS: add real client quotes here when you have them.
      Faceless friendly format: quote, then initials plus business type.
      <section class="section"><div class="wrap narrow center">
        <p class="label">What clients say</p>
        <h2><em>"Quote goes here."</em></h2>
        <p>S.M., founder, online coaching business</p>
      </div></section>
    -->

    {contact_block()}
'''
    return page("/about/", "About | The Privacy Blueprint",
                "Ten years of in-house data protection experience. A practitioner's approach to GDPR compliance for founders, SMEs and agencies.", body)


# ---------- SERVICES ----------
def aside(price, rows, note="", btn="Book a free 20-minute call", href=BOOK):
    dl = "".join(f"<dt>{k}</dt><dd>{v}</dd>" for k, v in rows)
    n = f'<p class="note">{note}</p>' if note else ""
    return f'<div class="aside"><div class="price">{price}</div><dl>{dl}</dl>{n}<a href="{href}" {EXT} class="btn btn-solid">{btn}</a></div>'


def services():
    tiers = [("Essentials", "£750", ["Around 4 hours a month", "Email support", "Monthly check-in call"]),
             ("Standard", "£1,250", ["Around 1 day a month", "DPIA reviews", "Quarterly privacy report"]),
             ("Embedded", "£2,000", ["Up to 1 day a week", "Acting as your part-time privacy lead"])]
    tc = "".join(f'<div><p class="t-name">{n}</p><p class="t-price">{p} <small>a month</small></p><ul class="ticks">{"".join(f"<li>{x}</li>" for x in l)}</ul></div>' for n, p, l in tiers)
    body = f'''
    {page_hero("Services", "Support scoped to <em>where you are</em>", "Start small with a £75 Action Plan, or choose one of three engagements built around what your business actually needs.",
               f'<div class="btn-row"><a href="#start-here" class="btn btn-sage">Where to start</a><a href="{BOOK}" {EXT} class="btn btn-light">Book a free call</a></div>')}

    <section class="section"><div class="wrap">{service_rows()}</div></section>

    {path_section()}

    <section class="section" id="start-here"><div class="wrap detail">
      <div>
        <p class="label">Start here</p>
        <h2>Privacy <em>Action Plan</em></h2>
        <p>Not ready for a full engagement? Take the free Health Check, then get a personal review of your results and a prioritised plan built for your business.</p>
        <p class="sub">What's included</p>
        {ticks(["Manual review of your Health Check results and current setup", "Prioritised 30/60/90 day action plan", "15 minute follow up call", "Delivered within 5 working days"])}
        <p style="margin-top:24px"><a href="{QUIZ}" {EXT} class="link">Haven't taken the Health Check yet? Start here</a></p>
      </div>
      {aside("£75", [("Delivery", "Within 5 working days"), ("Format", "Written plan plus a 15 minute call")], "Credited in full against a Gap Assessment booked within 30 days.", "Get your Action Plan", ACTION)}
    </div></section>

    <section class="section bg-white" id="gap-assessment"><div class="wrap detail">
      <div>
        <p class="label">No. 01</p>
        <h2>GDPR <em>Gap Assessment</em></h2>
        <p>A structured audit of your data protection position across 16 compliance areas, using a proprietary risk-weighted scoring method. A clear, prioritised picture of where you stand and what to fix first.</p>
        <p class="sub">What's included</p>
        {ticks(["Assessment across 16 areas, including lawful basis, consent, data subject rights, breach management, supplier agreements, retention, international transfers and Data (Use and Access) Act 2025 readiness", "Risk-weighted scoring for each area, prioritised by severity", "Written report with findings and a clear action plan", "30 minute debrief call to walk through the report"])}
        <p class="sub">Who it's for</p>
        {ticks(["Businesses starting out who want to understand their gaps before investing in fixes", "Organisations preparing for a contract with a large client or public sector body", "Companies that have grown quickly and aren't sure their setup has kept pace"])}
        <div class="aside-box">Move to a monthly retainer within 30 days and we'll credit your assessment fee against your first month.</div>
      </div>
      {aside("From £850", [("Timeline", "5 to 10 working days"), ("Includes", "Report, scoring and debrief call")])}
    </div></section>

    <section class="section" id="dpia"><div class="wrap detail">
      <div>
        <p class="label">No. 02</p>
        <h2>DPIA and <em>AI Governance</em></h2>
        <p>Data Protection Impact Assessments completed in line with ICO guidance, plus AI governance reviews for businesses developing or buying AI tools.</p>
        <div class="aside-box"><strong>What is a DPIA?</strong> A structured way to spot and reduce the privacy risks of a new project, system or product. Under UK GDPR it's legally required for some high-risk processing. Getting it wrong means a project is non-compliant before it starts.</div>
        <p class="sub">What's included</p>
        {ticks(["Scoping session to decide whether a full DPIA or a documented threshold assessment is needed", "Full DPIA completed to ICO standard where required", "AI governance review: data flows, model inputs, supplier agreements and ICO guidance alignment", "Written output ready to share with stakeholders, regulators or clients"])}
        <p class="sub">Who it's for</p>
        {ticks(["Businesses launching new products, features or data-heavy projects", "Founders and SaaS companies building or integrating AI tools", "Teams who've tried a DPIA internally but aren't confident it meets ICO requirements"])}
      </div>
      {aside("From £650", [("Timeline", "5 to 15 working days"), ("Complex AI reviews", "From £1,000")])}
    </div></section>

    <section class="section bg-white" id="fractional"><div class="wrap">
      <div class="detail">
        <div>
          <p class="label">No. 03</p>
          <h2>Fractional <em>Privacy Support</em></h2>
          <p>Ongoing privacy oversight on a monthly retainer. The equivalent of a senior privacy practitioner in your team, without the cost of a full-time hire.</p>
          <p class="sub">What the retainer covers</p>
          {ticks(["Oversight and advisory time every month", "DPIA review and sign-off", "Record of Processing Activities (ROPA) maintenance", "Subject access and erasure request support", "Input on product and market expansion decisions", "Rapid response support for data incidents"])}
        </div>
        {aside("From £750", [("Billing", "Monthly retainer"), ("Minimum term", "Three months"), ("Best for", "Growing teams, agencies and charities")], "Not sure which level fits? We'll recommend one on your free call.")}
      </div>
      <p class="sub" style="margin-top:56px">Retainer levels</p>
      <div class="tiers">{tc}</div>
    </div></section>

    {deliverables("typing-laptop")}

    <section class="section-sm"><div class="wrap center">
      <p>Questions about pricing, timelines or how it works? <a href="/faqs/" class="link">Read the FAQs</a></p>
    </div></section>

    {contact_block("Not sure which is <em>right for you?</em>", "Every engagement starts with a free 20-minute call. We'll talk through your business, your current setup and the best path forward. No pressure, no sales pitch.")}
'''
    return page("/services/", "Services | The Privacy Blueprint",
                "GDPR gap assessment, DPIA, AI governance and fractional privacy support for growing businesses. Fixed fees and practical outputs.", body)


# ---------- RESOURCES ----------
def resources():
    body = f'''
    {page_hero("Resources", "Tools to help you get GDPR <em>right</em>", "Free tools and practical next steps for understanding and implementing data protection in your business.")}

    <section class="section"><div class="wrap split">
      <div>
        <span class="tag">Free tool</span>
        <h2>The Privacy <em>Health Check</em></h2>
        <p>Not sure where your business stands? Answer ten questions about the most common compliance gaps and get an instant Red, Amber or Green rating, a full breakdown and a prioritised action plan.</p>
        {ticks(["Takes under 5 minutes", "No sign up required", "Instant results you can save or print"])}
        <a href="{QUIZ}" {EXT} class="btn btn-solid" style="margin-top:24px">Take the free Health Check</a>
      </div>
      {figure("checklist-notebook", "Working through a checklist in a notebook")}
    </div></section>

    {tiles()}
    <!--
      TEMPLATES: when the Practitioner Toolkit is ready, add a tile to the tiles() function in tools/build_site.py.
    -->

    {contact_block()}
'''
    return page("/resources/", "Resources | The Privacy Blueprint",
                "Free GDPR Privacy Health Check, practical next steps and data protection resources from The Privacy Blueprint.", body)


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
         "An experienced privacy practitioner with ten years of in-house experience. The same person works on your engagement from start to finish."),
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
    groups, ld = "", []
    for g, qs in FAQS:
        items = "".join(f'<details class="faq"><summary>{q}</summary><div class="a"><p>{a}</p></div></details>' for q, a in qs)
        groups += f'<div class="faq-group"><p class="label">{g}</p>{items}</div>'
        for q, a in qs:
            ld.append({"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": re.sub(r"<[^>]+>", "", a)}})
    schema = json.dumps({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": ld}, ensure_ascii=False)
    lede = ("Everything you might want to know about GDPR, working together and pricing. Can't find your answer? "
            f'<a href="mailto:{EMAIL}" style="color:var(--sage)">Email us</a>.')
    body = f'''
    {page_hero("FAQs", "Your questions, <em>answered</em>", lede)}

    <section class="section"><div class="wrap narrow">{groups}</div></section>

    {contact_block("Still have a <em>question?</em>", "Book a free 20-minute call and ask us anything, or take the free Health Check to see where you stand.")}
'''
    head = f'  <script type="application/ld+json">{schema}</script>\n'
    return page("/faqs/", "FAQs | The Privacy Blueprint",
                "Answers on UK GDPR, ICO registration, cookies, fines, pricing and working with The Privacy Blueprint.", body, head)


def cookies():
    body = f'''
    {page_hero("Cookie policy", "We <em>don't</em> track you", "This website does not use analytics, advertising or social media tracking cookies.")}
    <section class="section"><div class="wrap narrow">
      <h2 style="font-size:1.6rem">What this site stores</h2>
      <p>We store one small item in your browser's local storage, called <code>tpb-cookie-notice</code>. It only remembers that you've closed the cookie notice, so we don't show it again. It contains no personal information and is never sent to us. You can clear it at any time in your browser settings.</p>
      <h2 style="font-size:1.6rem;margin-top:40px">No third party requests</h2>
      <p>Fonts and images on this site are hosted on our own server, so loading a page doesn't send your details to font or image providers.</p>
      <h2 style="font-size:1.6rem;margin-top:40px">Links to other services</h2>
      <p>Some links take you to other services: our free Health Check, our booking calendar (Google Calendar), our shop (Beacons) and LinkedIn. Those services have their own privacy and cookie policies, which apply once you're on their sites.</p>
      <h2 style="font-size:1.6rem;margin-top:40px">Changes and contact</h2>
      <p>If we ever add analytics or other non-essential cookies, we'll update this policy and ask for your consent first. Questions? Email <a href="mailto:{EMAIL}" class="link">{EMAIL}</a>.</p>
      <p style="margin-top:28px;font-size:13px;color:var(--muted)">Last updated: November 2026</p>
    </div></section>
'''
    return page("/cookie-policy/", "Cookie Policy | The Privacy Blueprint",
                "The Privacy Blueprint does not use tracking or advertising cookies. Here's exactly what this site stores.", body)


FAVICON = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect x="1" y="1" width="30" height="30" fill="#1C2B4A"/>'
           '<rect x="4.5" y="4.5" width="23" height="23" fill="none" stroke="#9DBFB9" stroke-width=".8"/>'
           '<circle cx="16" cy="13.5" r="3.3" fill="#9DBFB9"/><path d="M14.4 16h3.2l1 7h-5.2z" fill="#9DBFB9"/></svg>')

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
