// Same header as theprivacyblueprint.co.uk so the Health Check feels part of the main site.
const SITE = 'https://theprivacyblueprint.co.uk'
const BOOK = 'https://calendar.app.google/XFwWHg2UYvFwZjiEA'

const links = [
  ['Services', `${SITE}/services/`],
  ['About', `${SITE}/about/`],
  ['Resources', `${SITE}/resources/`],
  ['FAQs', `${SITE}/faqs/`],
]

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-line no-print">
      <div className="max-w-[1160px] mx-auto h-[76px] px-5 sm:px-8 flex items-center justify-between gap-4">
        <a href={`${SITE}/`} className="flex items-center gap-3 font-playfair font-semibold text-[19px] text-navy no-underline whitespace-nowrap">
          <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="" width="46" height="46" className="w-[46px] h-[46px] object-contain -mr-1" />
          The Privacy Blueprint
        </a>
        <nav className="flex items-center gap-1" aria-label="Main">
          {links.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="hidden lg:inline-block font-raleway text-xs font-semibold uppercase tracking-[0.16em] text-navy px-3 py-2 border-b border-transparent hover:border-brass"
            >
              {label}
            </a>
          ))}
          <a
            href={BOOK}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 hidden sm:inline-block font-raleway text-xs font-semibold uppercase tracking-[0.14em] text-white bg-navy border border-navy rounded-full px-5 py-2.5 hover:bg-navy-deep"
          >
            Book a call
          </a>
        </nav>
      </div>
    </header>
  )
}
