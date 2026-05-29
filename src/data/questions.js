export const questions = [
  {
    id: 1,
    topic: "Privacy Policy",
    question: "Do you have a privacy policy on your website, link-in-bio page, or wherever you collect data?",
    options: [
      { text: "Yes, and I've reviewed it in the last 12 months", score: 2, color: "green" },
      { text: "Yes, but I haven't reviewed it recently / I used a free generator", score: 1, color: "amber" },
      { text: "No", score: 0, color: "red" },
    ],
    fixes: {
      red: "You need a privacy policy. It's a legal requirement under UK GDPR if you collect any personal data.",
      amber: "Review and update your privacy policy. Outdated or generic policies often miss key requirements.",
    },
  },
  {
    id: 2,
    topic: "Cookie Policy & Consent Banner",
    question: "Does your website show a cookie banner that lets people accept or decline non-essential cookies?",
    options: [
      { text: "Yes, with accept and decline options", score: 2, color: "green" },
      { text: "Yes, but it only has an 'accept' button / auto-accepts", score: 1, color: "amber" },
      { text: "No / I don't have a website", score: 0, color: "red" },
    ],
    fixes: {
      red: "Add a compliant cookie banner to your website with both accept and decline options.",
      amber: "Your banner needs a clear 'decline' option. Consent must be as easy to refuse as to give.",
    },
  },
  {
    id: 3,
    topic: "Data Collection Awareness",
    question: "Do you know exactly what personal data you collect (names, emails, IPs, payment info, analytics data)?",
    options: [
      { text: "Yes, I've mapped it out", score: 2, color: "green" },
      { text: "Roughly, but not documented", score: 1, color: "amber" },
      { text: "No", score: 0, color: "red" },
    ],
    fixes: {
      red: "Map your data. You can't protect what you haven't identified. Start with a simple audit.",
      amber: "Document your data flows properly. Informal knowledge doesn't meet UK GDPR's accountability requirement.",
    },
  },
  {
    id: 4,
    topic: "Lawful Basis",
    question: "For each type of data you collect, do you know your lawful basis for processing it (consent, contract, legitimate interest, etc.)?",
    options: [
      { text: "Yes, for all data types", score: 2, color: "green" },
      { text: "For some, not all", score: 1, color: "amber" },
      { text: "I don't know what a lawful basis is", score: 0, color: "red" },
    ],
    fixes: {
      red: "Identify a lawful basis for every type of data you process. This is a core UK GDPR requirement.",
      amber: "Complete your lawful basis mapping across all data types, not just some.",
    },
  },
  {
    id: 5,
    topic: "Email Marketing Consent",
    question: "If you send marketing emails, did subscribers actively opt in (tick a box, enter their email for that purpose)?",
    options: [
      { text: "Yes, every subscriber opted in", score: 2, color: "green" },
      { text: "Mostly, but I've added contacts from other sources", score: 1, color: "amber" },
      { text: "No / I'm not sure", score: 0, color: "red" },
    ],
    fixes: {
      red: "Stop emailing contacts who didn't opt in. Clean your list and rebuild with proper consent.",
      amber: "Audit your email list and remove any contacts who didn't actively opt in to marketing.",
    },
  },
  {
    id: 6,
    topic: "Third-Party Tools (DPAs)",
    question: "Do you have Data Processing Agreements (DPAs) in place with tools like Mailchimp, Stripe, Google, Meta?",
    options: [
      { text: "Yes, all in place", score: 2, color: "green" },
      { text: "Some, not all", score: 1, color: "amber" },
      { text: "No / I didn't know I needed them", score: 0, color: "red" },
    ],
    fixes: {
      red: "You need Data Processing Agreements with every tool that handles your customers' data.",
      amber: "Complete your DPA coverage. Partial compliance leaves you exposed if a processor has a breach.",
    },
  },
  {
    id: 7,
    topic: "Data Subject Requests (DSARs)",
    question: "If someone emailed asking for a copy of their data or to delete it, would you know what to do within 30 days?",
    options: [
      { text: "Yes, I have a process", score: 2, color: "green" },
      { text: "I'd figure it out", score: 1, color: "amber" },
      { text: "No", score: 0, color: "red" },
    ],
    fixes: {
      red: "Build a DSAR process now. You have 30 days to respond and you won't have time to figure it out under pressure.",
      amber: "Document your DSAR process. 'Figuring it out' fails under the 30-day deadline.",
    },
  },
  {
    id: 8,
    topic: "ICO Registration",
    question: "Are you registered with the ICO and paying your annual data protection fee (£40–£60 for most small businesses)?",
    options: [
      { text: "Yes", score: 2, color: "green" },
      { text: "I'm not sure if I need to", score: 1, color: "amber" },
      { text: "No", score: 0, color: "red" },
    ],
    fixes: {
      red: "Register with the ICO and pay your data protection fee. It's a legal requirement and non-registration is publicly searchable.",
      amber: "Check if you need to register on the ICO's website. Most businesses handling personal data do.",
    },
  },
  {
    id: 9,
    topic: "Data Breach Plan",
    question: "If you had a data breach tomorrow, would you know the 72-hour reporting requirement and have a plan?",
    options: [
      { text: "Yes, I have a written plan", score: 2, color: "green" },
      { text: "I know the rule but no plan", score: 1, color: "amber" },
      { text: "No", score: 0, color: "red" },
    ],
    fixes: {
      red: "Create a written breach response plan. You have 72 hours to report serious breaches to the ICO.",
      amber: "Put your breach plan in writing. Under pressure, memory isn't enough.",
    },
  },
  {
    id: 10,
    topic: "Data Retention",
    question: "Do you have a policy on how long you keep customer data before deleting it?",
    options: [
      { text: "Yes, documented", score: 2, color: "green" },
      { text: "Informally, not written down", score: 1, color: "amber" },
      { text: "No", score: 0, color: "red" },
    ],
    fixes: {
      red: "Set retention periods for each data type. Holding data indefinitely is a UK GDPR breach.",
      amber: "Document your retention policy formally. Informal rules don't meet accountability standards.",
    },
  },
]

export function getRagRating(score) {
  if (score >= 15) return { label: "Green", color: "green", message: "Strong foundations. You're doing well on the basics. A few gaps remain worth addressing to stay fully compliant." }
  if (score >= 8) return { label: "Amber", color: "amber", message: "Some compliance in place, but meaningful gaps remain. Addressing these now is far less costly than an ICO complaint later." }
  return { label: "Red", color: "red", message: "Significant compliance gaps identified. These are legal risks, not just best practice. Prioritise action as soon as possible." }
}

export function getPriorityFixes(answers) {
  return answers
    .map((score, index) => ({ score, question: questions[index] }))
    .filter(({ score }) => score < 2)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map(({ score, question }) => ({
      topic: question.topic,
      fix: score === 0 ? question.fixes.red : question.fixes.amber,
      color: score === 0 ? "red" : "amber",
    }))
}
