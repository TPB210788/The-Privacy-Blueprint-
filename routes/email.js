const nodemailer = require('nodemailer');
const db = require('../db/database');

function createTransporter() {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
}

async function sendMorningEmail() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_TO) {
    throw new Error('Email credentials not configured in .env');
  }

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const dateFormatted = today.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const settings = {};
  db.prepare('SELECT key, value FROM settings').all().forEach(s => { settings[s.key] = s.value; });
  const userName = settings.user_name || 'Friend';
  const affirmations = JSON.parse(settings.affirmations || '["You\'ve got this!"]');
  const affirmation = affirmations[Math.floor(Math.random() * affirmations.length)];

  const tasks = db.prepare(`
    SELECT * FROM tasks WHERE completed=0 AND (due_date=? OR due_date IS NULL)
    ORDER BY CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END LIMIT 8
  `).all(todayStr);

  const events = db.prepare(
    "SELECT * FROM events WHERE start_datetime LIKE ? ORDER BY start_datetime"
  ).all(`${todayStr}%`);

  const habits = db.prepare('SELECT * FROM habits ORDER BY category').all();

  const houseDue = db.prepare(
    "SELECT * FROM house_tasks WHERE next_due <= ? AND next_due IS NOT NULL LIMIT 4"
  ).all(todayStr);

  const emailPending = db.prepare('SELECT COUNT(*) as c FROM email_tasks WHERE completed=0').get().c;

  const priorityIcon = p => p === 'high' ? '🔴' : p === 'medium' ? '🟡' : '🟢';
  const priorityColor = p => p === 'high' ? '#E87070' : p === 'medium' ? '#F5C870' : '#A8D5B5';

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Helvetica Neue',Arial,sans-serif;background:#FFF8F3;padding:16px}
  .wrap{max-width:580px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(74,68,88,.12)}
  .hdr{background:linear-gradient(135deg,#E8A598 0%,#C4B5D4 100%);padding:32px 28px;text-align:center;color:#fff}
  .hdr h1{font-size:26px;font-weight:300;letter-spacing:.5px;margin-bottom:6px}
  .hdr p{opacity:.9;font-size:15px}
  .aff{background:#FDF5F8;padding:18px 28px;text-align:center;font-style:italic;color:#9B7B8A;font-size:15px;border-bottom:1px solid #F5E8EC}
  .stats{display:flex;gap:10px;padding:20px 28px;background:#FFF8F3;border-bottom:1px solid #F5EEE8}
  .stat{flex:1;background:#fff;padding:12px 8px;border-radius:12px;text-align:center;box-shadow:0 2px 8px rgba(74,68,88,.06)}
  .stat .n{font-size:22px;font-weight:700;color:#E8A598}
  .stat .l{font-size:11px;color:#9B8099;margin-top:3px;text-transform:uppercase;letter-spacing:.5px}
  .sec{padding:18px 28px;border-bottom:1px solid #F8F0F0}
  .sec h2{font-size:14px;font-weight:700;color:#4A4458;text-transform:uppercase;letter-spacing:.8px;margin-bottom:12px;display:flex;align-items:center;gap:6px}
  .task{background:#FFF8F5;border-left:3px solid #E8A598;padding:10px 14px;margin:6px 0;border-radius:0 10px 10px 0}
  .task-title{font-weight:600;color:#4A4458;font-size:14px;margin-bottom:3px}
  .task-meta{font-size:12px;color:#9B8099}
  .event{background:#F5F0FF;padding:10px 14px;margin:6px 0;border-radius:10px;display:flex;align-items:flex-start;gap:10px}
  .event-time{font-size:12px;color:#C4B5D4;font-weight:700;white-space:nowrap;margin-top:2px}
  .event-title{font-weight:600;color:#4A4458;font-size:14px}
  .chips{display:flex;flex-wrap:wrap;gap:6px}
  .chip{background:#FDF0F5;padding:5px 12px;border-radius:20px;font-size:12px;color:#9B7B8A}
  .house-item{background:#F5FBF5;border-left:3px solid #A8D5B5;padding:8px 12px;margin:5px 0;border-radius:0 8px 8px 0;font-size:13px;color:#4A4458}
  .footer{padding:20px 28px;text-align:center;background:#FFF8F3}
  .btn{display:inline-block;background:linear-gradient(135deg,#E8A598,#C4B5D4);color:#fff;text-decoration:none;padding:12px 28px;border-radius:25px;font-size:14px;font-weight:600;margin-top:8px}
  .foot-note{color:#9B8099;font-size:12px;margin-top:12px}
</style></head>
<body>
<div class="wrap">
  <div class="hdr">
    <h1>Good morning, ${userName}! ✨</h1>
    <p>${dateFormatted}</p>
  </div>
  <div class="aff">"${affirmation}"</div>
  <div class="stats">
    <div class="stat"><div class="n">${tasks.length}</div><div class="l">Tasks</div></div>
    <div class="stat"><div class="n">${events.length}</div><div class="l">Events</div></div>
    <div class="stat"><div class="n">${emailPending}</div><div class="l">Emails</div></div>
    <div class="stat"><div class="n">${habits.length}</div><div class="l">Habits</div></div>
  </div>
  ${tasks.length > 0 ? `
  <div class="sec">
    <h2>📋 Today's Tasks</h2>
    ${tasks.map(t => `<div class="task" style="border-left-color:${priorityColor(t.priority)}">
      <div class="task-title">${priorityIcon(t.priority)} ${t.title}</div>
      ${t.description ? `<div class="task-meta">${t.description}</div>` : ''}
    </div>`).join('')}
  </div>` : ''}
  ${events.length > 0 ? `
  <div class="sec">
    <h2>📅 Today's Events</h2>
    ${events.map(e => {
      const dt = new Date(e.start_datetime);
      const time = dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      return `<div class="event">
        <div class="event-time">${time}</div>
        <div>
          <div class="event-title">${e.title}</div>
          ${e.location ? `<div style="font-size:12px;color:#9B8099">${e.location}</div>` : ''}
        </div>
      </div>`;
    }).join('')}
  </div>` : ''}
  ${habits.length > 0 ? `
  <div class="sec">
    <h2>💫 Habits to Track</h2>
    <div class="chips">${habits.map(h => `<div class="chip">${h.emoji} ${h.name}</div>`).join('')}</div>
  </div>` : ''}
  ${houseDue.length > 0 ? `
  <div class="sec">
    <h2>🏠 Home Tasks Due</h2>
    ${houseDue.map(h => `<div class="house-item">🧹 ${h.title} <span style="color:#9B8099">(${h.room})</span></div>`).join('')}
  </div>` : ''}
  <div class="footer">
    <p style="color:#9B8099;font-size:14px;margin-bottom:12px">Have a beautiful, intentional day! 🌸</p>
    <a class="btn" href="${process.env.DASHBOARD_URL || 'http://localhost:3000'}">Open My Dashboard →</a>
    <p class="foot-note">Sent by your personal Life Dashboard • Only you can see this</p>
  </div>
</div>
</body></html>`;

  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"Life Dashboard" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject: `☀️ Good morning, ${userName}! — ${dateFormatted}`,
    html
  });
}

module.exports = { sendMorningEmail };
