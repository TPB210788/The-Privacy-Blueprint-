import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="px-4 py-8 border-t border-black/8 no-print">
      <div className="max-w-xl mx-auto text-center">
        <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center mb-5">
          <Link
            to="/privacy-policy"
            className="font-inter text-xs text-charcoal/50 hover:text-charcoal/70 underline transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            to="/cookie-policy"
            className="font-inter text-xs text-charcoal/50 hover:text-charcoal/70 underline transition-colors"
          >
            Cookie Policy
          </Link>
          <a
            href="mailto:hello@theprivacyblueprint.co.uk"
            className="font-inter text-xs text-charcoal/50 hover:text-charcoal/70 transition-colors"
          >
            hello@theprivacyblueprint.co.uk
          </a>
        </div>
        <p className="font-inter text-xs text-charcoal/35 mb-1">
          The Privacy Blueprint is a trading name of Ines Carlitos
        </p>
        <p className="font-inter text-xs text-charcoal/35 mb-3">
          ICO Registration: C1883894
        </p>
        <p className="font-inter text-xs text-charcoal/25">
          © {new Date().getFullYear()} The Privacy Blueprint
        </p>
      </div>
    </footer>
  )
}
