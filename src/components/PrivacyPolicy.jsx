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

function ExtLink({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-warm-brown underline hover:text-warm-brown-dark transition-colors"
    >
      {children}
    </a>
  )
}

function Processor({ name, description, location, policyUrl }) {
  return (
    <div className="border border-black/8 rounded-xl p-4 bg-white space-y-1">
      <p className="font-inter text-sm font-semibold text-charcoal">{name}</p>
      <p className="font-inter text-sm text-charcoal/70 leading-relaxed">{description}</p>
      <p className="font-inter text-xs text-charcoal/50">Based in {location}.</p>
      <p className="font-inter text-xs">
        <span className="text-charcoal/50">Privacy policy: </span>
        <ExtLink href={policyUrl}>{policyUrl}</ExtLink>
      </p>
    </div>
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
            <p className="font-inter text-xs text-charcoal/40">Effectivity date: 19 April 2026</p>
          </div>

          {/* 1 ── Introduction */}
          <Section title="Introduction">
            <P>
              Welcome to The Privacy Blueprint ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website once live, use our services, or interact with us via our digital platforms including Beacons.ai.
            </P>
            <P>
              By using our services, you agree to the collection and use of information in accordance with this Privacy Policy.
            </P>
          </Section>

          {/* 2 ── Applicable Law and Scope */}
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
              The Privacy Blueprint is the data controller responsible for your personal data. If you have any questions about how we handle your data, please contact us at{' '}
              <ExtLink href="mailto:hello@theprivacyblueprint.co.uk">hello@theprivacyblueprint.co.uk</ExtLink>.
            </P>
          </Section>

          {/* 3 ── Information We Collect */}
          <Section title="Information We Collect">
            <P>We may collect and process the following categories of personal data about you:</P>
            <div className="space-y-2">
              <Bold label="Personal Identifiers">Your name, email address, phone number, and billing address, collected when you contact us, purchase our services, or sign up to receive communications from us.</Bold>
              <Bold label="Financial Data">Payment information processed securely through our third-party payment provider PayPal. We do not see or store your full payment card details.</Bold>
              <Bold label="Technical Data">Your IP address, browser type and version, operating system, time zone setting, browser plug-in types, and pages visited. This data is collected automatically when you interact with our digital platforms including beacons.ai and future website services.</Bold>
              <Bold label="Usage Data">Information about how you use our website and services, including pages viewed, links clicked, and time spent on pages.</Bold>
              <Bold label="Communications Data">Any information you provide when you contact us directly, including the content of emails or enquiry forms.</Bold>
              <Bold label="Marketing Preferences">Your preferences regarding receiving marketing communications from us.</Bold>
            </div>
            <P>We collect this data directly from you, automatically through your use of our website, and in some cases from third-party service providers such as analytics platforms.</P>
            <P>We do not collect any special category (sensitive) personal data unless you voluntarily provide it and we have a lawful basis to process it.</P>
          </Section>

          {/* 4 ── How We Use Your Data */}
          <Section title="How We Use Your Data">
            <P>We use the collected data for various purposes, including:</P>
            <Ul items={[
              'To provide, maintain, and improve our services including digital products and GDPR consulting services.',
              'To process transactions and deliver purchased products.',
              'To communicate with you, including responding to enquiries and sending service related updates.',
              'To send marketing communications, but only where you have given us your explicit, opt-in consent. You can withdraw consent at any time by clicking unsubscribe in any email or contacting us directly.',
              'To monitor the usage of platforms including beacons.ai and analyse trends to improve our offerings.',
              'To detect, prevent, and address technical or security issues.',
              'To comply with legal obligations.',
            ]} />
          </Section>

          {/* 5 ── Our Lawful Basis for Processing (NEW) */}
          <Section title="Our Lawful Basis for Processing">
            <P>
              Under UK GDPR, we must have a valid legal reason — known as a "lawful basis" — for processing your personal data. Below we explain the lawful basis we rely on for each activity:
            </P>
            <div className="space-y-2">
              <Bold label="Delivering products and services you have purchased — Contract">
                We need to process your data to fulfil our agreement with you.
              </Bold>
              <Bold label="Processing payments — Contract and Legal Obligation">
                We need to process your payment to deliver your purchase, and we are legally required to retain transactional records for tax and accounting purposes.
              </Bold>
              <Bold label="Responding to enquiries — Legitimate Interests">
                It is in our legitimate interest to respond to people who contact us about our services. We have considered your rights and interests and do not believe this processing overrides them.
              </Bold>
              <Bold label="Sending marketing communications — Consent">
                We only send marketing emails to people who have given us their explicit, opt-in consent. You can withdraw this consent at any time by clicking "unsubscribe" in any email or contacting us directly.
              </Bold>
              <Bold label="Improving our services and understanding how our platforms are used — Legitimate Interests">
                It is in our legitimate interest to understand how visitors use our platforms so we can improve our services. We use privacy-respectful analytics and do not build individual profiles.
              </Bold>
              <Bold label="Complying with legal obligations — Legal Obligation">
                We may need to process and retain certain data to meet our legal and regulatory obligations, including tax, accounting, and responding to lawful requests from authorities.
              </Bold>
            </div>
          </Section>

          {/* 6 ── International Data Transfers (NEW) */}
          <Section title="International Data Transfers">
            <P>
              Some of the third-party tools we use are based outside the United Kingdom, which means your personal data may be transferred internationally. This typically includes transfers to the United States, the European Economic Area, and Australia.
            </P>
            <P>
              Where this applies, we ensure appropriate safeguards are in place as required under UK GDPR. These safeguards include:
            </P>
            <div className="space-y-2">
              <Bold label="Standard Contractual Clauses (SCCs)">Legally binding clauses approved for international transfers.</Bold>
              <Bold label="UK-US Data Bridge">The UK extension to the EU-US Data Privacy Framework, where the US provider is certified.</Bold>
              <Bold label="Adequacy decisions">For transfers to countries recognised by the UK as providing adequate data protection.</Bold>
            </div>
            <P>
              You can request more information about the specific safeguards in place for any transfer by contacting us at{' '}
              <ExtLink href="mailto:hello@theprivacyblueprint.co.uk">hello@theprivacyblueprint.co.uk</ExtLink>.
            </P>
          </Section>

          {/* 7 ── How We Share Your Information (REPLACED) */}
          <Section title="How We Share Your Information">
            <P>
              We do not sell your personal data. We share your information only where necessary to run our business, and only with carefully chosen providers who meet UK GDPR standards.
            </P>
            <P>We may share your data in the following situations:</P>

            <div className="space-y-2">
              <p className="font-inter text-sm font-semibold text-charcoal">With Third-Party Service Providers</p>
              <P>
                We use a small number of tools to operate our business. Where these tools process personal data on our behalf, they act as our data processors and are bound by contractual obligations to protect your data. The tools we currently use are:
              </P>
            </div>

            <div className="space-y-3">
              <Processor
                name="Beacons"
                description="Link-in-bio platform used to host our landing page and route visitors to our services. Beacons may set cookies and collect usage data when you visit our page."
                location="United States"
                policyUrl="https://beacons.ai/privacy"
              />
              <Processor
                name="Formspree"
                description="Form processing service used to handle enquiries and form submissions on our Privacy Health Check tool. Formspree processes form data on our behalf and does not use it for its own purposes."
                location="United States"
                policyUrl="https://formspree.io/legal/privacy-policy"
              />
              <Processor
                name="Google Workspace"
                description="Used for email, document storage, and internal business operations. Any emails you send us, or documents shared with us, are processed via Google Workspace."
                location="United States with UK/EU data centres available"
                policyUrl="https://policies.google.com/privacy"
              />
              <Processor
                name="Canva"
                description="Design tool used to create templates, content, and branded materials. Canva does not process your personal data as part of our services unless you directly interact with a Canva-hosted asset."
                location="Australia"
                policyUrl="https://www.canva.com/policies/privacy-policy"
              />
              <Processor
                name="PayPal"
                description="Payment processor used to take payments for our products and services. When you purchase from us, PayPal processes your payment details directly — we do not see or store your card information."
                location="Luxembourg (for UK/EU customers)"
                policyUrl="https://www.paypal.com/uk/legalhub/privacy-full"
              />
              <Processor
                name="Vercel"
                description="Hosting platform used to run our Privacy Health Check tool. Vercel processes basic technical data (such as IP addresses) to deliver the service."
                location="United States"
                policyUrl="https://vercel.com/legal/privacy-policy"
              />
            </div>

            <P>
              Each provider is subject to their own privacy policy, linked above. We review our third-party tools regularly to make sure they continue to meet UK GDPR standards.
            </P>

            <Bold label="For Business Transfers">
              If we are involved in a merger, acquisition, or sale of business assets, your personal data may be transferred as part of that transaction. You will be notified in advance of any such transfer.
            </Bold>
            <Bold label="For Legal Reasons">
              We may disclose your information if required to do so by law, in response to valid requests by public authorities, or where necessary to protect our legal rights.
            </Bold>
          </Section>

          {/* 8 ── Providing Your Data (NEW) */}
          <Section title="Providing Your Data">
            <P>Some of the personal data we collect is required, and some is optional.</P>
            <div className="space-y-2">
              <Bold label="Required data">
                When you purchase a product or service, we need your name, email address, and payment details. Without this, we cannot fulfil your order.
              </Bold>
              <Bold label="Optional data">
                On our Privacy Health Check tool, providing your name and email is optional. You can complete the check and see your results without sharing any personal data with us.
              </Bold>
              <Bold label="Marketing communications">
                Signing up to receive marketing communications is always optional. You can unsubscribe at any time.
              </Bold>
            </div>
          </Section>

          {/* 9 ── Automated Decision-Making (NEW) */}
          <Section title="Automated Decision-Making">
            <P>
              We do not use automated decision-making or profiling in a way that produces legal or similarly significant effects on you. Any assessments, scores, or recommendations provided through our tools (including the Privacy Health Check) are guidance only and do not determine any legal or contractual outcome.
            </P>
          </Section>

          {/* 10 ── Cookies and Tracking Technologies */}
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
              <Link to="/cookie-policy" className="text-warm-brown underline hover:text-warm-brown-dark transition-colors">Cookie Policy</Link>.
            </P>
          </Section>

          {/* 11 ── Your Data Protection Rights */}
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
              <Bold label="The Right to Withdraw Consent">
                Where we process your personal data based on your consent — for example, to send you marketing communications — you have the right to withdraw that consent at any time. Withdrawing consent is as easy as giving it. You can do this by clicking unsubscribe in any marketing email or by contacting us at{' '}
                <ExtLink href="mailto:hello@theprivacyblueprint.co.uk">hello@theprivacyblueprint.co.uk</ExtLink>.
                {' '}Withdrawing consent does not affect the lawfulness of any processing we carried out before you withdrew it.
              </Bold>
              <Bold label="Rights in Relation to Automated Decision Making">You have the right not to be subject to decisions made solely by automated processing, including profiling, where those decisions have a significant effect on you.</Bold>
            </div>
            <P>
              To exercise any of these rights, please contact us at{' '}
              <ExtLink href="mailto:hello@theprivacyblueprint.co.uk">hello@theprivacyblueprint.co.uk</ExtLink>. We will respond within 30 days.
            </P>
          </Section>

          {/* 12 ── Data Protection Responsibility */}
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
            <P>The Privacy Blueprint — <ExtLink href="mailto:hello@theprivacyblueprint.co.uk">hello@theprivacyblueprint.co.uk</ExtLink></P>
          </Section>

          {/* 13 ── Your Right to Lodge a Complaint */}
          <Section title="Your Right to Lodge a Complaint">
            <P>If you are based in the United Kingdom and are unhappy with how we have handled your personal data, you have the right to lodge a complaint with the Information Commissioner's Office (ICO), the UK's supervisory authority for data protection.</P>
            <P>ICO contact details:</P>
            <ul className="space-y-1.5 pl-4">
              <li className="font-inter text-sm text-charcoal/75 leading-relaxed list-disc">
                Website: <ExtLink href="https://ico.org.uk">www.ico.org.uk</ExtLink>
              </li>
              <li className="font-inter text-sm text-charcoal/75 leading-relaxed list-disc">Helpline: 0303 123 1113</li>
              <li className="font-inter text-sm text-charcoal/75 leading-relaxed list-disc">Address: Information Commissioner's Office, Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF</li>
            </ul>
            <P>
              If you are based in the European Economic Area (EEA), you have the right to lodge a complaint with your local data protection supervisory authority. A full list of EEA supervisory authorities can be found at{' '}
              <ExtLink href="https://www.edpb.europa.eu">www.edpb.europa.eu</ExtLink>.
            </P>
            <P>We would appreciate the opportunity to address your concerns before you contact a supervisory authority. Please contact us in the first instance using the details provided at the end of this policy.</P>
          </Section>

          {/* 14 ── Data Security and Retention */}
          <Section title="Data Security and Retention">
            <P>We use appropriate technical and organisational measures to protect your personal data.</P>
            <P>We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy, or as required by law.</P>
            <Ul items={[
              'Customer and transactional data: up to 6 years (for legal and financial obligations)',
              'Email subscribers: until you unsubscribe or become inactive',
              'Enquiry data: up to 12 months unless a business relationship is established',
            ]} />
          </Section>

          {/* 15 ── Children's Privacy */}
          <Section title="Children's Privacy">
            <P>Our services are not directed at children under the age of 13.</P>
            <P>We do not knowingly collect personally identifiable information from children under this age.</P>
            <P>If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us.</P>
          </Section>

          {/* 16 ── Third-Party Links */}
          <Section title="Third-Party Links">
            <P>Our platforms may contain links to third-party websites. We are not responsible for their privacy practices and we strongly advise you to review the Privacy Policy of every site you visit.</P>
          </Section>

          {/* 17 ── Changes to This Privacy Policy */}
          <Section title="Changes to This Privacy Policy">
            <P>We may update our Privacy Policy from time to time. Updates will be posted with a revised effective date at the top.</P>
          </Section>

          {/* 18 ── Contact Us */}
          <Section title="Contact Us">
            <P>If you have any questions about this Privacy Policy, please contact us:</P>
            <ul className="space-y-1.5 pl-4">
              <li className="font-inter text-sm text-charcoal/75 leading-relaxed list-disc">
                By email: <ExtLink href="mailto:hello@theprivacyblueprint.co.uk">hello@theprivacyblueprint.co.uk</ExtLink>
              </li>
              <li className="font-inter text-sm text-charcoal/75 leading-relaxed list-disc">
                Platform: <ExtLink href="https://www.beacons.ai/theprivacyblueprint">www.beacons.ai/theprivacyblueprint</ExtLink>
              </li>
            </ul>
          </Section>

        </div>
      </div>
      <Footer />
    </div>
  )
}
