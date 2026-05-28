# Life Dashboard — Setup Guide

## Quick Start (Local)

```bash
# 1. Clone and install
npm install

# 2. Set up your environment
cp .env.example .env
# Edit .env with your settings (see below)

# 3. Run
npm start
# Open http://localhost:3000
# Log in with the password you set in .env
```

## Environment Variables (.env)

**Required:**
```
SESSION_SECRET=your-long-random-string-min-32-chars
DASHBOARD_PASSWORD=your-chosen-password
USER_NAME=Your Name
```

**Optional but Recommended:**
```
# Morning email summaries
EMAIL_USER=yourname@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_TO=yourname@gmail.com
EMAIL_TIME=07:30
TIMEZONE=America/New_York

# Notion sync
NOTION_TOKEN=secret_xxx
NOTION_DATABASE_ID=your-database-id

# For deployment
DASHBOARD_URL=https://your-deployed-url.com
```

## Gmail App Password Setup

1. Go to myaccount.google.com/security
2. Enable 2-Step Verification
3. Search "App Passwords" in the search bar
4. Create a new app password for "Mail"
5. Copy the 16-character password into `EMAIL_PASS`

## Notion Setup

1. Go to notion.so/my-integrations
2. Create a new integration called "Life Dashboard"
3. Copy the **Internal Integration Token** → `NOTION_TOKEN`
4. Open your Planner database in Notion in a browser
5. Copy the ID from the URL: `notion.so/workspace/**DATABASE_ID**?v=...` → `NOTION_DATABASE_ID`
6. In Notion, click the `...` menu on your database → Connections → Add your integration

## Deploy to Render.com (Free)

1. Push this code to GitHub
2. Go to render.com → New → Web Service
3. Connect your GitHub repo
4. Settings:
   - Build: `npm install`
   - Start: `npm start`
   - Environment: Node
5. Add all your env variables in the Render dashboard
6. Add a **Disk** (persistent storage) and set `DB_PATH=/data/dashboard.db`
7. Deploy!

## Deploy to Railway

1. Push to GitHub
2. Go to railway.app → New Project → Deploy from GitHub
3. Add env variables
4. For SQLite persistence, add a Volume mounted at `/data` and set `DB_PATH=/data/dashboard.db`

## Security Notes

- Your dashboard is password-protected — only accessible with your password
- All API routes require authentication (session-based, HTTP-only cookies)
- Login attempts are rate-limited (5 tries per 15 minutes)
- SESSION_SECRET should be a long random string — generate one:
  ```
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
- Use HTTPS in production (Render and Railway provide this automatically)
- Your data is stored locally in SQLite — not sent anywhere

## Keyboard Shortcuts

- `Ctrl+D` / `Cmd+D` — Open Brain Dump
- `Escape` — Close any modal or panel
