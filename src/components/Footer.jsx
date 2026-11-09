import { Link } from 'react-router-dom'

// Matches the footer on theprivacyblueprint.co.uk
const SITE = 'https://theprivacyblueprint.co.uk'
const BOOK = 'https://calendar.app.google/XFwWHg2UYvFwZjiEA'

const headCls = 'font-raleway text-[11px] font-semibold uppercase tracking-[0.2em] text-navy mb-4'
const linkCls = 'font-raleway text-sm text-ink/75 hover:text-navy hover:underline'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-line no-print">
      <div className="max-w-[1160px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr_1fr] gap-8 md:gap-12 py-14">
          <div>
            <a href={`${SITE}/`} className="inline-block mb-4">
              <img src="/logo-full.svg" alt="The Privacy Blueprint" width="240" height="96" className="w-[240px] h-auto" />
            </a>
            <p className="font-raleway text-sm text-ink/75 leading-relaxed">
              Independent privacy and UK GDPR consultancy for founders, SMEs, agencies and charities.
            </p>
            <p className="font-raleway text-sm text-ink/75 mt-2">ICO registration C1883894</p>
          </div>
          <div>
            <p className={headCls}>Explore</p>
            <ul className="space-y-2">
              <li><a href={`${SITE}/services/`} className={linkCls}>Services</a></li>
              <li><a href={`${SITE}/about/`} className={linkCls}>About</a></li>
              <li><a href={`${SITE}/resources/`} className={linkCls}>Resources</a></li>
              <li><a href={`${SITE}/faqs/`} className={linkCls}>FAQs</a></li>
            </ul>
          </div>
          <div>
            <p className={headCls}>Contact</p>
            <ul className="space-y-2">
              <li><a href="mailto:hello@theprivacyblueprint.co.uk" className={linkCls}>hello@theprivacyblueprint.co.uk</a></li>
              <li><a href={BOOK} target="_blank" rel="noopener noreferrer" className={linkCls}>Book a free 20-minute call</a></li>
              <li><a href="https://linkedin.com/company/the-privacy-blueprint" target="_blank" rel="noopener noreferrer" className={linkCls}>LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-line py-6 flex flex-wrap gap-x-7 gap-y-2 font-raleway text-xs text-ink/60 tracking-wide">
          <span>© {new Date().getFullYear()} The Privacy Blueprint</span>
          <Link to="/privacy-policy" className="hover:text-navy">Privacy Policy</Link>
          <Link to="/cookie-policy" className="hover:text-navy">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  )
}
