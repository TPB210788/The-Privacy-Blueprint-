const express = require('express');
const router = express.Router();
const db = require('../db/database');

// ==================== TODAY OVERVIEW ====================
router.get('/today', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const tasks = db.prepare(`
    SELECT * FROM tasks WHERE completed=0 AND (due_date=? OR due_date IS NULL)
    ORDER BY CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END, created_at DESC
  `).all(today);
  const events = db.prepare("SELECT * FROM events WHERE start_datetime LIKE ? ORDER BY start_datetime").all(`${today}%`);
  const habits = db.prepare('SELECT * FROM habits ORDER BY category, name').all();
  const doneToday = new Set(db.prepare('SELECT habit_id FROM habit_logs WHERE completed_date=?').all(today).map(r => r.habit_id));
  habits.forEach(h => { h.completedToday = doneToday.has(h.id); });
  const houseDue = db.prepare("SELECT * FROM house_tasks WHERE next_due <= ? AND next_due IS NOT NULL ORDER BY next_due").all(today);
  const emailPending = db.prepare('SELECT COUNT(*) as c FROM email_tasks WHERE completed=0').get().c;
  const moodToday = db.prepare('SELECT * FROM mood_logs WHERE log_date=?').get(today) || null;
  const recentWins = db.prepare('SELECT * FROM wins ORDER BY created_at DESC LIMIT 5').all();
  const brainDump = db.prepare('SELECT * FROM brain_dump WHERE processed=0 ORDER BY created_at DESC LIMIT 10').all();
  res.json({ date: today, tasks, events, habits, houseDue, emailPending, moodToday, recentWins, brainDump });
});

// ==================== TASKS ====================
router.get('/tasks', (req, res) => {
  const { category, completed } = req.query;
  let q = 'SELECT * FROM tasks WHERE 1=1';
  const p = [];
  if (category) { q += ' AND category=?'; p.push(category); }
  if (completed !== undefined) { q += ' AND completed=?'; p.push(completed === 'true' ? 1 : 0); }
  q += " ORDER BY CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END, due_date ASC NULLS LAST, created_at DESC";
  res.json(db.prepare(q).all(...p));
});

router.post('/tasks', (req, res) => {
  const { title, description, category, due_date, priority, recurring, tags } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  const r = db.prepare('INSERT INTO tasks (title,description,category,due_date,priority,recurring,tags) VALUES (?,?,?,?,?,?,?)').run(
    title.trim(), description || null, category || 'general', due_date || null, priority || 'medium', recurring || null, tags || null
  );
  res.json({ id: r.lastInsertRowid, success: true });
});

router.put('/tasks/:id', (req, res) => {
  const { title, description, category, due_date, priority, recurring, tags, completed } = req.body;
  const completedAt = completed ? new Date().toISOString() : null;
  db.prepare('UPDATE tasks SET title=?,description=?,category=?,due_date=?,priority=?,recurring=?,tags=?,completed=?,completed_at=? WHERE id=?').run(
    title, description, category, due_date, priority, recurring, tags, completed ? 1 : 0, completedAt, req.params.id
  );
  res.json({ success: true });
});

router.patch('/tasks/:id/toggle', (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id=?').get(req.params.id);
  if (!task) return res.status(404).json({ error: 'Not found' });
  const now = new Date().toISOString();
  const newDone = task.completed ? 0 : 1;
  db.prepare('UPDATE tasks SET completed=?,completed_at=? WHERE id=?').run(newDone, newDone ? now : null, req.params.id);
  if (newDone) {
    db.prepare('INSERT INTO wins (title,win_date,category) VALUES (?,?,?)').run(
      `Completed: ${task.title}`, now.split('T')[0], task.category
    );
  }
  res.json({ success: true, completed: !!newDone });
});

router.delete('/tasks/:id', (req, res) => {
  db.prepare('DELETE FROM tasks WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

// ==================== HABITS ====================
router.get('/habits', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const habits = db.prepare('SELECT * FROM habits ORDER BY category, name').all();
  const doneToday = new Set(db.prepare('SELECT habit_id FROM habit_logs WHERE completed_date=?').all(today).map(r => r.habit_id));
  habits.forEach(h => { h.completedToday = doneToday.has(h.id); });
  res.json(habits);
});

router.get('/habits/week', (req, res) => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  const habits = db.prepare('SELECT * FROM habits').all();
  const logs = db.prepare(`SELECT habit_id, completed_date FROM habit_logs WHERE completed_date >= ? AND completed_date <= ?`).all(days[0], days[6]);
  const logSet = new Set(logs.map(l => `${l.habit_id}|${l.completed_date}`));
  res.json({ habits, days, logSet: [...logSet] });
});

router.post('/habits', (req, res) => {
  const { name, category, emoji, frequency, color } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  const r = db.prepare('INSERT INTO habits (name,category,emoji,frequency,color) VALUES (?,?,?,?,?)').run(
    name.trim(), category || 'general', emoji || '✨', frequency || 'daily', color || '#E8A598'
  );
  res.json({ id: r.lastInsertRowid, success: true });
});

router.patch('/habits/:id/log', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const existing = db.prepare('SELECT id FROM habit_logs WHERE habit_id=? AND completed_date=?').get(req.params.id, today);

  if (existing) {
    db.prepare('DELETE FROM habit_logs WHERE id=?').run(existing.id);
    const h = db.prepare('SELECT * FROM habits WHERE id=?').get(req.params.id);
    const newStreak = Math.max(0, h.streak - 1);
    db.prepare('UPDATE habits SET streak=?,last_completed=? WHERE id=?').run(newStreak, newStreak > 0 ? yesterday : null, req.params.id);
    return res.json({ success: true, completed: false, streak: newStreak });
  }

  db.prepare('INSERT OR IGNORE INTO habit_logs (habit_id,completed_date) VALUES (?,?)').run(req.params.id, today);
  const h = db.prepare('SELECT * FROM habits WHERE id=?').get(req.params.id);
  const newStreak = (h.last_completed === yesterday || h.streak === 0) ? h.streak + 1 : 1;
  const longest = Math.max(h.longest_streak, newStreak);
  db.prepare('UPDATE habits SET last_completed=?,streak=?,longest_streak=? WHERE id=?').run(today, newStreak, longest, req.params.id);
  res.json({ success: true, completed: true, streak: newStreak });
});

router.delete('/habits/:id', (req, res) => {
  db.prepare('DELETE FROM habit_logs WHERE habit_id=?').run(req.params.id);
  db.prepare('DELETE FROM habits WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

// ==================== EVENTS ====================
router.get('/events', (req, res) => {
  const { type, from, to } = req.query;
  let q = 'SELECT * FROM events WHERE 1=1';
  const p = [];
  if (type) { q += ' AND type=?'; p.push(type); }
  if (from) { q += ' AND start_datetime>=?'; p.push(from); }
  if (to) { q += ' AND start_datetime<=?'; p.push(to + 'T23:59:59'); }
  q += ' ORDER BY start_datetime ASC';
  res.json(db.prepare(q).all(...p));
});

router.post('/events', (req, res) => {
  const { title, description, start_datetime, end_datetime, category, type, location, notes } = req.body;
  if (!title || !start_datetime) return res.status(400).json({ error: 'Title and start_datetime required' });
  const r = db.prepare('INSERT INTO events (title,description,start_datetime,end_datetime,category,type,location,notes) VALUES (?,?,?,?,?,?,?,?)').run(
    title.trim(), description || null, start_datetime, end_datetime || null, category || 'general', type || 'event', location || null, notes || null
  );
  res.json({ id: r.lastInsertRowid, success: true });
});

router.put('/events/:id', (req, res) => {
  const { title, description, start_datetime, end_datetime, category, type, location, notes } = req.body;
  db.prepare('UPDATE events SET title=?,description=?,start_datetime=?,end_datetime=?,category=?,type=?,location=?,notes=? WHERE id=?').run(
    title, description, start_datetime, end_datetime, category, type, location, notes, req.params.id
  );
  res.json({ success: true });
});

router.delete('/events/:id', (req, res) => {
  db.prepare('DELETE FROM events WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

// ==================== BUCKET LIST ====================
router.get('/bucket-list', (req, res) => {
  const { category, completed } = req.query;
  let q = 'SELECT * FROM bucket_list WHERE 1=1';
  const p = [];
  if (category) { q += ' AND category=?'; p.push(category); }
  if (completed !== undefined) { q += ' AND completed=?'; p.push(completed === 'true' ? 1 : 0); }
  q += " ORDER BY completed ASC, CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END, created_at DESC";
  res.json(db.prepare(q).all(...p));
});

router.post('/bucket-list', (req, res) => {
  const { title, description, category, priority, target_date, image_url, steps } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  const r = db.prepare('INSERT INTO bucket_list (title,description,category,priority,target_date,image_url,steps) VALUES (?,?,?,?,?,?,?)').run(
    title.trim(), description || null, category || 'adventure', priority || 'medium', target_date || null, image_url || null, steps ? JSON.stringify(steps) : null
  );
  res.json({ id: r.lastInsertRowid, success: true });
});

router.patch('/bucket-list/:id/toggle', (req, res) => {
  const item = db.prepare('SELECT * FROM bucket_list WHERE id=?').get(req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  const today = new Date().toISOString().split('T')[0];
  const newDone = item.completed ? 0 : 1;
  db.prepare('UPDATE bucket_list SET completed=?,completed_date=? WHERE id=?').run(newDone, newDone ? today : null, req.params.id);
  res.json({ success: true, completed: !!newDone });
});

router.put('/bucket-list/:id', (req, res) => {
  const { title, description, category, priority, target_date, image_url, steps } = req.body;
  db.prepare('UPDATE bucket_list SET title=?,description=?,category=?,priority=?,target_date=?,image_url=?,steps=? WHERE id=?').run(
    title, description, category, priority, target_date, image_url, steps ? JSON.stringify(steps) : null, req.params.id
  );
  res.json({ success: true });
});

router.delete('/bucket-list/:id', (req, res) => {
  db.prepare('DELETE FROM bucket_list WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

// ==================== VISION BOARD ====================
router.get('/vision', (req, res) => {
  res.json(db.prepare('SELECT * FROM vision_items ORDER BY sort_order ASC, created_at DESC').all());
});

router.post('/vision', (req, res) => {
  const { title, description, image_url, category, affirmation } = req.body;
  const maxOrder = db.prepare('SELECT COALESCE(MAX(sort_order),0) as m FROM vision_items').get().m;
  const r = db.prepare('INSERT INTO vision_items (title,description,image_url,category,affirmation,sort_order) VALUES (?,?,?,?,?,?)').run(
    title || null, description || null, image_url || null, category || 'general', affirmation || null, maxOrder + 1
  );
  res.json({ id: r.lastInsertRowid, success: true });
});

router.delete('/vision/:id', (req, res) => {
  db.prepare('DELETE FROM vision_items WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

// ==================== MOOD ====================
router.get('/mood', (req, res) => {
  res.json(db.prepare('SELECT * FROM mood_logs ORDER BY log_date DESC LIMIT 30').all());
});

router.post('/mood', (req, res) => {
  const { log_date, mood, energy, notes, wins } = req.body;
  const d = log_date || new Date().toISOString().split('T')[0];
  const existing = db.prepare('SELECT id FROM mood_logs WHERE log_date=?').get(d);
  if (existing) {
    db.prepare('UPDATE mood_logs SET mood=?,energy=?,notes=?,wins=? WHERE id=?').run(mood, energy, notes || null, wins || null, existing.id);
    return res.json({ id: existing.id, success: true, updated: true });
  }
  const r = db.prepare('INSERT INTO mood_logs (log_date,mood,energy,notes,wins) VALUES (?,?,?,?,?)').run(d, mood, energy, notes || null, wins || null);
  res.json({ id: r.lastInsertRowid, success: true });
});

// ==================== RUNS ====================
router.get('/runs', (req, res) => {
  res.json(db.prepare('SELECT * FROM run_logs ORDER BY run_date DESC LIMIT 60').all());
});

router.get('/runs/stats', (req, res) => {
  const now = new Date();
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - now.getDay());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const week = db.prepare('SELECT COALESCE(SUM(distance),0) as miles,COUNT(*) as runs FROM run_logs WHERE run_date>=?').get(weekStart.toISOString().split('T')[0]);
  const month = db.prepare('SELECT COALESCE(SUM(distance),0) as miles,COUNT(*) as runs FROM run_logs WHERE run_date>=?').get(monthStart.toISOString().split('T')[0]);
  const all = db.prepare('SELECT COALESCE(SUM(distance),0) as miles,COUNT(*) as runs FROM run_logs').get();
  res.json({ week, month, all, goal: db.prepare("SELECT value FROM settings WHERE key='run_goal_weekly_miles'").get()?.value || '15' });
});

router.post('/runs', (req, res) => {
  const { run_date, distance, distance_unit, duration, pace, route, notes, feeling } = req.body;
  const r = db.prepare('INSERT INTO run_logs (run_date,distance,distance_unit,duration,pace,route,notes,feeling) VALUES (?,?,?,?,?,?,?,?)').run(
    run_date || new Date().toISOString().split('T')[0], distance, distance_unit || 'miles', duration || null, pace || null, route || null, notes || null, feeling || 3
  );
  res.json({ id: r.lastInsertRowid, success: true });
});

router.delete('/runs/:id', (req, res) => {
  db.prepare('DELETE FROM run_logs WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

// ==================== STUDY ====================
router.get('/study', (req, res) => {
  res.json(db.prepare('SELECT * FROM study_logs ORDER BY study_date DESC LIMIT 60').all());
});

router.get('/study/stats', (req, res) => {
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
  const week = db.prepare('SELECT COALESCE(SUM(duration),0) as minutes,COUNT(*) as sessions FROM study_logs WHERE study_date>=?').get(weekAgo);
  const topics = db.prepare('SELECT topic,COUNT(*) as c FROM study_logs WHERE topic IS NOT NULL GROUP BY topic ORDER BY c DESC LIMIT 10').all();
  const examDate = db.prepare("SELECT value FROM settings WHERE key='cipm_exam_date'").get()?.value;
  let daysToExam = null;
  if (examDate) {
    const diff = new Date(examDate) - new Date();
    daysToExam = Math.max(0, Math.ceil(diff / 86400000));
  }
  res.json({ week, topics, examDate, daysToExam });
});

router.post('/study', (req, res) => {
  const { study_date, subject, topic, duration, notes, score } = req.body;
  const r = db.prepare('INSERT INTO study_logs (study_date,subject,topic,duration,notes,score) VALUES (?,?,?,?,?,?)').run(
    study_date || new Date().toISOString().split('T')[0], subject || 'CIPM', topic || null, duration || null, notes || null, score || null
  );
  res.json({ id: r.lastInsertRowid, success: true });
});

// ==================== HOUSE TASKS ====================
router.get('/house', (req, res) => {
  const { room } = req.query;
  let q = 'SELECT * FROM house_tasks WHERE 1=1';
  const p = [];
  if (room) { q += ' AND room=?'; p.push(room); }
  q += ' ORDER BY next_due ASC NULLS LAST, room';
  res.json(db.prepare(q).all(...p));
});

router.post('/house', (req, res) => {
  const { title, room, frequency, next_due, notes } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  const r = db.prepare('INSERT INTO house_tasks (title,room,frequency,next_due,notes) VALUES (?,?,?,?,?)').run(
    title.trim(), room || 'General', frequency || 'weekly', next_due || null, notes || null
  );
  res.json({ id: r.lastInsertRowid, success: true });
});

router.patch('/house/:id/done', (req, res) => {
  const task = db.prepare('SELECT * FROM house_tasks WHERE id=?').get(req.params.id);
  if (!task) return res.status(404).json({ error: 'Not found' });
  const freqDays = { daily: 1, weekly: 7, biweekly: 14, monthly: 30, quarterly: 90 };
  const days = freqDays[task.frequency] || 7;
  const today = new Date().toISOString().split('T')[0];
  const nextDue = new Date(Date.now() + days * 86400000).toISOString().split('T')[0];
  db.prepare('UPDATE house_tasks SET last_done=?,next_due=? WHERE id=?').run(today, nextDue, req.params.id);
  res.json({ success: true, nextDue });
});

router.delete('/house/:id', (req, res) => {
  db.prepare('DELETE FROM house_tasks WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

// ==================== EMAIL TASKS ====================
router.get('/email-tasks', (req, res) => {
  const { status } = req.query;
  let q = 'SELECT * FROM email_tasks WHERE 1=1';
  const p = [];
  if (status === 'done') { q += ' AND completed=1'; }
  else { q += ' AND completed=0'; }
  if (status && status !== 'done') { q += ' AND status=?'; p.push(status); }
  q += " ORDER BY CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END, due_date ASC NULLS LAST";
  res.json(db.prepare(q).all(...p));
});

router.post('/email-tasks', (req, res) => {
  const { sender, subject, priority, status, action_needed, due_date, notes } = req.body;
  if (!subject) return res.status(400).json({ error: 'Subject required' });
  const r = db.prepare('INSERT INTO email_tasks (sender,subject,priority,status,action_needed,due_date,notes) VALUES (?,?,?,?,?,?,?)').run(
    sender || null, subject.trim(), priority || 'medium', status || 'pending', action_needed || null, due_date || null, notes || null
  );
  res.json({ id: r.lastInsertRowid, success: true });
});

router.patch('/email-tasks/:id/done', (req, res) => {
  db.prepare("UPDATE email_tasks SET completed=1,status='done' WHERE id=?").run(req.params.id);
  res.json({ success: true });
});

router.delete('/email-tasks/:id', (req, res) => {
  db.prepare('DELETE FROM email_tasks WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

// ==================== BRAIN DUMP ====================
router.get('/brain-dump', (req, res) => {
  res.json(db.prepare('SELECT * FROM brain_dump ORDER BY created_at DESC LIMIT 50').all());
});

router.post('/brain-dump', (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Content required' });
  const r = db.prepare('INSERT INTO brain_dump (content) VALUES (?)').run(content.trim());
  res.json({ id: r.lastInsertRowid, success: true });
});

router.delete('/brain-dump/:id', (req, res) => {
  db.prepare('DELETE FROM brain_dump WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

// ==================== WINS ====================
router.get('/wins', (req, res) => {
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
  res.json(db.prepare('SELECT * FROM wins WHERE win_date>=? ORDER BY created_at DESC').all(weekAgo));
});

router.post('/wins', (req, res) => {
  const { title, description, category } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  const r = db.prepare('INSERT INTO wins (title,description,win_date,category) VALUES (?,?,?,?)').run(
    title.trim(), description || null, new Date().toISOString().split('T')[0], category || 'general'
  );
  res.json({ id: r.lastInsertRowid, success: true });
});

// ==================== TRACKER STATS ====================
router.get('/tracker', (req, res) => {
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
  const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
  const qtrAgo = new Date(Date.now() - 90 * 86400000).toISOString().split('T')[0];

  const stats = {
    tasks: {
      week: db.prepare("SELECT COUNT(*) as c FROM tasks WHERE completed=1 AND completed_at>=?").get(weekAgo).c,
      month: db.prepare("SELECT COUNT(*) as c FROM tasks WHERE completed=1 AND completed_at>=?").get(monthAgo).c,
      quarter: db.prepare("SELECT COUNT(*) as c FROM tasks WHERE completed=1 AND completed_at>=?").get(qtrAgo).c,
      pending: db.prepare("SELECT COUNT(*) as c FROM tasks WHERE completed=0").get().c
    },
    habits: {
      total: db.prepare('SELECT COUNT(*) as c FROM habits').get().c,
      logsWeek: db.prepare('SELECT COUNT(*) as c FROM habit_logs WHERE completed_date>=?').get(weekAgo).c
    },
    running: db.prepare('SELECT COALESCE(SUM(distance),0) as miles,COUNT(*) as runs FROM run_logs WHERE run_date>=?').get(weekAgo),
    study: db.prepare('SELECT COALESCE(SUM(duration),0) as minutes,COUNT(*) as sessions FROM study_logs WHERE study_date>=?').get(weekAgo),
    bucketList: {
      done: db.prepare('SELECT COUNT(*) as c FROM bucket_list WHERE completed=1').get().c,
      total: db.prepare('SELECT COUNT(*) as c FROM bucket_list').get().c
    },
    wins: db.prepare('SELECT * FROM wins WHERE win_date>=? ORDER BY created_at DESC').all(weekAgo),
    moodHistory: db.prepare('SELECT * FROM mood_logs ORDER BY log_date DESC LIMIT 14').all().reverse()
  };
  res.json(stats);
});

// ==================== SETTINGS ====================
router.get('/settings', (req, res) => {
  const rows = db.prepare('SELECT key,value FROM settings').all();
  const obj = {};
  rows.forEach(r => { obj[r.key] = r.value; });
  res.json(obj);
});

router.put('/settings', (req, res) => {
  const upsert = db.prepare('INSERT OR REPLACE INTO settings (key,value) VALUES (?,?)');
  Object.entries(req.body).forEach(([k, v]) => {
    if (typeof k === 'string' && k.length < 100) upsert.run(k, String(v));
  });
  res.json({ success: true });
});

// ==================== NOTION PROXY ====================
router.get('/notion', async (req, res) => {
  if (!process.env.NOTION_TOKEN) return res.status(400).json({ error: 'Notion not configured' });
  try {
    const { getNotionData } = require('./notion');
    const data = await getNotionData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== EMAIL TEST ====================
router.post('/email/test', async (req, res) => {
  try {
    const { sendMorningEmail } = require('./email');
    await sendMorningEmail();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
