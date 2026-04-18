import { useState } from 'react'
import { getRagRating, getPriorityFixes } from '../data/questions.js'

const ragStyles = {
  green: {
    badge: 'bg-rag-green-bg text-rag-green border-rag-green/20',
    dot: 'bg-rag-green',
    border: 'border-rag-green/30',
    fixDot: 'bg-rag-green',
  },
  amber: {
    badge: 'bg-rag-amber-bg text-rag-amber border-rag-amber/20',
    dot: 'bg-rag-amber',
    border: 'border-rag-amber/30',
    fixDot: 'bg-rag-amber',
  },
  red: {
    badge: 'bg-rag-red-bg text-rag-red border-rag-red/20',
    dot: 'bg-rag-red',
    border: 'border-rag-red/30',
    fixDot: 'bg-rag-red',
  },
}

function EmailCapture() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) {
      setError('Please fill in both fields.')
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    console.log('Privacy Health Check lead:', {
      name: name.trim(),
      email: email.trim(),
      timestamp: new Date().toISOString(),
    })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="card text-center">
        <div className="w-12 h-12 rounded-full bg-rag-green-bg flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-rag-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-playfair text-xl font-600 text-charcoal mb-2">
          Report on its way!
        </h3>
        <p className="font-inter text-sm text-charcoal/60 mb-6 leading-relaxed">
          Check your inbox — your personalised report will arrive shortly.
        </p>
        <div className="bg-cream rounded-xl p-5 border border-warm-brown/20">
          <p className="font-inter text-sm font-semibold text-warm-brown mb-1">
            Ready to fix this properly?
          </p>
          <p className="font-inter text-sm text-charcoal/70 mb-4 leading-relaxed">
            Book a 60-minute Gap Analysis — a structured review of your compliance position with a clear action plan.
          </p>
          <p className="font-playfair text-3xl font-700 text-charcoal mb-4">£75</p>
          <a
            href="https://theprivacyblueprint.co.uk/gap-analysis"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-block text-sm"
          >
            Book Your Gap Analysis →
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="font-playfair text-xl font-600 text-charcoal mb-1">
        Get your full report emailed to you
      </h3>
      <p className="font-inter text-sm text-charcoal/55 mb-5 leading-relaxed">
        We'll send a personalised summary of your results with guidance on next steps — no spam, ever.
      </p>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
        <div>
          <label
            htmlFor="lead-name"
            className="font-inter text-xs font-medium text-charcoal/60 uppercase tracking-wide block mb-1.5"
          >
            Your name
          </label>
          <input
            id="lead-name"
            type="text"
            value={name}
            onChange={e => { setName(e.target.value); setError('') }}
            placeholder="Jane Smith"
            autoComplete="name"
            className="w-full px-4 py-3 rounded-xl border border-black/15 bg-cream font-inter text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-warm-brown focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label
            htmlFor="lead-email"
            className="font-inter text-xs font-medium text-charcoal/60 uppercase tracking-wide block mb-1.5"
          >
            Email address
          </label>
          <input
            id="lead-email"
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError('') }}
            placeholder="jane@yourbusiness.com"
            autoComplete="email"
            className="w-full px-4 py-3 rounded-xl border border-black/15 bg-cream font-inter text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-warm-brown focus:border-transparent transition-all"
          />
        </div>

        {error && (
          <p className="font-inter text-xs text-rag-red" role="alert">{error}</p>
        )}

        <button type="submit" className="btn-primary mt-1">
          Send My Report →
        </button>

        <p className="font-inter text-xs text-charcoal/35 text-center leading-relaxed">
          By submitting you agree to receive your report by email. We process your data under UK GDPR — see our{' '}
          <a
            href="https://theprivacyblueprint.co.uk/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-charcoal/60 transition-colors"
          >
            privacy policy
          </a>.
        </p>
      </form>
    </div>
  )
}

export default function Results({ answers }) {
  const total = answers.reduce((sum, s) => sum + s, 0)
  const maxScore = answers.length * 2
  const rag = getRagRating(total)
  const fixes = getPriorityFixes(answers)
  const styles = ragStyles[rag.color]

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-xl">
        <p className="font-inter text-sm font-medium tracking-widest uppercase text-warm-brown mb-4 text-center">
          The Privacy Blueprint
        </p>

        <h2 className="font-playfair text-3xl sm:text-4xl font-700 text-charcoal text-center mb-8">
          Your Privacy Health Check
        </h2>

        {/* Score card */}
        <div className="card mb-5 text-center">
          <p className="font-inter text-xs font-medium uppercase tracking-widest text-charcoal/40 mb-3">
            Overall Score
          </p>
          <p className="font-playfair text-7xl font-700 text-charcoal leading-none mb-1">
            {total}
            <span className="text-3xl text-charcoal/25 font-400">/{maxScore}</span>
          </p>

          <div className={`inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full border font-inter text-sm font-semibold ${styles.badge}`}>
            <span className={`w-2.5 h-2.5 rounded-full ${styles.dot}`} />
            {rag.label} Rating
          </div>

          <p className="font-inter text-sm sm:text-base text-charcoal/65 leading-relaxed mt-4">
            {rag.message}
          </p>
        </div>

        {/* Priority fixes */}
        {fixes.length > 0 && (
          <div className="card mb-5">
            <h3 className="font-playfair text-xl font-600 text-charcoal mb-1">
              Top Priority Fixes
            </h3>
            <p className="font-inter text-xs text-charcoal/45 mb-4">
              Based on your lowest-scoring answers
            </p>
            <ol className="flex flex-col gap-3">
              {fixes.map((fix, i) => (
                <li
                  key={i}
                  className={`flex gap-3 p-4 rounded-xl border ${ragStyles[fix.color].border} bg-white`}
                >
                  <span className={`flex-shrink-0 mt-1.5 w-2 h-2 rounded-full ${ragStyles[fix.color].fixDot}`} />
                  <div>
                    <p className="font-inter text-xs font-semibold uppercase tracking-wide text-charcoal/40 mb-1">
                      {fix.topic}
                    </p>
                    <p className="font-inter text-sm text-charcoal leading-relaxed">
                      {fix.fix}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Email capture */}
        <EmailCapture />
      </div>
    </div>
  )
}
