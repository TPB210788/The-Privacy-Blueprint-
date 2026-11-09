import { Link } from 'react-router-dom'
import Footer from './Footer.jsx'

const BOOKING_URL = 'https://calendar.app.google/XFwWHg2UYvFwZjiEA'
const ACTION_PLAN_URL = 'https://shop.beacons.ai/theprivacyblueprint/107a12ce-2d3d-4edd-ae25-ed67a79b2ab6'

function BookingLink({ children, className }) {
  return (
    <a
      href={BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  )
}

function CheckItem({ children }) {
  return (
    <li className="flex items-start gap-2.5">
      <svg className="w-4 h-4 text-sage-deep flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      <span className="font-raleway text-sm text-ink/75 leading-snug">{children}</span>
    </li>
  )
}

function ServiceCard({ tag, title, bestFor, overview, included, outcome, delivery, investment, ctaLabel = 'Book a Free Call →', ctaHref = BOOKING_URL }) {
  return (
    <div className="bg-white rounded-none border border-black/5 flex flex-col overflow-hidden">
      {/* Card top accent */}
      <div className="h-1 bg-navy" />

      <div className="flex-1 p-6 sm:p-8 flex flex-col gap-5">
        {/* Tag + title */}
        <div>
          <p className="font-raleway text-xs font-semibold uppercase tracking-widest text-sage-deep mb-2">{tag}</p>
          <h2 className="font-playfair text-2xl text-ink leading-snug">{title}</h2>
        </div>

        {/* Best for */}
        <div className="bg-sand rounded-none px-4 py-3">
          <p className="font-raleway text-xs font-semibold uppercase tracking-wide text-ink/40 mb-1">Best for</p>
          <p className="font-raleway text-sm text-ink/75 leading-relaxed">{bestFor}</p>
        </div>

        {/* Overview */}
        <p className="font-raleway text-sm text-ink/65 leading-relaxed">{overview}</p>

        {/* Included */}
        <div>
          <p className="font-raleway text-xs font-semibold uppercase tracking-wide text-ink/40 mb-3">What's included</p>
          <ul className="space-y-2.5">
            {included.map((item, i) => <CheckItem key={i}>{item}</CheckItem>)}
          </ul>
        </div>

        {/* Outcome */}
        <div className="bg-sage/25 rounded-none px-4 py-3">
          <p className="font-raleway text-xs font-semibold uppercase tracking-wide text-ink/40 mb-1">Outcome</p>
          <p className="font-raleway text-sm text-ink/75 leading-relaxed">{outcome}</p>
        </div>

        {/* Delivery + investment */}
        <div className="flex flex-col gap-1.5 pt-1 border-t border-black/6">
          <p className="font-raleway text-xs text-ink/50">
            <span className="font-medium text-ink/65">Delivery:</span> {delivery}
          </p>
          <p className="font-raleway text-xs text-ink/50">
            <span className="font-medium text-ink/65">Investment:</span>{' '}
            <span className="font-playfair text-base text-ink font-600">{investment}</span>
          </p>
        </div>

        {/* CTA */}
        <a href={ctaHref} target="_blank" rel="noopener noreferrer" className="btn-primary text-center text-sm mt-auto">
          {ctaLabel}
        </a>
      </div>
    </div>
  )
}

export default function Services() {
  return (
    <div className="min-h-screen flex flex-col bg-sand">
      <div className="flex-1 px-4 py-12">
        <div className="max-w-4xl mx-auto">

          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 font-raleway text-xs text-sage-deep hover:text-navy-deep transition-colors mb-8"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Privacy Health Check
          </Link>

          {/* Page header */}
          <div className="max-w-2xl mb-10">
            <p className="font-raleway text-sm font-medium tracking-widest uppercase text-sage-deep mb-3">
              The Privacy Blueprint
            </p>
            <h1 className="font-playfair text-4xl sm:text-5xl text-ink leading-tight mb-4">
              Services
            </h1>
            <p className="font-raleway text-base text-ink/60 leading-relaxed mb-4">
              Clear, practical GDPR support for online businesses, creators, and agencies.
            </p>
            <p className="font-raleway text-sm text-ink/65 leading-relaxed">
              Whether you're setting up your data protection foundations for the first time, or you need ongoing expert support as your business grows, there's a package built for where you are right now. Every engagement starts with a free 20-minute discovery call.
            </p>
          </div>

          {/* Service cards: keep prices in sync with theprivacyblueprint.co.uk/services */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            <ServiceCard
              tag="Start here"
              title="Privacy Action Plan"
              bestFor="Small businesses who have taken the Health Check and want to know exactly what to fix first."
              overview="A personal review of your Health Check results and your actual setup, turned into a clear plan you can work through yourself."
              included={[
                'Manual review of your current setup',
                'Prioritised 30/60/90-day action plan',
                '15-minute follow-up call',
                'Credited in full against a Gap Assessment booked within 30 days',
              ]}
              outcome="You know exactly what to fix, in what order, without a big upfront commitment."
              delivery="Within 5 working days"
              investment="£75"
              ctaLabel="Get Your Action Plan →"
              ctaHref={ACTION_PLAN_URL}
            />
            <ServiceCard
              tag="Service 01"
              title="GDPR Gap Assessment"
              bestFor="Businesses that want a full, professional picture of their compliance before investing in fixes."
              overview="A structured audit across 16 compliance domains using a risk-weighted scoring method, updated for the Data (Use and Access) Act 2025."
              included={[
                'Assessment across 16 compliance domains',
                'Risk-weighted scoring, prioritised by severity',
                'Written report with findings and action plan',
                '30-minute debrief call',
              ]}
              outcome="A clear, documented picture of where you stand and what to fix first."
              delivery="5 to 10 working days"
              investment="From £850"
            />
            <ServiceCard
              tag="Service 02"
              title="DPIA and AI Governance"
              bestFor="Businesses launching new products or data-heavy projects, or building and buying AI tools."
              overview="Data Protection Impact Assessments completed in line with ICO guidance, with AI governance reviews where relevant."
              included={[
                'Scoping session and threshold assessment',
                'Full DPIA to ICO standard where required',
                'AI governance review and documentation',
                'Written output ready for clients or regulators',
              ]}
              outcome="A defensible DPIA you can share with confidence."
              delivery="5 to 15 working days"
              investment="From £650"
            />
            <ServiceCard
              tag="Service 03"
              title="Fractional Privacy Support"
              bestFor="Growing businesses that need ongoing data protection support without hiring in-house."
              overview="Ongoing privacy oversight on a monthly retainer. Think of it as having a senior privacy lead on your team, without the full-time cost."
              included={[
                'Monthly oversight and advisory time',
                'DPIA review and ROPA maintenance',
                'DSAR and data incident support',
                'Tiers from around 4 hours a month to 1 day a week',
              ]}
              outcome="Stay compliant as you grow, without the cost and commitment of hiring in-house."
              delivery="Monthly retainer (3-month minimum)"
              investment="From £750/month"
            />
          </div>

          {/* Bottom CTA block */}
          <div className="bg-white rounded-none border border-black/5 p-6 sm:p-10 text-center max-w-2xl mx-auto">
            <h2 className="font-playfair text-2xl sm:text-3xl text-ink mb-3">
              Not sure which one is right for you?
            </h2>
            <p className="font-raleway text-sm text-ink/65 leading-relaxed mb-6 max-w-lg mx-auto">
              Every engagement starts with a free 20-minute discovery call. We'll talk through your business, your current setup, and the best path forward. No pressure, no sales pitch.
            </p>
            <BookingLink className="btn-primary inline-block">
              Book Your Free Call →
            </BookingLink>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  )
}
