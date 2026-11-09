import Footer from './Footer.jsx'

// Faint blueprint grid, same as the navy sections on theprivacyblueprint.co.uk
const blueprint = {
  backgroundImage: [
    'linear-gradient(rgba(157,191,185,.07) 1px, transparent 1px)',
    'linear-gradient(90deg, rgba(157,191,185,.07) 1px, transparent 1px)',
    'linear-gradient(rgba(157,191,185,.035) 1px, transparent 1px)',
    'linear-gradient(90deg, rgba(157,191,185,.035) 1px, transparent 1px)',
  ].join(','),
  backgroundSize: '96px 96px, 96px 96px, 24px 24px, 24px 24px',
}

const facts = [
  ['10 questions', 'on the most common gaps'],
  ['Under 5 minutes', 'no sign up needed'],
  ['Instant results', 'Red, Amber or Green'],
]

export default function Landing({ onStart }) {
  return (
    <div className="min-h-[calc(100vh-76px)] flex flex-col bg-sand">
      <section className="bg-navy flex-1 flex items-center" style={blueprint}>
        <div className="w-full max-w-[1160px] mx-auto px-5 sm:px-8 py-20 sm:py-28">
          <p className="flex items-center gap-3.5 font-raleway text-[11.5px] font-semibold uppercase tracking-[0.22em] text-sage-light mb-5">
            <span className="w-11 h-px bg-brass" />
            Free tool
          </p>
          <h1 className="font-playfair font-medium text-white text-4xl sm:text-6xl leading-[1.15] mb-6 max-w-2xl">
            Privacy <em className="italic text-sage">Health Check</em>
          </h1>
          <p className="font-raleway text-base sm:text-lg text-[#C9D3E0] leading-relaxed mb-10 max-w-xl">
            Find out how well your business protects personal data under UK GDPR, and what to fix first.
          </p>
          <button
            onClick={onStart}
            className="font-raleway text-[13px] font-semibold uppercase tracking-[0.14em] text-navy bg-sage border border-sage rounded-full px-9 py-4 hover:bg-sage-light transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-navy"
          >
            Start your free check
          </button>
        </div>
      </section>

      <ul className="bg-white border-b border-line grid grid-cols-1 sm:grid-cols-3">
        {facts.map(([big, small], i) => (
          <li key={big} className={`py-5 px-5 text-center ${i ? 'border-t sm:border-t-0 sm:border-l border-line' : ''}`}>
            <strong className="block font-playfair text-xl font-semibold text-navy">{big}</strong>
            <span className="font-raleway text-[13px] text-ink/70 tracking-wide">{small}</span>
          </li>
        ))}
      </ul>

      <p className="font-raleway text-sm text-ink/70 text-center py-10 px-5">
        Want expert help instead?{' '}
        <a href="https://theprivacyblueprint.co.uk/services/" className="text-navy font-semibold border-b border-brass">
          See how we work with businesses
        </a>
      </p>

      <Footer />
    </div>
  )
}
