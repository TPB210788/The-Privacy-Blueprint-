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

function Ul({ items }) {
  return (
    <ul className="space-y-1.5 pl-4">
      {items.map((item, i) => (
        <li key={i} className="font-inter text-sm text-charcoal/75 leading-relaxed list-disc">{item}</li>
      ))}
    </ul>
  )
}

function Bold({ label, children }) {
  return (
    <p className="font-inter text-sm text-charcoal/75 leading-relaxed">
      <span className="font-semibold text-charcoal">{label}:</span> {children}
    </p>
  )
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <div className="flex-1 px-4 py-12">
        <div className="max-w-2xl mx-auto">

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

          {/* Header */}
          <div className="card mb-8 text-center">
            <p className="font-inter text-xs uppercase tracking-widest text-warm-brown mb-3">The Privacy Blueprint</p>
            <h1 className="font-playfair text-3xl sm:text-4xl text-charcoal mb-3">Privacy Policy</h1>
            <p className="font-inter text-xs text-charcoal/40">Effectivity date: 29 March 2026</p>
          </div>

          <Section title="Introduction">
            <P>
              Welcome to The Privacy Blueprint ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website once live, use our services, or interact with us via our digital platforms including Beacons.ai.
            </P>
            <P>
              By using our services, you agree to the collection and use of information in accordance with this Privacy Policy.
            </P>
          </Section>

          <Section title="Applicable Law and Scope">
            <P>This Privacy Policy is governed by and compliant with:</P>
            <P>
              The UK General Data Protection Regulation (UK GDPR), as retained in UK law under the European Union (Withdrawal) Act 2018, and the Data Protection Act 2018. The supervisory authority for the United Kingdom is the Information Commissioner's Office (ICO).
            </P>
            <P>
              The EU General Data Protection Regulation (EU GDPR) (Regulation 2016/679), where we process the personal data of individuals located in the European Economic Area (EEA).
            </P>
            <P>
              Where this policy refers to "GDPR," it applies to both the UK GDPR and EU GDPR unless stated otherwise.
            </P>
            <P>
              The Privacy Blueprint is the data controller responsible for your personal data. If you have any questions about how we handle your data, please contact us at:{' '}
              <a href="mailto:hello@theprivacyblueprint.co.uk" className="text-warm-brown underline">hello@theprivacyblueprint.co.uk</a>
            </P>
          </Section>

          <Section title="Information We Collect">
            <P>We may collect and process the following categories of personal data about you:</P>
            <div className="space-y-2">
              <Bold label="Personal Identifiers">Your name, email address, phone number, and billing address, collected when you contact us, purchase our services, or sign up to receive communications from us.</Bold>
              <Bold label="Financial Data">Payment information processed securely through our third-party payment providers including PayPal (and Stripe where applicable). We do not store full payment card details.</Bold>
              <Bold label="Technical Data">Your IP address, browser type and version, operating system, time zone setting, browser plug-in types, and pages visited. This data is collected automatically when you interact with our digital platforms including beacons.ai and future website services.</Bold>
              <Bold label="Usage Data">Information about how you use our website and services, including pages viewed, links clicked, and time spent on pages.</Bold>
              <Bold label="Communications Data">Any information you provide when you contact us directly, including the content of emails or enquiry forms.</Bold>
              <Bold label="Marketing Preferences">Your preferences regarding receiving marketing communications from us.</Bold>
            </div>
            <P>We collect this data directly from you, automatically through your use of our website, and in some cases from third-party service providers such as analytics platforms.</P>
            <P>We do not collect any special category (sensitive) personal data unless you voluntarily provide it and we have a lawful basis to process it.</P>
          </Section>

          <Section title="How We Use Your Data">
            <P>We use the collected data for various purposes, including:</P>
            <Ul items={[
              'To provide, maintain, and improve our services including digital products and GDPR consulting services.',
              'To process transactions and deliver purchased products.',
              'To communicate with you, including responding to enquiries and sending service related updates.',
              'To send marketing communications where you have opted in, including free resources, GDPR insights, and product / service updates.',
              'To monitor the usage of platforms including beacons.ai and analyse trends to improve our offerings.',
              'To detect, prevent, and address technical or security issues.',
              'To comply with legal obligations.',
            ]} />
          </Section>

          <Section title="How We Share Your Information">
            <P>We do not sell your personal data. We may share your information in the following situations:</P>
            <Bold label="With Service Providers">We may share data with third-party vendors who assist us in operating our business, including:</Bold>
            <Ul items={[
              'Beacons.ai (digital storefront and link-in-bio platform)',
              'PayPal (payment processing)',
              'Stripe (payment processing, where applicable)',
              'Google Workspace (email and communication services)',
            ]} />
            <Bold label="For Business Transfers">If we are involved in a merger, acquisition, or asset sale, your personal data may be transferred.</Bold>
            <Bold label="For Legal Reasons">We may disclose your information if required to do so by law or in response to valid requests by public authorities.</Bold>
          </Section>

          <Section title="Cookies and Tracking Technologies">
            <P>Our website (once live) and digital platforms may use cookies and similar tracking technologies to enhance your browsing experience and analyse usage.</P>
            <P>A cookie is a small text file placed on your device when you visit a website. Some cookies are essential for the website to operate correctly. Others are used for analytics, functionality or marketing purposes and are only placed on your device with your consent.</P>
            <P>The types of cookies we use include:</P>
            <div className="space-y-2">
              <Bold label="Strictly Necessary Cookies">Required for the website to operate correctly. These cannot be disabled as the website will not function without them.</Bold>
              <Bold label="Analytics Cookies">Help us understand how visitors use our website, including which pages are visited most frequently. For example, Google Analytics.</Bold>
              <Bold label="Functional Cookies">Remember your preferences and settings to improve your experience on return visits.</Bold>
              <Bold label="Marketing Cookies">Used to deliver relevant advertising and to track the performance of marketing campaigns.</Bold>
            </div>
            <P>You can control and manage cookies at any time through your browser settings. Please note that disabling certain cookies may affect the functionality of our website.</P>
            <P>
              For full details of the specific cookies we use, please refer to our{' '}
              <Link to="/cookie-policy" className="text-warm-brown underline">Cookie Policy</Link>.
            </P>
          </Section>

          <Section title="Your Data Protection Rights">
            <P>Under UK GDPR and EU GDPR, you have the following rights regarding your personal data:</P>
            <div className="space-y-2">
              <Bold label="The Right to Be Informed">You have the right to be told clearly what personal data we collect about you, why we collect it, and what we do with it. This Privacy Policy fulfils that obligation.</Bold>
              <Bold label="The Right of Access">You have the right to request a copy of all personal data we hold about you. This is called a Subject Access Request (SAR). We will respond within 30 days free of charge.</Bold>
              <Bold label="The Right to Rectification">You have the right to ask us to correct any personal data you believe is inaccurate or incomplete.</Bold>
              <Bold label="The Right to Erasure">Also known as the Right to be Forgotten. You have the right to request that we delete your personal data, subject to certain legal exceptions.</Bold>
              <Bold label="The Right to Restrict Processing">You have the right to ask us to pause or restrict the processing of your personal data in certain circumstances.</Bold>
              <Bold label="The Right to Data Portability">You have the right to request that we provide your personal data in a structured, commonly used, machine-readable format so you can transfer it to another service provider.</Bold>
              <Bold label="The Right to Object">You have the right to object to the processing of your personal data at any time where we rely on legitimate interests as our legal basis. You have an absolute right to object to your data being used for direct marketing purposes — we must stop immediately upon receiving your objection.</Bold>
              <Bold label="Rights in Relation to Automated Decision Making">You have the right not to be subject to decisions made solely by automated processing, including profiling, where those decisions have a significant effect on you.</Bold>
            </div>
            <P>
              To exercise any of these rights, please contact us at{' '}
              <a href="mailto:hello@theprivacyblueprint.co.uk" className="text-warm-brown underline">hello@theprivacyblueprint.co.uk</a>. We will respond within 30 days.
            </P>
          </Section>

          <Section title="Data Protection Responsibility">
            <P>The Privacy Blueprint takes its data protection obligations seriously. Responsibility for ensuring compliance with this policy and with applicable data protection law sits with the business owner and designated privacy lead of The Privacy Blueprint.</P>
            <P>Whether a formal Data Protection Officer (DPO) is required depends on the nature and scale of your data processing activities. Under UK GDPR, a DPO must be appointed if your organisation:</P>
            <Ul items={[
              'Processes personal data on a large scale as a core activity',
              'Carries out large-scale systematic monitoring of individuals, or',
              'Processes special category or criminal offence data on a large scale',
            ]} />
            <P>Most small businesses are not legally required to appoint a DPO.</P>
            <P>We have not appointed a formal Data Protection Officer as this is not currently required for our scale of processing. All data protection queries should be directed to:</P>
            <P>The Privacy Blueprint — <a href="mailto:hello@theprivacyblueprint.co.uk" className="text-warm-brown underline">hello@theprivacyblueprint.co.uk</a></P>
          </Section>

          <Section title="Your Right to Lodge a Complaint">
            <P>If you are based in the United Kingdom and are unhappy with how we have handled your personal data, you have the right to lodge a complaint with the Information Commissioner's Office (ICO), the UK's supervisory authority for data protection.</P>
            <P>ICO contact details:</P>
            <Ul items={[
              'Website: www.ico.org.uk',
              'Helpline: 0303 123 1113',
              'Address: Information Commissioner\'s Office, Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF',
            ]} />
            <P>If you are based in the European Economic Area (EEA), you have the right to lodge a complaint with your local data protection supervisory authority. A full list of EEA supervisory authorities can be found at: www.edpb.europa.eu</P>
            <P>We would appreciate the opportunity to address your concerns before you contact a supervisory authority. Please contact us in the first instance using the details provided at the end of this policy.</P>
          </Section>

          <Section title="Data Security and Retention">
            <P>We use appropriate technical and organisational measures to protect your personal data.</P>
            <P>We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy, or as required by law.</P>
            <Ul items={[
              'Customer and transactional data: up to 6 years (for legal and financial obligations)',
              'Email subscribers: until you unsubscribe or become inactive',
              'Enquiry data: up to 12 months unless a business relationship is established',
            ]} />
          </Section>

          <Section title="Children's Privacy">
            <P>Our services are not directed at children under the age of 13.</P>
            <P>We do not knowingly collect personally identifiable information from children under this age.</P>
            <P>If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us.</P>
          </Section>

          <Section title="Third-Party Links">
            <P>Our platforms may contain links to third-party websites. We are not responsible for their privacy practices and we strongly advise you to review the Privacy Policy of every site you visit.</P>
          </Section>

          <Section title="Changes to This Privacy Policy">
            <P>We may update our Privacy Policy from time to time. Updates will be posted with a revised effective date at the top.</P>
          </Section>

          <Section title="Contact Us">
            <P>If you have any questions about this Privacy Policy, please contact us:</P>
            <Ul items={[
              'By email: hello@theprivacyblueprint.co.uk',
              'Platform: www.beacons.ai/theprivacyblueprint',
            ]} />
          </Section>

        </div>
      </div>
      <Footer />
    </div>
  )
}
