import Footer from './Footer.jsx'

export default function Landing({ onStart }) {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg text-center">
          <p className="font-inter text-sm font-medium tracking-widest uppercase text-warm-brown mb-6">
            The Privacy Blueprint
          </p>

          <h1 className="font-playfair text-4xl sm:text-5xl text-charcoal leading-tight mb-6">
            Privacy Health Check
          </h1>

          <p className="font-inter text-base sm:text-lg text-charcoal/70 leading-relaxed mb-10 max-w-md mx-auto">
            Find out how well your business is protecting personal data under UK GDPR — in under 5 minutes.
          </p>

          <button onClick={onStart} className="btn-primary text-base sm:text-lg w-full sm:w-auto">
            Start Your Free Check →
          </button>

          <p className="font-inter text-xs text-charcoal/40 mt-6">
            10 questions · No sign-up required · Instant results
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
