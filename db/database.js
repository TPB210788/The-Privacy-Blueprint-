const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbDir = process.env.DB_PATH
  ? path.dirname(process.env.DB_PATH)
  : path.join(__dirname, '..', 'data');

if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const dbPath = process.env.DB_PATH || path.join(dbDir, 'dashboard.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'general',
    due_date TEXT,
    completed INTEGER DEFAULT 0,
    completed_at TEXT,
    priority TEXT DEFAULT 'medium',
    recurring TEXT,
    tags TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS habits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    emoji TEXT DEFAULT '✨',
    frequency TEXT DEFAULT 'daily',
    streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_completed TEXT,
    color TEXT DEFAULT '#E8A598',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS habit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    habit_id INTEGER REFERENCES habits(id) ON DELETE CASCADE,
    completed_date TEXT NOT NULL,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE(habit_id, completed_date)
  );

  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    start_datetime TEXT NOT NULL,
    end_datetime TEXT,
    category TEXT DEFAULT 'general',
    type TEXT DEFAULT 'event',
    location TEXT,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS bucket_list (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'adventure',
    priority TEXT DEFAULT 'medium',
    completed INTEGER DEFAULT 0,
    completed_date TEXT,
    target_date TEXT,
    image_url TEXT,
    steps TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS vision_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    image_url TEXT,
    category TEXT DEFAULT 'general',
    affirmation TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS mood_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    log_date TEXT NOT NULL UNIQUE,
    mood INTEGER NOT NULL,
    energy INTEGER NOT NULL,
    notes TEXT,
    wins TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS run_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    run_date TEXT NOT NULL,
    distance REAL,
    distance_unit TEXT DEFAULT 'miles',
    duration INTEGER,
    pace TEXT,
    route TEXT,
    notes TEXT,
    feeling INTEGER DEFAULT 3,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS study_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    study_date TEXT NOT NULL,
    subject TEXT DEFAULT 'CIPM',
    topic TEXT,
    duration INTEGER,
    notes TEXT,
    score REAL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS house_tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    room TEXT DEFAULT 'general',
    frequency TEXT DEFAULT 'weekly',
    last_done TEXT,
    next_due TEXT,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS email_tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender TEXT,
    subject TEXT NOT NULL,
    priority TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'pending',
    action_needed TEXT,
    due_date TEXT,
    notes TEXT,
    completed INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS brain_dump (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    processed INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS wins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    win_date TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');

const defaults = [
  ['user_name', process.env.USER_NAME || 'Friend'],
  ['cipm_exam_date', ''],
  ['run_goal_weekly_miles', '15'],
  ['affirmations', JSON.stringify([
    "You are capable of amazing things.",
    "Your ADHD is a superpower, not a limitation.",
    "Progress over perfection, always.",
    "You are organized chaos and that is beautiful.",
    "Today is a fresh, clean start.",
    "Small steps still move you forward.",
    "You've got this.",
    "One thing at a time, and that one thing well.",
    "Rest is not giving up — it's fueling up."
  ])]
];
defaults.forEach(([k, v]) => insertSetting.run(k, v));

// Seed starter habits if none exist
const habitCount = db.prepare('SELECT COUNT(*) as c FROM habits').get().c;
if (habitCount === 0) {
  const seedHabits = [
    ['Drink water (8 glasses)', 'self-care', '💧', '#A8C5DA'],
    ['Morning skincare', 'self-care', '🌸', '#E8A598'],
    ['Move your body', 'self-care', '🏃', '#A8D5B5'],
    ['Take vitamins/meds', 'self-care', '💊', '#C4B5D4'],
    ['Journal / brain dump', 'mindset', '📓', '#F5C5A0'],
    ['Evening wind-down', 'self-care', '🌙', '#C4B5D4'],
    ['CIPM study (30 min)', 'study', '📚', '#A8C5DA'],
    ['Review privacy tasks', 'work', '🔒', '#A8D5B5']
  ];
  const ins = db.prepare('INSERT INTO habits (name, category, emoji, color) VALUES (?, ?, ?, ?)');
  seedHabits.forEach(h => ins.run(...h));
}

// Seed starter house tasks if none exist
const houseCount = db.prepare('SELECT COUNT(*) as c FROM house_tasks').get().c;
if (houseCount === 0) {
  const seedHouse = [
    ['Vacuum living areas', 'Living Room', 'weekly'],
    ['Clean bathrooms', 'Bathroom', 'weekly'],
    ['Wipe kitchen counters', 'Kitchen', 'daily'],
    ['Mop floors', 'General', 'biweekly'],
    ['Change bed sheets', 'Bedroom', 'biweekly'],
    ['Clean fridge', 'Kitchen', 'monthly'],
    ['Dust surfaces', 'General', 'weekly'],
    ['Take out trash', 'General', 'weekly'],
    ['Deep clean oven', 'Kitchen', 'monthly'],
    ['Wash windows', 'General', 'quarterly']
  ];
  const ins = db.prepare('INSERT INTO house_tasks (title, room, frequency) VALUES (?, ?, ?)');
  seedHouse.forEach(h => ins.run(...h));
}

module.exports = db;
