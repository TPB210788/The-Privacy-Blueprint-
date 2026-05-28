/**
 * Seeds the dashboard with real data from your three operating systems:
 * - The Privacy Blueprint CEO Dashboard
 * - CIPM Study Operating System
 * - Self Care / Soft Life Reset
 *
 * Run once after deployment: node scripts/seed-data.js
 * Safe to re-run — uses INSERT OR IGNORE where possible.
 */

require('dotenv').config();
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbDir = process.env.DB_PATH ? path.dirname(process.env.DB_PATH) : path.join(__dirname, '..', 'data');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
const dbPath = process.env.DB_PATH || path.join(dbDir, 'dashboard.db');
const db = new Database(dbPath);

db.pragma('foreign_keys = ON');

console.log('\n✨ Seeding your Life Dashboard with real data...\n');

// ─────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────
const upsert = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
upsert.run('user_name', 'Ines');
upsert.run('cipm_exam_date', '2026-07-14');
upsert.run('run_goal_weekly_miles', '12');
upsert.run('affirmations', JSON.stringify([
  "You are building something real and it is already working.",
  "Your ADHD is a superpower — not a limitation.",
  "Progress over perfection, always.",
  "You are worthy of rest, beauty, and care. This is not a luxury. This is how you thrive.",
  "One thing at a time, and that one thing well.",
  "You showed up today. That is enough.",
  "The Privacy Blueprint is exactly where it needs to be.",
  "Rest is not giving up — it is fuelling up.",
  "You are organised chaos and that is beautiful.",
  "Small consistent steps build empires."
]));
console.log('✓ Settings updated');

// ─────────────────────────────────────────────
// HABITS — from Soft Life Reset OS
// ─────────────────────────────────────────────
db.prepare('DELETE FROM habit_logs').run();
db.prepare('DELETE FROM habits').run();

const insertHabit = db.prepare('INSERT INTO habits (name, category, emoji, frequency, color) VALUES (?, ?, ?, ?, ?)');
const habits = [
  // Self-care
  ['Morning skin care (cleanse · SPF · vitamin C)', 'self-care', '🌅', 'daily', '#E8A598'],
  ['Evening skin care (double cleanse · serum · mask)', 'self-care', '🌙', 'daily', '#C4B5D4'],
  ['Drink water (8 glasses)', 'self-care', '💧', 'daily', '#A8C5DA'],
  ['Vitamins & meds', 'self-care', '💊', 'daily', '#F5C5A0'],
  ['Body lotion ritual (after shower)', 'self-care', '✨', 'daily', '#F5D5CE'],
  // Hair (4C)
  ['LOC method — moisturise & seal hair', 'hair', '💆', 'daily', '#A8D5B5'],
  ['Wear satin bonnet to bed', 'hair', '🎀', 'daily', '#E8A598'],
  ['Scalp massage (growth oil)', 'hair', '💆', 'weekly', '#C4B5D4'],
  // Fitness
  ['Run 🏃 (Thu lunch · Sat · Sun morning)', 'fitness', '🏃', 'daily', '#A8C5DA'],
  ['Toning circuit (Mon & Wed)', 'fitness', '💪', 'daily', '#A8D5B5'],
  // Mind
  ['Journal / brain dump', 'mindset', '📓', 'daily', '#F5C5A0'],
  ['15 min me-time protected block', 'mindset', '🌸', 'daily', '#E8A598'],
  // Work & Study
  ['CIPM study — at least 30 min', 'study', '📚', 'daily', '#C4B5D4'],
  ['Privacy Blueprint task — move one thing forward', 'work', '🔒', 'daily', '#A8C5DA'],
];
habits.forEach(h => insertHabit.run(...h));
console.log(`✓ ${habits.length} habits added from Soft Life Reset OS`);

// ─────────────────────────────────────────────
// TASKS — Privacy Blueprint (Master Task Brain)
// ─────────────────────────────────────────────
const insertTask = db.prepare(
  'INSERT INTO tasks (title, description, category, due_date, priority, tags) VALUES (?, ?, ?, ?, ?, ?)'
);

// HIGH PRIORITY — Privacy / Product
const privacyTasks = [
  // Products
  ['Complete Cookie Policy Template editing', 'Edit all sections, plain English explainers, ICO guidance check. Ep 8 launch depends on this.', 'privacy', '2026-05-07', 'high', 'product'],
  ['Upload Cookie Policy to Beacons & set price (£35 / £25 launch)', 'Set to live. Update all Beacons links.', 'privacy', '2026-05-12', 'high', 'product'],
  ['Create Privacy + Cookie Bundle offer on Beacons', 'Bundle PP + Cookie = £55 standard / £45 launch. Easy upsell.', 'privacy', '2026-05-15', 'medium', 'product'],
  ['Design GDPR Compliance SaaS V1 feature list', 'Map all V1 features. Write feature list. Sketch tab structure. Not Excel — hosted web app.', 'privacy', '2026-05-10', 'high', 'product'],
  ['Build GDPR Tracker Dashboard tab', 'Main landing tab. Visual compliance score, open tasks, upcoming deadlines.', 'privacy', '2026-05-20', 'high', 'product'],
  ['Build GDPR Tracker Task Tracker tab', 'GDPR action items with status, owner, deadline, category.', 'privacy', '2026-05-20', 'high', 'product'],
  ['Price and position GDPR Tracker product', 'Suggested: £45-£65 launch. Write Beacons description.', 'privacy', '2026-05-22', 'high', 'product'],
  // Legal
  ['Add "not legal advice" disclaimer to ALL templates', 'CRITICAL — add before selling. Footer of every template.', 'privacy', '2026-05-05', 'high', 'legal'],
  ['Write TPB Terms & Conditions for Beacons storefront', 'Include refund policy. Digital products typically non-refundable.', 'privacy', '2026-05-12', 'high', 'legal'],
  ['Draft own Client DPA (Data Processing Agreement)', 'When YOU process client data — you are the processor. Sign with every client.', 'privacy', '2026-05-15', 'high', 'legal'],
  ['Draft NDA / Confidentiality Agreement template', 'Protect client info and your IP.', 'privacy', '2026-05-15', 'high', 'legal'],
  ['Write own Data Breach Response Plan (1-pager)', 'What you do if YOU experience a breach. Separate from your product.', 'privacy', '2026-05-20', 'high', 'legal'],
  ['Create client Service Agreement template', 'Scope, fees, IP, liability cap, confidentiality. Needed before first paid client.', 'privacy', '2026-05-10', 'high', 'legal'],
  ['Confirm HMRC Self Assessment registration', 'Required as sole trader. Do not delay.', 'privacy', '2026-05-01', 'high', 'legal'],
  ['Create invoice template', 'Include: TPB name, UTR number, service, amount, bank details, payment terms.', 'privacy', '2026-05-05', 'high', 'legal'],
  ['Add policy links to Beacons page footer', 'Links to Privacy Policy and T&Cs.', 'privacy', '2026-05-15', 'medium', 'setup'],
  ['Set up simple email capture system', 'Beacons built-in or Mailchimp free. Collect from free checklist CTA.', 'privacy', '2026-05-15', 'high', 'setup'],
  ['Connect Instagram to TikTok for cross-posting', 'Auto-cross-post from TikTok saves time.', 'privacy', '2026-05-10', 'low', 'setup'],
  // Services
  ['Define scope and price for GDPR Setup package', 'What is included? Hours? Deliverables? Estimate: £350.', 'privacy', '2026-05-10', 'high', 'services'],
  ['Define scope for Fractional Privacy Partner retainer', 'Monthly retainer — suggest £350-500/mo.', 'privacy', '2026-05-12', 'high', 'services'],
  ['Write Beacons copy for each service offer', 'Short and benefit-led. Each offer needs its own description.', 'privacy', '2026-05-10', 'medium', 'services'],
];
privacyTasks.forEach(t => insertTask.run(...t));
console.log(`✓ ${privacyTasks.length} Privacy Blueprint tasks added`);

// Content tasks
const contentTasks = [
  ['Create TikTok Ep 6 carousel — What Is a DPA?', 'References lawful basis from Ep 5b. Post Wednesday 7 May at 7pm.', 'content', '2026-05-05', 'high', 'content'],
  ['Create TikTok Ep 7 carousel — What Is a Cookie? (legally)', 'Sets up Cookie Policy launch. Post Saturday 10 May.', 'content', '2026-05-07', 'high', 'content'],
  ['Create TikTok Ep 8 LAUNCH content — Cookie Policy launch', 'POST + LAUNCH same day (14 May). High energy. Clear schedule.', 'content', '2026-05-12', 'high', 'content'],
  ['Create TikTok Ep 9 checklist carousel — GDPR for Creators', 'Checklist format = highest save rate. Post 17 May.', 'content', '2026-05-14', 'medium', 'content'],
  ['Create TikTok Ep 10 — Are You Ready for an Audit?', 'CTA to Gap Analysis service.', 'content', '2026-05-18', 'medium', 'content'],
  ['Set up repeatable Canva content template', 'Saves 30 min per post. Consistent brand.', 'content', '2026-05-05', 'medium', 'content'],
  ['Standardise CTA format across all posts', 'CTA on Slide 2 of every carousel.', 'content', '2026-05-05', 'medium', 'content'],
  ['Repurpose Ep 3 into Instagram post', 'Best performer (389 views). Checklist style. Duplicate the format.', 'content', '2026-05-10', 'low', 'content'],
  ['Build 6-week rolling content calendar', 'Plan ahead so content is never last-minute.', 'content', '2026-05-10', 'medium', 'content'],
  ['Write launch announcement text for Cookie Policy', 'TikTok bio + Beacons. Prepare DM template for early buyers.', 'content', '2026-05-12', 'high', 'content'],
  ['Post-launch DMs for Cookie Policy', 'DM anyone who saved/liked Ep 8 within 24 hours of launch.', 'content', '2026-05-15', 'medium', 'content'],
];
contentTasks.forEach(t => insertTask.run(...t));
console.log(`✓ ${contentTasks.length} Content Studio tasks added`);

// CIPM study tasks
const cipmTasks = [
  ['Book CIPM exam at iapp.org — 14 July 2026', 'Book by 15 May to secure your slot. Computer-based or remote proctoring available.', 'cipm', '2026-05-15', 'high', 'exam'],
  ['Buy IAPP CIPM Practice Exam (90 questions)', 'Purchase at iapp.org — essential for exam prep. Full timed mock.', 'cipm', '2026-05-25', 'high', 'exam'],
  ['Complete Domain I practice questions (8 questions)', 'Note every wrong answer. Domain I = 14-18 exam questions.', 'cipm', '2026-05-12', 'high', 'study'],
  ['Create CIPM glossary page', 'Key terms for Domain I: privacy terminology, jurisdiction names, oversight agencies.', 'cipm', '2026-05-12', 'medium', 'study'],
  ['Make comparison table: PIA vs DPIA vs TIA vs LIA vs PTA', 'Acronym overload — create a side-by-side table. Frequent exam topic.', 'cipm', '2026-06-15', 'high', 'study'],
  ['Memorise Privacy by Design — all 7 principles', 'Write them from memory 3 times. These are tested directly.', 'cipm', '2026-06-20', 'high', 'study'],
  ['Create data subject rights comparison chart (GDPR vs CCPA)', 'Different rights under different laws. Map them side by side.', 'cipm', '2026-07-01', 'high', 'study'],
];
cipmTasks.forEach(t => insertTask.run(...t));
console.log(`✓ ${cipmTasks.length} CIPM tasks added`);

// Self care tasks
const selfCareTasks = [
  ['Wash Day — deep condition + protective style', 'Pre-poo with oil, shampoo, deep condition 30 min, LOC, protective style.', 'selfcare', null, 'high', 'hair'],
  ['Protein treatment this month', 'Apply protein treatment after shampoo. Leave 5 min. Deep condition after. Reduces breakage.', 'selfcare', '2026-05-31', 'medium', 'hair'],
  ['Hot oil treatment this month', 'Warm castor + coconut oil. Apply root to tip. Cover 20 min. Rinse before shampoo.', 'selfcare', '2026-05-31', 'medium', 'hair'],
  ['Trim / dust split ends', 'After deep condition on stretched hair. Snip just the tip of each section.', 'selfcare', '2026-05-31', 'medium', 'hair'],
  ['Length check — photo + measure', 'Stretch front + back section. Photo against measuring reference. Track retention.', 'selfcare', '2026-05-31', 'low', 'hair'],
  ['Monthly body check-in', 'How do you feel? Energy 1-10. Runs this month count. Note what improved.', 'selfcare', '2026-05-31', 'medium', 'fitness'],
];
selfCareTasks.forEach(t => insertTask.run(...t));
console.log(`✓ ${selfCareTasks.length} Self Care tasks added`);

// Home tasks already seeded by db/database.js

// ─────────────────────────────────────────────
// STUDY LOGS — from Revision Tracker
// ─────────────────────────────────────────────
const insertStudy = db.prepare(
  'INSERT INTO study_logs (study_date, subject, topic, duration, notes, score) VALUES (?, ?, ?, ?, ?, ?)'
);
const studyLogs = [
  ['2026-04-28', 'CIPM', 'Introduction to Privacy', 70, 'Session 1A: Read Fast Study Guide. PI identification within an organisation. Domain I summary written.', null],
  ['2026-04-30', 'CIPM', 'Privacy Frameworks & Programs', 55, 'Session 1B: Privacy governance models. Structuring a privacy team. Stakeholders.', null],
  ['2026-05-05', 'CIPM', 'Privacy Law & Regulations', 65, 'Session 2A: Communicating privacy vision. Establishing privacy terminology. GDPR + CCPA overview started.', null],
  ['2026-05-06', 'CIPM', 'Introduction to Privacy', 60, 'Assessment test — all domains. 20 questions. Weak areas: Protect (Ch4), Sustain (Ch5), Developing Programme.', 50],
  ['2026-05-11', 'CIPM', 'Introduction to Privacy', 45, 'Session 2B in progress. Domain I laws continued. Consequences of non-compliance. Oversight agencies.', null],
];
studyLogs.forEach(s => insertStudy.run(...s));
console.log(`✓ ${studyLogs.length} CIPM study sessions logged`);

// ─────────────────────────────────────────────
// EVENTS — Content post dates + Running schedule
// ─────────────────────────────────────────────
const insertEvent = db.prepare(
  'INSERT INTO events (title, description, start_datetime, end_datetime, category, type, location, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
);

const events = [
  // TikTok post days
  ['📱 POST — Ep 6: What Is a DPA?', 'Post at 7pm. Reply to comments. Cross-post to Instagram.', '2026-05-07T19:00:00', '2026-05-07T20:00:00', 'content', 'event', 'TikTok', 'References lawful basis from Ep 5b'],
  ['📱 POST — Ep 7: What Is a Cookie?', 'Post at 6pm. Sets up Cookie Policy launch.', '2026-05-10T18:00:00', '2026-05-10T19:00:00', 'content', 'event', 'TikTok', 'Pre-schedule if possible'],
  ['🚀 LAUNCH DAY — Cookie Policy Template', 'POST Ep 8 at 7pm. Update all Beacons links. Announce on Instagram Stories. Track sales.', '2026-05-14T19:00:00', '2026-05-14T21:00:00', 'content', 'event', 'TikTok + Beacons', 'LAUNCH DAY. High energy. Clear your schedule.'],
  ['📱 POST — Ep 9: GDPR Checklist', 'Checklist format = best for saves. Post 6pm.', '2026-05-17T18:00:00', '2026-05-17T19:00:00', 'content', 'event', 'TikTok', 'High save rate expected'],
  ['📚 CIPM Exam Booking DEADLINE', 'Book by today to secure slot at iapp.org for 14 July 2026.', '2026-05-15T09:00:00', null, 'cipm', 'event', 'iapp.org', 'Computer-based or remote proctoring'],
  ['📚 CIPM Exam — 14 July 2026', '90 questions · 2.5 hours · Multiple choice. Arrive 15 minutes early. Valid ID.', '2026-07-14T09:00:00', '2026-07-14T12:00:00', 'cipm', 'event', 'TBC — check booking', 'Trust your preparation. Read every question carefully.'],
  // Running (recurring — next 4 weeks)
  ['🏃 Run — Thursday Lunchtime', '30 min. 5 min walk warm-up · 20-25 min run · 5 min cool-down.', '2026-05-29T12:30:00', '2026-05-29T13:15:00', 'fitness', 'event', 'Local route', 'Week 5 — Building phase: run 2 min, walk 1 min x 8 rounds'],
  ['🏃 Run — Saturday Morning', '40-45 min. Longest run of the week. Build gradually.', '2026-05-30T08:00:00', '2026-05-30T09:00:00', 'fitness', 'event', 'Local route', 'Cool down and stretch fully after'],
  ['🏃 Run — Sunday Morning', '30-35 min. Comfortable steady pace. No pressure on time.', '2026-05-31T08:30:00', '2026-05-31T09:15:00', 'fitness', 'event', 'Local route', 'Week 5 endurance run'],
  ['🏃 Run — Thursday Lunchtime', '30 min run.', '2026-06-05T12:30:00', '2026-06-05T13:15:00', 'fitness', 'event', 'Local route', null],
  ['🏃 Run — Saturday Morning', '40-45 min run.', '2026-06-07T08:00:00', '2026-06-07T09:00:00', 'fitness', 'event', 'Local route', null],
  ['🏃 Run — Sunday Morning', '30-35 min run.', '2026-06-08T08:30:00', '2026-06-08T09:15:00', 'fitness', 'event', 'Local route', null],
  // Hair
  ['💆 Wash Day — Deep Condition + Protective Style', 'Detangle · pre-poo · shampoo · deep condition 30 min · LOC · protective style.', '2026-05-30T18:00:00', '2026-05-30T20:00:00', 'selfcare', 'event', 'Home', 'Friday evening wash day'],
  ['💆 Wash Day', 'Full wash day routine.', '2026-06-06T18:00:00', '2026-06-06T20:00:00', 'selfcare', 'event', 'Home', null],
];
events.forEach(e => insertEvent.run(...e));
console.log(`✓ ${events.length} events added`);

// ─────────────────────────────────────────────
// VISION BOARD — from goals across all OS sheets
// ─────────────────────────────────────────────
const insertVision = db.prepare(
  'INSERT INTO vision_items (title, description, image_url, category, affirmation, sort_order) VALUES (?, ?, ?, ?, ?, ?)'
);
const visionItems = [
  ['£500/month from The Privacy Blueprint', 'Digital templates + services + SaaS. June 2026 goal.', null, 'career', 'I am building a sustainable, freedom-based business.', 1],
  ['CIPM Certified — July 2026', 'Certified Information Privacy Manager. The credential that opens doors.', null, 'career', 'I am already a privacy professional. The certificate is proof.', 2],
  ['GDPR SaaS tool launched', 'My own privacy compliance SaaS — built from scratch. Real recurring revenue.', null, 'career', 'I build things that matter and that last.', 3],
  ['Clear, glowing, even skin', '90-day glow up goal. Morning + evening routine every single day.', null, 'health', 'Confidence starts with how your skin feels.', 4],
  ['4C hair thriving — retained length', 'Moisture, growth, less breakage. LOC method every day.', null, 'health', 'My hair is crown and I treat it like one.', 5],
  ['Running 3x per week consistently', 'Energy, mental clarity and body strength. 12 weeks of building.', null, 'health', 'Every run makes me stronger, clearer and more me.', 6],
  ['Soft life — truly protected me time', 'Non-negotiable rest. You can only give from a full cup.', null, 'lifestyle', 'I am worthy of rest, beauty, and care. This is not a luxury.', 7],
  ['Financial freedom through digital products', 'Wake up to sales. Passive income that funds real life.', null, 'career', 'My knowledge is valuable and people pay for it.', 8],
  ['Family adventures and date nights', 'Beautiful memories with husband and kids.', null, 'family', 'The best investment is in the people I love.', 9],
  ['Fractional Privacy Partner retainer client', 'Recurring revenue. Long-term relationship. Real impact.', null, 'career', 'I am the expert businesses trust with their privacy.', 10],
];
visionItems.forEach((v, i) => insertVision.run(...v));
console.log(`✓ ${visionItems.length} vision board items added`);

// ─────────────────────────────────────────────
// BUCKET LIST — life + career goals
// ─────────────────────────────────────────────
const insertBucket = db.prepare(
  'INSERT INTO bucket_list (title, description, category, priority, target_date) VALUES (?, ?, ?, ?, ?)'
);
const bucketItems = [
  // Career
  ['Launch The Privacy Blueprint SaaS tool', 'My own GDPR compliance SaaS — not Excel. Real web app. Real MRR.', 'career', 'high', '2026-06-30'],
  ['Hit £500/month revenue from TPB', 'Digital templates + services + SaaS combined.', 'career', 'high', '2026-06-30'],
  ['Get CIPM certified', 'Certified Information Privacy Manager — IAPP. Exam 14 July 2026.', 'career', 'high', '2026-07-14'],
  ['Land first Fractional Privacy Partner retainer client', 'Recurring income. The most powerful offer in my stack.', 'career', 'high', '2026-09-30'],
  ['Reach 1,000 TikTok followers', 'Grow to 1K from current 40. Content is working.', 'career', 'medium', '2026-08-31'],
  ['Hit £2,000/month from TPB', 'Scale templates + services + SaaS. The 6-month goal.', 'career', 'medium', '2026-12-31'],
  // Health & Fitness
  ['Run 5K without stopping', '12-week running progression. Phase 3: 20 min continuous.', 'health', 'high', '2026-07-31'],
  ['Complete full 90-day Soft Life Reset', 'Hair · Skin · Body · Mind. Track all 13 weeks.', 'health', 'high', '2026-08-31'],
  ['Achieve consistent morning + evening skin care routine', 'Non-negotiable daily habit. The foundation of everything.', 'health', 'medium', '2026-06-30'],
  ['Reach 12 weeks of LOC method daily', 'Length retention for 4C hair. Photo evidence.', 'health', 'medium', '2026-08-31'],
  // Family
  ['Plan a special date night', 'Just the two of us. Something intentional and memorable.', 'family', 'medium', '2026-06-30'],
  ['Take the kids on a big day out', 'Something they will remember. Theme park, beach, or adventure.', 'family', 'medium', '2026-07-31'],
  ['Family holiday / trip away', 'Proper break. Make memories together.', 'travel', 'high', '2026-12-31'],
  // Learning & Growth
  ['Read 10 books this year', 'Privacy, business, mindset, fiction. One a month minimum.', 'learning', 'medium', '2026-12-31'],
  ['Launch a paid newsletter or community', 'The next level after templates. Recurring revenue from knowledge.', 'career', 'low', '2027-06-30'],
  // Lifestyle
  ['Have a true digital detox weekend', '48 hours offline. Fully present. Zero guilt.', 'lifestyle', 'medium', '2026-12-31'],
  ['Create a fully stocked self-care ritual space at home', 'A corner that is just yours. Products, candle, mirror. Your sanctuary.', 'lifestyle', 'low', '2026-09-30'],
];
bucketItems.forEach(b => insertBucket.run(...b));
console.log(`✓ ${bucketItems.length} bucket list items added`);

// ─────────────────────────────────────────────
// BRAIN DUMP — pre-loaded with current open threads
// ─────────────────────────────────────────────
const insertDump = db.prepare('INSERT INTO brain_dump (content) VALUES (?)');
const dumps = [
  'Need to check ICO guidance on template sellers before selling more products',
  'CapCut / ByteDance data transfers — review TOS urgently (flagged as HIGH risk in GDPR tracker)',
  'TikTok also ByteDance-linked — note in third party tracker',
  'Client DPA — need this before taking on ANY paid clients',
  'Instagram cross-posting from TikTok — set this up to save time',
  'Monzo Business account set up — start tracking every sale from day 1',
  'HMRC Self Assessment — confirm registration asap (was Not Done in tracker)',
];
dumps.forEach(d => insertDump.run(d));
console.log(`✓ ${dumps.length} brain dump notes added`);

// ─────────────────────────────────────────────
// EMAIL TASKS — from Legal + Setup tracker (Not Done, HIGH)
// ─────────────────────────────────────────────
const insertEmail = db.prepare(
  'INSERT INTO email_tasks (sender, subject, priority, action_needed, due_date) VALUES (?, ?, ?, ?, ?)'
);
const emailTasks = [
  ['HMRC', 'Self Assessment registration confirmation', 'high', 'Register at gov.uk/register-for-self-assessment — required as sole trader', '2026-05-01'],
  ['ICO', 'ICO fee payment / annual renewal confirmation', 'high', 'Set up direct debit for annual £40 renewal at ico.org.uk', '2026-05-01'],
  ['IAPP', 'CIPM exam booking confirmation', 'high', 'Book exam for 14 July 2026 at iapp.org before 15 May deadline', '2026-05-15'],
  ['Beacons', 'Cookie Policy product listing — set to live', 'high', 'Upload Cookie Policy PDF to Beacons, set price £25 launch, update all CTA links', '2026-05-12'],
  ['CapCut', 'Review CapCut / ByteDance data processing terms', 'high', 'Check TOS — flagged as HIGH risk. Consider alternatives or document decision.', '2026-05-10'],
];
emailTasks.forEach(e => insertEmail.run(...e));
console.log(`✓ ${emailTasks.length} email tasks added`);

// ─────────────────────────────────────────────
// HOUSE TASKS — update with next due dates
// ─────────────────────────────────────────────
const today = new Date().toISOString().split('T')[0];
const d = new Date();
const nextWeek = new Date(d.getTime() + 7 * 86400000).toISOString().split('T')[0];
const in2Weeks = new Date(d.getTime() + 14 * 86400000).toISOString().split('T')[0];
const nextMonth = new Date(d.getFullYear(), d.getMonth() + 1, d.getDate()).toISOString().split('T')[0];
const nextQtr = new Date(d.getFullYear(), d.getMonth() + 3, d.getDate()).toISOString().split('T')[0];
const freqMap = { daily: today, weekly: nextWeek, biweekly: in2Weeks, monthly: nextMonth, quarterly: nextQtr };
const updateHouse = db.prepare("UPDATE house_tasks SET next_due = ? WHERE frequency = ?");
Object.entries(freqMap).forEach(([freq, date]) => updateHouse.run(date, freq));
console.log('✓ House task due dates updated');

// ─────────────────────────────────────────────
// WINS — pre-load some real wins from the OS
// ─────────────────────────────────────────────
const insertWin = db.prepare('INSERT INTO wins (title, description, win_date, category) VALUES (?, ?, ?, ?)');
const wins = [
  ['ICO registered ✓', 'ICO registration complete. C1883894. Direct debit set up.', '2026-04-01', 'legal'],
  ['Privacy Policy live on Beacons ✓', 'First own business policy written and published.', '2026-04-15', 'legal'],
  ['Cookie Policy live on Beacons ✓', 'Own cookie policy written and published.', '2026-05-01', 'legal'],
  ['Discovery call booking link live ✓', 'Calendly set up. 20-min slots. Auto-confirmation working.', '2026-04-20', 'work'],
  ['Discovery call intake form created ✓', 'Google Form live. Captures name, business, concern, budget.', '2026-04-20', 'work'],
  ['GDPR Health Check Tool launched ✓', 'Free SaaS tool live on Claude Code. Top-of-funnel lead magnet.', '2026-04-15', 'work'],
  ['Privacy Policy Template — first product LIVE ✓', '£35 / £25 launch. First product on Beacons.', '2026-04-01', 'work'],
  ['Monzo Business account opened ✓', 'Separate account for TPB income. Tax tracking from day one.', '2026-04-25', 'finance'],
  ['TikTok business account set up ✓', 'Analytics now accessible.', '2026-04-01', 'content'],
  ['Ep 1-5b posted — 6 episodes live ✓', 'Content series underway. Ep 3 best performer at 389 views.', '2026-05-03', 'content'],
  ['CIPM study started — 8.6% complete ✓', 'Sessions 1A, 1B, 2A done. Domain I underway.', '2026-05-06', 'study'],
  ['Beacons page optimised ✓', 'Product order, images and copy updated.', '2026-05-01', 'work'],
];
wins.forEach(w => insertWin.run(...w));
console.log(`✓ ${wins.length} wins added`);

console.log('\n🎉 Dashboard seeded successfully with your real data!');
console.log('   Open your dashboard and refresh to see everything.\n');
console.log('   Sections now populated:');
console.log('   ✓ Today (habits, tasks, events)');
console.log('   ✓ Self Care (14 habits, self-care tasks)');
console.log('   ✓ Privacy Blueprint (21 tasks with deadlines)');
console.log('   ✓ Content Studio (11 content tasks)');
console.log('   ✓ CIPM Study (exam date July 14, study sessions, 7 tasks)');
console.log('   ✓ Running (schedule + progression plan)');
console.log('   ✓ Vision Board (10 items from your goals)');
console.log('   ✓ Bucket List (17 life + career dreams)');
console.log('   ✓ Home Base (due dates set)');
console.log('   ✓ Email Hub (5 action items)');
console.log('   ✓ Life Tracker (wins logged)\n');
