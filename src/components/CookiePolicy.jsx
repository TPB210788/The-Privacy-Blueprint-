import { Link } from 'react-router-dom'
import Footer from './Footer.jsx'

function Section({ title, children }) {
  return (
    <section className="mb-8">
      <div className="bg-warm-brown/8 rounded-xl px-5 py-3 mb-4">
        <h2 className="font-playfair text-xl text-warm-brown-dark">{title}</h2>
      </div>
      <div className="space-y-3 px-1">{children}</div>
    </section>
  )
}

function P({ children }) {
  return <p className="font-inter text-sm text-charcoal/75 leading-relaxed">{children}</p>
}

function CookieRow({ name, purpose, duration, type }) {
  const typeColor = type === 'Strictly Necessary'
    ? 'bg-rag-green-bg text-rag-green'
    : 'bg-rag-amber-bg text-rag-amber'

  return (
    <div className="border border-black/8 rounded-xl p-4 bg-white space-y-2">
      <div className="flex items-start justify-between gap-3">
        <p className="font-inter text-sm font-semibold text-charcoal">{name}</p>
        <span className={`flex-shrink-0 font-inter text-xs font-medium px-2.5 py-1 rounded-full ${typeColor}`}>
          {type}
        </span>
      </div>
      <p className="font-inter text-xs text-charcoal/65 leading-relaxed"><span className="font-medium">Purpose:</span> {purpose}</p>
      <p className="font-inter text-xs text-charcoal/65"><span className="font-medium">Duration:</span> {duration}</p>
    </div>
  )
}

export default function CookiePolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <div className="flex-1 px-4 py-12">
        <div className="max-w-2xl mx-auto">

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 font-inter text-xs text-warm-brown hover:text-warm-brown-dark transition-colors mb-8"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Privacy Health Check
          </Link>

          <div className="card mb-8 text-center">
            <p className="font-inter text-xs uppercase tracking-widest text-warm-brown mb-3">The Privacy Blueprint</p>
            <h1 className="font-playfair text-3xl sm:text-4xl text-charcoal mb-3">Cookie Policy</h1>
            <p className="font-inter text-xs text-charcoal/40">Last reviewed: April 2026</p>
          </div>

          <Section title="What Are Cookies">
            <P>
              Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work, improve user experience, and provide information to website owners.
            </P>
            <P>
              Under UK GDPR and the Privacy and Electronic Communications Regulations (PECR), we are required to tell you what cookies we use, why we use them, and to obtain your consent before placing any non-essential cookies on your device.
            </P>
          </Section>

          <Section title="Cookies Used by This App">
            <P>
              The Privacy Health Check tool is a client-side React application. We have audited all cookies and third-party scripts. Here is a complete list:
            </P>

            <div className="space-y-3">
              <CookieRow
                name="No first-party cookies"
                purpose="This app stores your quiz answers in React memory only — it is cleared when you close or refresh the page. No cookies, localStorage, or sessionStorage are written by the app itself."
                duration="N/A — in-memory only"
                type="Strictly Necessary"
              />
              <CookieRow
                name="Google Fonts (fonts.googleapis.com)"
                purpose="Loads the Playfair Display and Inter typefaces used in the app. Google's servers receive your IP address and browser information when the fonts are requested. Google may use this for their own analytics. No cookie is placed in your browser by this request, but it is a third-party data transfer."
                duration="Font files cached by browser (typically 1 year)"
                type="Non-Essential"
              />
              <CookieRow
                name="Vercel (_vercel_jwt)"
                purpose="Set only on password-protected preview deployments, not on the live production site. If you are visiting the published app, this cookie is not present."
                duration="Session"
                type="Strictly Necessary"
              />
              <CookieRow
                name="Formspree"
                purpose="When you submit the contact form, your name and email are sent to Formspree via a secure API call. Formspree does not set any cookies in your browser. Your data is processed by Formspree in accordance with their privacy policy."
                duration="N/A — no cookie set"
                type="Strictly Necessary"
              />
            </div>

            <div className="bg-rag-green-bg border border-rag-green/20 rounded-xl p-4 mt-2">
              <p className="font-inter text-sm font-semibold text-rag-green mb-1">Summary</p>
              <p className="font-inter text-sm text-charcoal/70 leading-relaxed">
                This app sets <strong>no first-party cookies</strong>. The only third-party data transfer is Google Fonts. If you wish to eliminate this entirely, fonts can be self-hosted — contact us if you'd like this change made.
              </p>
            </div>
          </Section>

          <Section title="Managing Cookies">
            <P>
              You can control and delete cookies through your browser settings. Please note that blocking certain cookies may affect the functionality of websites you visit.
            </P>
            <P>Guidance for common browsers:</P>
            <ul className="space-y-1.5 pl-4">
              {[
                { name: 'Chrome', url: 'support.google.com/chrome/answer/95647' },
                { name: 'Safari (iPhone/iPad)', url: 'support.apple.com/en-gb/guide/safari/sfri11471' },
                { name: 'Firefox', url: 'support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer' },
              ].map(b => (
                <li key={b.name} className="font-inter text-sm text-charcoal/75 leading-relaxed list-disc">
                  {b.name}: {b.url}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Changes to This Cookie Policy">
            <P>
              We may update this Cookie Policy from time to time as our services evolve or regulations change. The date at the top of this page reflects when it was last reviewed.
            </P>
          </Section>

          <Section title="Contact Us">
            <P>
              If you have any questions about how we use cookies, please contact us at{' '}
              <a href="mailto:hello@theprivacyblueprint.co.uk" className="text-warm-brown underline">
                hello@theprivacyblueprint.co.uk
              </a>.
            </P>
            <P>
              You also have the right to complain to the ICO at{' '}
              <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-warm-brown underline">
                ico.org.uk
              </a>{' '}
              if you believe we have not handled your data correctly.
            </P>
          </Section>

        </div>
      </div>
      <Footer />
    </div>
  )
}
