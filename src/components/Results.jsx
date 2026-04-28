import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getRagRating, questions } from '../data/questions.js'
import Footer from './Footer.jsx'

const FORMSPREE_URL = 'https://formspree.io/f/xqewblbe'

const ragStyles = {
  green: {
    badge: 'bg-rag-green-bg text-rag-green border-rag-green/20',
    dot: 'bg-rag-green',
    border: 'border-rag-green/30',
    row: 'bg-rag-green-bg',
    label: 'text-rag-green',
  },
  amber: {
    badge: 'bg-rag-amber-bg text-rag-amber border-rag-amber/20',
    dot: 'bg-rag-amber',
    border: 'border-rag-amber/30',
    row: 'bg-rag-amber-bg',
    label: 'text-rag-amber',
  },
  red: {
    badge: 'bg-rag-red-bg text-rag-red border-rag-red/20',
    dot: 'bg-rag-red',
    border: 'border-rag-red/30',
    row: 'bg-rag-red-bg',
    label: 'text-rag-red',
  },
}

function scoreToRag(score) {
  if (score === 2) return 'green'
  if (score === 1) return 'amber'
  return 'red'
}

function scoreToLabel(score) {
  if (score === 2) return 'Good'
  if (score === 1) return 'Needs Work'
  return 'Action Required'
}

function getAllFixes(answers) {
  return answers
    .map((score, i) => ({ score, question: questions[i] }))
    .filter(({ score }) => score < 2)
    .sort((a, b) => a.score - b.score)
    .map(({ score, question }) => ({
      topic: question.topic,
      fix: score === 0 ? question.fixes.red : question.fixes.amber,
      color: score === 0 ? 'red' : 'amber',
    }))
}

function EmailCapture({ answers }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) { setError('Please fill in your name and email.'); return }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email address.'); return }
    if (!consent) { setError('Please tick the consent box to continue.'); return }

    const total = answers.reduce((sum, s) => sum + s, 0)
    const maxScore = answers.length * 2
    const rag = getRagRating(total)
    const breakdown = Object.fromEntries(
      answers.map((score, i) => [
        `Q${i + 1}: ${questions[i].topic}`,
        `${scoreToLabel(score)} (${score}/2)`,
      ])
    )

    setLoading(true)
    try {
      if (FORMSPREE_URL) {
        const res = await fetch(FORMSPREE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            consent: 'Yes, consented to follow-up guidance',
            'Overall Score': `${total}/${maxScore}`,
            'Overall Rating': `${rag.label}`,
            ...breakdown,
          }),
        })
        if (!res.ok) throw new Error('Submission failed')
      } else {
        console.log('Privacy Health Check lead:', { name: name.trim(), email: email.trim(), total, rating: rag.label, breakdown })
      }
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="card no-print">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-rag-green-bg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-rag-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-playfair text-xl text-charcoal mb-3">Got it! We'll be in touch.</h3>
          <div className="bg-cream rounded-xl p-4 border border-black/8 text-left space-y-2">
            <p className="font-inter text-sm text-charcoal/70 leading-relaxed">
              You've agreed to be contacted by The Privacy Blueprint based on your privacy health check results.
            </p>
            <p className="font-inter text-xs text-charcoal/50 leading-relaxed">
              You can withdraw consent at any time by emailing{' '}
              <a href="mailto:hello@theprivacyblueprint.co.uk" className="text-warm-brown underline">
                hello@theprivacyblueprint.co.uk
              </a>.
            </p>
          </div>
        </div>
        <BookCTA />
      </div>
    )
  }

  return (
    <div className="card no-print">
      <h3 className="font-playfair text-xl text-charcoal mb-1">
        Want personalised guidance on your results?
      </h3>
      <p className="font-inter text-sm text-charcoal/55 mb-5 leading-relaxed">
        Leave your details and we'll follow up with tailored next steps for your business.
      </p>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
        <div>
          <label htmlFor="lead-name" className="font-inter text-xs font-medium text-charcoal/60 uppercase tracking-wide block mb-1.5">
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
          <label htmlFor="lead-email" className="font-inter text-xs font-medium text-charcoal/60 uppercase tracking-wide block mb-1.5">
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

        {/* Consent checkbox */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={consent}
            onChange={e => { setConsent(e.target.checked); setError('') }}
            className="mt-0.5 flex-shrink-0 w-4 h-4 rounded border-black/20 accent-warm-brown cursor-pointer"
          />
          <span className="font-inter text-xs text-charcoal/60 leading-relaxed">
            I agree to be contacted by The Privacy Blueprint with personalised guidance based on my results. See our{' '}
            <Link to="/privacy-policy" className="underline hover:text-charcoal/80 transition-colors">
              privacy policy
            </Link>.
          </span>
        </label>

        {/* Expandable data usage info */}
        <button
          type="button"
          onClick={() => setInfoOpen(o => !o)}
          className="flex items-center gap-1.5 font-inter text-xs text-warm-brown hover:text-warm-brown-dark transition-colors"
        >
          <span>How we'll use your data</span>
          <svg
            className={`w-3 h-3 transition-transform duration-200 ${infoOpen ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {infoOpen && (
          <div className="bg-cream rounded-xl p-4 border border-black/10 space-y-2">
            {[
              ['Controller', 'The Privacy Blueprint'],
              ['Purpose', 'To provide personalised privacy guidance based on your results'],
              ['Lawful basis', 'Consent'],
              ['Retention', 'We\'ll keep your details for 12 months unless you ask us to delete them'],
              ['Your rights', 'You can access, correct, delete your data or withdraw consent at any time by emailing hello@theprivacyblueprint.co.uk'],
            ].map(([label, value]) => (
              <p key={label} className="font-inter text-xs text-charcoal/65 leading-relaxed">
                <span className="font-semibold text-charcoal/80">{label}:</span> {value}
              </p>
            ))}
            <p className="font-inter text-xs text-charcoal/65 leading-relaxed">
              You have the right to complain to the ICO at{' '}
              <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="underline text-warm-brown">
                ico.org.uk
              </a>.
            </p>
          </div>
        )}

        {error && <p className="font-inter text-xs text-rag-red" role="alert">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary mt-1">
          {loading ? 'Sending…' : 'Get Follow-Up Guidance →'}
        </button>
      </form>
    </div>
  )
}

function BookCTA() {
  return (
    <div className="bg-cream rounded-xl p-5 border border-warm-brown/20">
      <p className="font-inter text-sm font-semibold text-warm-brown mb-1">Want a personalised action plan?</p>
      <p className="font-inter text-sm text-charcoal/70 mb-3 leading-relaxed">
        The Health Check shows you where you stand. I'll personally review your actual setup and send you a prioritised plan built for your business, so you know exactly what to fix and in what order.
      </p>
      <ul className="flex flex-col gap-1 mb-4">
        {[
          'Manual review of your actual setup',
          'Prioritised 30/60/90-day action plan',
          '15-min follow-up call included',
        ].map(item => (
          <li key={item} className="flex items-center gap-2 font-inter text-xs text-charcoal/70">
            <svg className="w-3.5 h-3.5 text-rag-green flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {item}
          </li>
        ))}
      </ul>
      <p className="font-inter text-xs text-charcoal/50 mb-4">Delivered within 5 working days.</p>
      <p className="font-playfair text-3xl font-700 text-charcoal mb-4">£75</p>
      <a
        href="https://shop.beacons.ai/theprivacyblueprint/107a12ce-2d3d-4edd-ae25-ed67a79b2ab6"
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary inline-block text-sm"
      >
        Get Your Action Plan for £75 →
      </a>
    </div>
  )
}

export default function Results({ answers }) {
  const total = answers.reduce((sum, s) => sum + s, 0)
  const maxScore = answers.length * 2
  const rag = getRagRating(total)
  const allFixes = getAllFixes(answers)
  const styles = ragStyles[rag.color]
  const reportDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <>
    <div className="min-h-screen flex flex-col items-center px-4 py-12 bg-cream">
      <div className="w-full max-w-xl">

        {/* Print header — only visible when printing */}
        <div className="hidden print-show mb-8 pb-6 border-b border-black/10">
          <p className="font-inter text-xs uppercase tracking-widest text-warm-brown mb-1">The Privacy Blueprint</p>
          <h1 className="font-playfair text-2xl text-charcoal">Privacy Health Check Report</h1>
          <p className="font-inter text-xs text-charcoal/40 mt-1">{reportDate}</p>
        </div>

        {/* Screen header */}
        <p className="font-inter text-sm font-medium tracking-widest uppercase text-warm-brown mb-4 text-center no-print">
          The Privacy Blueprint
        </p>
        <h2 className="font-playfair text-3xl sm:text-4xl text-charcoal text-center mb-8 no-print">
          Your Privacy Health Check
        </h2>

        {/* ── Section 1: Score summary ── */}
        <div className="card mb-5 text-center">
          <p className="font-inter text-xs font-medium uppercase tracking-widest text-charcoal/40 mb-3">Overall Score</p>
          <p className="font-playfair text-7xl font-700 text-charcoal leading-none mb-1">
            {total}<span className="text-3xl text-charcoal/25 font-400">/{maxScore}</span>
          </p>
          <div className={`inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full border font-inter text-sm font-semibold ${styles.badge}`}>
            <span className={`w-2.5 h-2.5 rounded-full ${styles.dot}`} />
            {rag.label} Rating
          </div>
          <p className="font-inter text-sm sm:text-base text-charcoal/65 leading-relaxed mt-4">{rag.message}</p>
        </div>

        {/* ── Section 2: Full breakdown ── */}
        <div className="card mb-5">
          <h3 className="font-playfair text-xl text-charcoal mb-4">Results Breakdown</h3>
          <div className="flex flex-col gap-2">
            {questions.map((q, i) => {
              const score = answers[i]
              const color = scoreToRag(score)
              const s = ragStyles[color]
              return (
                <div key={q.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${s.row}`}>
                  <span className={`flex-shrink-0 w-2.5 h-2.5 rounded-full ${s.dot}`} />
                  <span className="font-inter text-sm text-charcoal flex-1 leading-snug">{q.topic}</span>
                  <span className={`font-inter text-xs font-semibold flex-shrink-0 ${s.label}`}>
                    {scoreToLabel(score)}
                  </span>
                  <span className="font-inter text-xs text-charcoal/40 flex-shrink-0 w-8 text-right">
                    {score}/2
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Section 3: Full action plan ── */}
        {allFixes.length > 0 ? (
          <div className="card mb-5">
            <h3 className="font-playfair text-xl text-charcoal mb-1">Your Action Plan</h3>
            <p className="font-inter text-xs text-charcoal/45 mb-4">
              {allFixes.length} area{allFixes.length !== 1 ? 's' : ''} to address. Red items are highest priority.
            </p>
            <div className="flex flex-col gap-3">
              {allFixes.map((fix, i) => (
                <div key={i} className={`flex gap-3 p-4 rounded-xl border ${ragStyles[fix.color].border} bg-white`}>
                  <span className={`flex-shrink-0 mt-1.5 w-2 h-2 rounded-full ${ragStyles[fix.color].dot}`} />
                  <div>
                    <p className="font-inter text-xs font-semibold uppercase tracking-wide text-charcoal/40 mb-1">{fix.topic}</p>
                    <p className="font-inter text-sm text-charcoal leading-relaxed">{fix.fix}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="card mb-5 text-center">
            <div className="w-12 h-12 rounded-full bg-rag-green-bg flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-rag-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-playfair text-xl text-charcoal mb-2">Excellent. No critical gaps found.</h3>
            <p className="font-inter text-sm text-charcoal/60 leading-relaxed">
              You've scored full marks across all areas. Keep reviewing your policies annually to stay compliant.
            </p>
          </div>
        )}

        {/* ── Section 4: Book CTA ── */}
        <div className="card mb-5 no-print">
          <BookCTA />
        </div>

        {/* Print CTA */}
        <div className="hidden print-show mb-5 p-5 border border-warm-brown/20 rounded-xl">
          <p className="font-inter text-sm font-semibold text-warm-brown mb-1">Not sure what actually needs fixing?</p>
          <p className="font-inter text-sm text-charcoal/70 leading-relaxed">
            Get a personalised Action Plan: manual review, 30/60/90-day priorities, 15-min call included. £75 at shop.beacons.ai/theprivacyblueprint
          </p>
        </div>

        {/* ── Save / Print button ── */}
        <div className="flex justify-center mb-5 no-print">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 font-inter text-sm font-medium text-warm-brown border border-warm-brown/30 px-6 py-3 rounded-xl hover:bg-warm-brown/5 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v9m0-9l-3 3m3-3l3 3M12 3v9" />
            </svg>
            Save / Print Report
          </button>
        </div>

        {/* ── Section 5: Email capture ── */}
        <EmailCapture answers={answers} />

      </div>
    </div>
    <Footer />
    </>
  )
}
