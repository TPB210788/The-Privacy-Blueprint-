import { Link } from 'react-router-dom'
import Footer from './Footer.jsx'

const BOOKING_URL = 'https://calendar.app.google/XFwWHg2UYvFwZjiEA'

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
      <svg className="w-4 h-4 text-warm-brown flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      <span className="font-inter text-sm text-charcoal/75 leading-snug">{children}</span>
    </li>
  )
}

function ServiceCard({ tag, title, bestFor, overview, included, outcome, delivery, investment }) {
  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-sm flex flex-col overflow-hidden">
      {/* Card top accent */}
      <div className="h-1 bg-warm-brown" />

      <div className="flex-1 p-6 sm:p-8 flex flex-col gap-5">
        {/* Tag + title */}
        <div>
          <p className="font-inter text-xs font-semibold uppercase tracking-widest text-warm-brown mb-2">{tag}</p>
          <h2 className="font-playfair text-2xl text-charcoal leading-snug">{title}</h2>
        </div>

        {/* Best for */}
        <div className="bg-cream rounded-xl px-4 py-3">
          <p className="font-inter text-xs font-semibold uppercase tracking-wide text-charcoal/40 mb-1">Best for</p>
          <p className="font-inter text-sm text-charcoal/75 leading-relaxed">{bestFor}</p>
        </div>

        {/* Overview */}
        <p className="font-inter text-sm text-charcoal/65 leading-relaxed">{overview}</p>

        {/* Included */}
        <div>
          <p className="font-inter text-xs font-semibold uppercase tracking-wide text-charcoal/40 mb-3">What's included</p>
          <ul className="space-y-2.5">
            {included.map((item, i) => <CheckItem key={i}>{item}</CheckItem>)}
          </ul>
        </div>

        {/* Outcome */}
        <div className="bg-warm-brown/8 rounded-xl px-4 py-3">
          <p className="font-inter text-xs font-semibold uppercase tracking-wide text-charcoal/40 mb-1">Outcome</p>
          <p className="font-inter text-sm text-charcoal/75 leading-relaxed">{outcome}</p>
        </div>

        {/* Delivery + investment */}
        <div className="flex flex-col gap-1.5 pt-1 border-t border-black/6">
          <p className="font-inter text-xs text-charcoal/50">
            <span className="font-medium text-charcoal/65">Delivery:</span> {delivery}
          </p>
          <p className="font-inter text-xs text-charcoal/50">
            <span className="font-medium text-charcoal/65">Investment:</span>{' '}
            <span className="font-playfair text-base text-charcoal font-600">{investment}</span>
          </p>
        </div>

        {/* CTA */}
        <BookingLink className="btn-primary text-center text-sm mt-auto">
          Book a Free Call →
        </BookingLink>
      </div>
    </div>
  )
}

export default function Services() {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <div className="flex-1 px-4 py-12">
        <div className="max-w-4xl mx-auto">

          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 font-inter text-xs text-warm-brown hover:text-warm-brown-dark transition-colors mb-8"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Privacy Health Check
          </Link>

          {/* Page header */}
          <div className="max-w-2xl mb-10">
            <p className="font-inter text-sm font-medium tracking-widest uppercase text-warm-brown mb-3">
              The Privacy Blueprint
            </p>
            <h1 className="font-playfair text-4xl sm:text-5xl text-charcoal leading-tight mb-4">
              Services
            </h1>
            <p className="font-inter text-base text-charcoal/60 leading-relaxed mb-4">
              Clear, practical GDPR support for online businesses, creators, and agencies.
            </p>
            <p className="font-inter text-sm text-charcoal/65 leading-relaxed">
              Whether you're setting up your data protection foundations for the first time, or you need ongoing expert support as your business grows — there's a package built for where you are right now. Every engagement starts with a free 20-minute discovery call.
            </p>
          </div>

          {/* Service cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            <ServiceCard
              tag="Package 01"
              title="GDPR Setup & Foundation"
              bestFor="Early-stage and growing businesses building structured GDPR foundations from day one."
              overview="A streamlined package designed to help emerging online businesses, creators, and agencies establish a strong, practical foundation for data protection compliance — without the legal jargon or the big-agency price tag."
              included={[
                'GDPR Gap Assessment',
                'Core Policy Development — Privacy Policy, Cookie Policy, Internal Data Handling Policy',
                'ICO Registration Support',
                'Basic Record of Processing Activities (ROPA)',
                'One follow-up call to walk through everything',
              ]}
              outcome="A structured compliance framework that protects your business from day one."
              delivery="1–2 weeks"
              investment="From £950"
            />

            <ServiceCard
              tag="Package 02"
              title="Fractional Privacy Partner"
              bestFor="Growing businesses that need ongoing data protection support without hiring in-house."
              overview="A flexible, continuous support package providing expert oversight and strategic guidance as your data operations evolve. Think of it as having a privacy lead on your team — without the full-time cost."
              included={[
                'Monthly Data Protection Oversight',
                'DPIA Review and ROPA Maintenance',
                'Advisory Calls for Product or Market Expansion',
                'Dedicated support for DSARs and data incidents',
                'Flexible retainer from 3 hours per month',
              ]}
              outcome="Stay compliant as you grow — without the cost and commitment of hiring in-house."
              delivery="Ongoing monthly retainer (3-month minimum)"
              investment="From £450/month"
            />
          </div>

          {/* Bottom CTA block */}
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-6 sm:p-10 text-center max-w-2xl mx-auto">
            <h2 className="font-playfair text-2xl sm:text-3xl text-charcoal mb-3">
              Not sure which one is right for you?
            </h2>
            <p className="font-inter text-sm text-charcoal/65 leading-relaxed mb-6 max-w-lg mx-auto">
              Every engagement starts with a free 20-minute discovery call. We'll talk through your business, your current setup, and the best path forward — no pressure, no sales pitch.
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
