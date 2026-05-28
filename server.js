require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const path = require('path');
const cron = require('node-cron');
const { RateLimiterMemory } = require('rate-limiter-flexible');

const app = express();
const PORT = process.env.PORT || 3000;

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net", "cdnjs.cloudflare.com", "fonts.googleapis.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com", "cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "fonts.gstatic.com", "cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'"],
      frameSrc: ["'self'", "https://www.notion.so"]
    }
  }
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Session configuration — cookies are HTTP-only and secure in production
app.use(session({
  secret: process.env.SESSION_SECRET || 'change-this-in-production-please',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Rate limiter for login attempts
const loginLimiter = new RateLimiterMemory({ points: 5, duration: 60 * 15 });

// Hash the password once at startup
const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD || 'changeme';
const PASSWORD_HASH = bcrypt.hashSync(DASHBOARD_PASSWORD, 10);

// Auth middleware — protects all /api and / routes
function requireAuth(req, res, next) {
  if (req.session && req.session.authenticated) return next();
  if (req.path.startsWith('/api/')) return res.status(401).json({ error: 'Unauthorized' });
  res.redirect('/login');
}

// Serve static login page (no auth required)
app.get('/login', (req, res) => {
  if (req.session && req.session.authenticated) return res.redirect('/');
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Login endpoint with rate limiting
app.post('/auth/login', async (req, res) => {
  try {
    await loginLimiter.consume(req.ip);
  } catch {
    return res.status(429).json({ error: 'Too many login attempts. Try again in 15 minutes.' });
  }

  const { password } = req.body;
  if (!password || !bcrypt.compareSync(password, PASSWORD_HASH)) {
    return res.status(401).json({ error: 'Incorrect password' });
  }

  req.session.authenticated = true;
  req.session.loginTime = new Date().toISOString();
  res.json({ success: true });
});

app.post('/auth/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// All routes below require authentication
app.use(requireAuth);

// Serve main app
app.use(express.static(path.join(__dirname, 'public'), { index: false }));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// API routes
app.use('/api', require('./routes/api'));

// Morning email cron job
if (process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_TO) {
  const emailTime = process.env.EMAIL_TIME || '07:30';
  const [hour, minute] = emailTime.split(':');
  cron.schedule(`${minute} ${hour} * * *`, async () => {
    try {
      const { sendMorningEmail } = require('./routes/email');
      await sendMorningEmail();
      console.log('Morning email sent');
    } catch (err) {
      console.error('Morning email failed:', err.message);
    }
  }, { timezone: process.env.TIMEZONE || 'America/New_York' });
}

app.listen(PORT, () => {
  console.log(`\n✨ Life Dashboard running at http://localhost:${PORT}`);
  console.log(`🔒 Protected with password authentication`);
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET === 'change-this-in-production-please') {
    console.warn('⚠️  WARNING: Set a strong SESSION_SECRET in your .env file!');
  }
});
