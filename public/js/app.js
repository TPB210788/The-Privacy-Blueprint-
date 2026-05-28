/* ============================================================
   LIFE DASHBOARD — Main App
   ============================================================ */

// ==================== STATE ====================
const state = {
  currentSection: 'today',
  moodSelected: null,
  energySelected: null,
  focusTaskId: null,
  focusTasks: [],
  focusTaskIndex: 0,
  focusTimer: null,
  focusSeconds: 25 * 60,
  focusRunning: false,
  settings: {},
  bucketFilter: 'all',
  visionFilter: 'all',
  roomFilter: 'all'
};

// ==================== API HELPERS ====================
async function api(method, path, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`/api${path}`, opts);
  if (res.status === 401) { window.location.href = '/login'; return null; }
  return res.json();
}

const GET = path => api('GET', path);
const POST = (path, body) => api('POST', path, body);
const PUT = (path, body) => api('PUT', path, body);
const PATCH = (path, body) => api('PATCH', path, body);
const DEL = path => api('DELETE', path);

// ==================== UTILITIES ====================
function toast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast ${type}`;
  t.style.display = 'block';
  setTimeout(() => { t.style.display = 'none'; t.className = 'toast hidden'; }, 3000);
}

function fmt(d) {
  if (!d) return '';
  const dt = new Date(d.includes('T') ? d : d + 'T00:00:00');
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function fmtTime(d) {
  if (!d) return '';
  const dt = new Date(d);
  return dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function fmtRelTime(d) {
  const dt = new Date(d.includes('T') ? d : d + 'T00:00:00');
  const now = new Date(); now.setHours(0,0,0,0);
  const diff = Math.round((dt - now) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  if (diff < 0) return `${Math.abs(diff)}d overdue`;
  return `In ${diff}d`;
}

function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
}

function confetti() {
  const colors = ['#E8A598','#C4B5D4','#A8C5A0','#A8C5DA','#F5C5A0'];
  for (let i = 0; i < 40; i++) {
    const c = document.createElement('div');
    c.className = 'confetti-piece';
    c.style.left = Math.random() * 100 + 'vw';
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.animationDelay = Math.random() * 0.8 + 's';
    c.style.animationDuration = (1.5 + Math.random()) + 's';
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 2500);
  }
}

function priorityIcon(p) {
  return p === 'high' ? '🔴' : p === 'medium' ? '🟡' : '🟢';
}

// ==================== NAVIGATION ====================
function navigate(section) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const sec = document.getElementById(`section-${section}`);
  if (sec) {
    sec.classList.remove('hidden');
    sec.querySelectorAll('.animate-in').forEach((el, i) => {
      el.style.animationDelay = `${i * 0.05}s`;
    });
  }

  document.querySelectorAll(`.nav-item[data-section="${section}"]`).forEach(n => n.classList.add('active'));
  state.currentSection = section;

  // Close mobile sidebar
  document.getElementById('sidebar').classList.remove('open');
  document.querySelector('.sidebar-overlay')?.classList.remove('visible');

  loadSection(section);
}

async function loadSection(section) {
  switch(section) {
    case 'today': return loadToday();
    case 'selfcare': return loadSelfCare();
    case 'privacy': return loadPrivacy();
    case 'content': return loadContent();
    case 'cipm': return loadCIPM();
    case 'running': return loadRunning();
    case 'vision': return loadVision();
    case 'bucket': return loadBucket();
    case 'notion': return loadNotion();
    case 'home': return loadHome();
    case 'email': return loadEmail();
    case 'dates': return loadDates();
    case 'family': return loadFamily();
    case 'tracker': return loadTracker();
  }
}

// ==================== TODAY ====================
async function loadToday() {
  const data = await GET('/today');
  if (!data) return;

  // Update stats
  const habitsDone = data.habits.filter(h => h.completedToday).length;
  document.getElementById('statTasks').textContent = data.tasks.length;
  document.getElementById('statEvents').textContent = data.events.length;
  document.getElementById('statHabits').textContent = `${habitsDone}/${data.habits.length}`;
  document.getElementById('statEmails').textContent = data.emailPending;

  // Mood card
  if (data.moodToday) {
    setMoodUI(data.moodToday.mood, 'moodScale');
    setMoodUI(data.moodToday.energy, 'energyScale');
    state.moodSelected = data.moodToday.mood;
    state.energySelected = data.moodToday.energy;
    if (data.moodToday.notes) document.getElementById('moodNote').value = data.moodToday.notes;
    document.getElementById('moodSaved').style.display = 'block';
    document.getElementById('moodSaved').textContent = '✨ Check-in saved for today!';
  }

  // Habits
  const habitsContainer = document.getElementById('todayHabits');
  if (data.habits.length === 0) {
    habitsContainer.innerHTML = '<p class="empty-tasks">No habits yet. <a href="#" onclick="navigate(\'selfcare\')">Add habits →</a></p>';
  } else {
    habitsContainer.innerHTML = '';
    data.habits.slice(0, 6).forEach(h => {
      habitsContainer.appendChild(makeHabitQuickItem(h));
    });
  }

  // Events
  const eventsContainer = document.getElementById('todayEvents');
  if (data.events.length === 0) {
    eventsContainer.innerHTML = '<p class="empty-tasks" style="font-size:13px;color:var(--mauve-light);font-style:italic">No events today — enjoy some free time! 🌿</p>';
  } else {
    eventsContainer.innerHTML = '';
    data.events.forEach(e => eventsContainer.appendChild(makeEventSmall(e)));
  }

  // Top priorities
  const priorities = data.tasks.filter(t => t.priority === 'high').slice(0, 3);
  const priContainer = document.getElementById('todayPriorities');
  if (priorities.length === 0) {
    priContainer.innerHTML = '<p class="empty-tasks">No high-priority tasks — you\'re clear! 🌟</p>';
  } else {
    priContainer.innerHTML = '';
    priorities.forEach(t => priContainer.appendChild(makeTaskItem(t, loadToday)));
  }

  // All tasks
  const tasksContainer = document.getElementById('todayTasks');
  const nonPriority = data.tasks.filter(t => t.priority !== 'high');
  if (nonPriority.length === 0 && priorities.length === 0) {
    tasksContainer.innerHTML = '<p class="empty-tasks">All clear for today! Time to relax or plan ahead. ✨</p>';
  } else {
    tasksContainer.innerHTML = '';
    nonPriority.forEach(t => tasksContainer.appendChild(makeTaskItem(t, loadToday)));
  }

  // Wins
  const winsContainer = document.getElementById('recentWins');
  if (data.recentWins.length === 0) {
    winsContainer.innerHTML = '<p class="empty-tasks">No wins logged yet — add your first one! 🏆</p>';
  } else {
    winsContainer.innerHTML = '';
    data.recentWins.forEach(w => winsContainer.appendChild(makeWinItem(w)));
  }

  // House tasks due
  if (data.houseDue.length > 0) {
    document.getElementById('houseDueCard').style.display = 'block';
    const houseContainer = document.getElementById('houseDueList');
    houseContainer.innerHTML = '';
    data.houseDue.forEach(h => {
      const item = el('div', 'house-item overdue');
      item.innerHTML = `<span class="house-title">🏠 ${h.title}</span>
        <span class="house-meta">${h.room}</span>
        <span class="house-due-badge">Due ${fmt(h.next_due)}</span>
        <button class="btn-soft" onclick="markHouseDone(${h.id})">Done ✓</button>`;
      houseContainer.appendChild(item);
    });
  }

  // Focus tasks state
  state.focusTasks = data.tasks.filter(t => !t.completed);
}

function setMoodUI(val, scaleId) {
  document.querySelectorAll(`#${scaleId} .emoji-btn`).forEach(b => {
    b.classList.toggle('selected', parseInt(b.dataset.val) === val);
  });
}

function makeHabitQuickItem(habit) {
  const div = el('div', `habit-quick-item ${habit.completedToday ? 'done' : ''}`);
  div.innerHTML = `
    <span class="habit-emoji">${habit.emoji}</span>
    <span class="habit-name">${habit.name}</span>
    ${habit.streak > 0 ? `<span class="habit-streak">${habit.streak >= 7 ? '🔥' : '⭐'} ${habit.streak}d</span>` : ''}
    <div class="habit-check">${habit.completedToday ? '✓' : ''}</div>
  `;
  div.onclick = () => toggleHabit(habit.id, div, habit.completedToday);
  return div;
}

function makeTaskItem(task, refreshFn) {
  const div = el('div', `task-item ${task.priority} ${task.completed ? 'done' : ''} animate-in`);
  const cat = task.category ? `<span class="task-category-chip">${task.category}</span>` : '';
  const due = task.due_date ? `<span>${fmt(task.due_date)}</span>` : '';
  div.innerHTML = `
    <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTask(${task.id}, this, ${!!task.completed})">
      ${task.completed ? '✓' : ''}
    </div>
    <div class="task-body">
      <div class="task-title-text">${task.title}</div>
      <div class="task-meta">${cat}${due}</div>
    </div>
    <div class="task-actions">
      <button class="btn-danger" onclick="deleteTask(${task.id})">×</button>
    </div>
  `;
  if (refreshFn) div._refresh = refreshFn;
  return div;
}

function makeEventSmall(event) {
  const div = el('div', 'event-small-item animate-in');
  const dt = new Date(event.start_datetime);
  const timeStr = fmtTime(event.start_datetime);
  const dayStr = fmt(event.start_datetime);
  div.innerHTML = `
    <div class="event-time-col">
      <div class="event-time-text">${timeStr}</div>
      <div class="event-day-text">${dayStr}</div>
    </div>
    <div class="event-info">
      <div class="title">${event.title}</div>
      ${event.location ? `<div class="sub">📍 ${event.location}</div>` : ''}
    </div>
    <div class="event-actions">
      <button class="btn-danger" onclick="deleteEvent(${event.id})">×</button>
    </div>
  `;
  return div;
}

function makeWinItem(win) {
  const div = el('div', 'win-item animate-in');
  div.innerHTML = `
    <span class="win-icon">🏆</span>
    <span class="win-text">${win.title}</span>
    <span class="win-date">${fmt(win.win_date)}</span>
  `;
  return div;
}

async function toggleTask(id, el, wasCompleted) {
  const data = await PATCH(`/tasks/${id}/toggle`);
  if (!data) return;
  if (data.completed) {
    confetti();
    toast('Task completed! 🎉', 'success');
  }
  el.classList.toggle('checked', data.completed);
  el.innerHTML = data.completed ? '✓' : '';
  const taskItem = el.closest('.task-item');
  taskItem.classList.toggle('done', data.completed);
  taskItem.querySelector('.task-title-text').style.textDecoration = data.completed ? 'line-through' : '';
}

async function deleteTask(id) {
  if (!confirm('Delete this task?')) return;
  await DEL(`/tasks/${id}`);
  loadSection(state.currentSection);
  toast('Task deleted', '');
}

async function deleteEvent(id) {
  if (!confirm('Delete this event?')) return;
  await DEL(`/events/${id}`);
  loadSection(state.currentSection);
}

async function toggleHabit(id, el, wasDone) {
  const data = await PATCH(`/habits/${id}/log`);
  if (!data) return;
  el.classList.toggle('done', data.completed);
  el.querySelector('.habit-check').innerHTML = data.completed ? '✓' : '';
  const streak = el.querySelector('.habit-streak');
  if (data.completed) {
    if (!streak) {
      const s = document.createElement('span');
      s.className = 'habit-streak';
      s.textContent = `${data.streak >= 7 ? '🔥' : '⭐'} ${data.streak}d`;
      el.querySelector('.habit-check').before(s);
    } else {
      streak.textContent = `${data.streak >= 7 ? '🔥' : '⭐'} ${data.streak}d`;
    }
    if (data.streak > 0 && data.streak % 7 === 0) {
      confetti();
      toast(`🔥 ${data.streak}-day streak! You're on fire!`, 'success');
    }
  }
  // Update today stats
  const stat = document.getElementById('statHabits');
  if (stat) {
    const parts = stat.textContent.split('/');
    const done = parseInt(parts[0]) + (data.completed ? 1 : -1);
    stat.textContent = `${done}/${parts[1]}`;
  }
}

// ==================== SELF CARE ====================
async function loadSelfCare() {
  const habits = await GET('/habits');
  if (!habits) return;

  const container = document.getElementById('habitTracker');
  container.innerHTML = '';
  if (habits.length === 0) {
    container.innerHTML = '<p class="empty-tasks">No habits yet — add your first one!</p>';
  } else {
    habits.forEach(h => container.appendChild(makeHabitRow(h)));
  }

  // Week grid
  const weekData = await GET('/habits/week');
  if (weekData) renderWeekGrid(weekData);

  // Self care tasks
  const tasks = await GET('/tasks?category=selfcare');
  const container2 = document.getElementById('selfcareTasks');
  container2.innerHTML = '';
  if (!tasks || tasks.filter(t => !t.completed).length === 0) {
    container2.innerHTML = '<p class="empty-tasks">No self care tasks. Add something nurturing! 💆</p>';
  } else {
    tasks.filter(t => !t.completed).forEach(t => container2.appendChild(makeTaskItem(t, () => loadSelfCare())));
  }

  loadAffirmation();
}

function makeHabitRow(habit) {
  const div = el('div', `habit-row ${habit.completedToday ? 'done' : ''}`);
  div.innerHTML = `
    <span style="font-size:24px">${habit.emoji}</span>
    <div class="habit-info">
      <div class="name">${habit.name}</div>
      <div class="meta">${habit.category} · ${habit.frequency}</div>
    </div>
    <div class="habit-streak-badge">
      ${habit.streak > 0 ? `${habit.streak >= 7 ? '🔥' : '⭐'} ${habit.streak} day${habit.streak !== 1 ? 's' : ''}` : 'No streak yet'}
    </div>
    <button class="habit-toggle-btn" onclick="toggleHabitRow(${habit.id}, this)" title="${habit.completedToday ? 'Undo' : 'Mark done'}">
      ${habit.completedToday ? '✓' : '○'}
    </button>
    <button class="btn-danger habit-del" onclick="deleteHabit(${habit.id})">×</button>
  `;
  return div;
}

async function toggleHabitRow(id, btn) {
  const row = btn.closest('.habit-row');
  const wasDone = row.classList.contains('done');
  const data = await PATCH(`/habits/${id}/log`);
  if (!data) return;
  row.classList.toggle('done', data.completed);
  btn.innerHTML = data.completed ? '✓' : '○';
  const badge = row.querySelector('.habit-streak-badge');
  if (badge) badge.textContent = data.streak > 0 ? `${data.streak >= 7 ? '🔥' : '⭐'} ${data.streak} day${data.streak !== 1 ? 's' : ''}` : 'No streak yet';
  if (data.completed && data.streak > 0 && data.streak % 7 === 0) {
    confetti();
    toast(`🔥 ${data.streak}-day streak!`, 'success');
  }
}

async function deleteHabit(id) {
  if (!confirm('Delete this habit and all its logs?')) return;
  await DEL(`/habits/${id}`);
  loadSelfCare();
  toast('Habit removed', '');
}

function renderWeekGrid(data) {
  const { habits, days, logSet } = data;
  const logSetObj = new Set(logSet);
  const today = new Date().toISOString().split('T')[0];

  const container = document.getElementById('habitWeekGrid');
  if (habits.length === 0) { container.innerHTML = '<p class="empty-tasks">Add habits to see your week grid!</p>'; return; }

  const dayLabels = days.map(d => {
    const dt = new Date(d + 'T00:00:00');
    return dt.toLocaleDateString('en-US', { weekday: 'short' }).substring(0, 2);
  });

  let html = `<table class="week-grid-table"><thead><tr><th></th>${dayLabels.map((l, i) => `<th style="${days[i]===today?'color:var(--rose)':''}">${l}</th>`).join('')}</tr></thead><tbody>`;

  habits.forEach(h => {
    html += `<tr><td class="week-habit-name">${h.emoji} ${h.name}</td>`;
    days.forEach(d => {
      const done = logSetObj.has(`${h.id}|${d}`);
      html += `<td><div class="week-dot ${done ? 'done' : ''} ${d===today ? 'today' : ''}"></div></td>`;
    });
    html += '</tr>';
  });

  html += '</tbody></table>';
  container.innerHTML = html;
}

async function loadAffirmation() {
  const settings = await GET('/settings');
  if (!settings) return;
  state.settings = settings;
  const affirmations = JSON.parse(settings.affirmations || '["You\'ve got this!"]');
  const aff = affirmations[Math.floor(Math.random() * affirmations.length)];
  const el = document.getElementById('affirmationText');
  if (el) el.textContent = `"${aff}"`;
}

// ==================== PRIVACY BLUEPRINT ====================
async function loadPrivacy() {
  const allTasks = await GET('/tasks?category=privacy');
  if (!allTasks) return;

  const active = allTasks.filter(t => !t.completed);
  const done = allTasks.filter(t => t.completed).slice(0, 5);

  const inProg = document.getElementById('privacyInProgress');
  const upcoming = document.getElementById('privacyUpcoming');
  const completed = document.getElementById('privacyCompleted');

  const high = active.filter(t => t.priority === 'high');
  const rest = active.filter(t => t.priority !== 'high');

  inProg.innerHTML = '';
  if (high.length === 0) inProg.innerHTML = '<p class="empty-tasks">No high-priority tasks right now! 🎉</p>';
  else high.forEach(t => inProg.appendChild(makeTaskItem(t, () => loadPrivacy())));

  upcoming.innerHTML = '';
  if (rest.length === 0) upcoming.innerHTML = '<p class="empty-tasks">No upcoming tasks!</p>';
  else rest.forEach(t => upcoming.appendChild(makeTaskItem(t, () => loadPrivacy())));

  completed.innerHTML = '';
  if (done.length === 0) completed.innerHTML = '<p class="empty-tasks">Completed tasks will appear here.</p>';
  else done.forEach(t => completed.appendChild(makeTaskItem(t, () => loadPrivacy())));
}

// ==================== CONTENT STUDIO ====================
async function loadContent() {
  const allTasks = await GET('/tasks?category=content');
  if (!allTasks) return;

  const ideas = allTasks.filter(t => t.tags === 'idea' || t.category === 'content-idea');
  const inProg = allTasks.filter(t => !t.completed && t.tags !== 'idea');
  const done = allTasks.filter(t => t.completed).slice(0, 5);

  const renderTo = (id, tasks, emptyMsg) => {
    const c = document.getElementById(id);
    c.innerHTML = '';
    if (tasks.length === 0) c.innerHTML = `<p class="empty-tasks">${emptyMsg}</p>`;
    else tasks.forEach(t => c.appendChild(makeTaskItem(t, () => loadContent())));
  };

  renderTo('contentIdeas', [...ideas], 'No ideas yet — brain dump some! 💡');
  renderTo('contentScheduled', inProg, 'Nothing in progress. Time to create! 📸');
  renderTo('contentPublished', done, 'Published content will appear here.');
}

// ==================== CIPM STUDY ====================
async function loadCIPM() {
  const [logs, stats, tasks] = await Promise.all([
    GET('/study'),
    GET('/study/stats'),
    GET('/tasks?category=cipm')
  ]);

  if (stats) {
    document.getElementById('studyMinsWeek').textContent = stats.week.minutes || 0;
    document.getElementById('studySessionsWeek').textContent = stats.week.sessions || 0;
    document.getElementById('studyTopicsCount').textContent = stats.topics.length;

    if (stats.daysToExam !== null) {
      document.getElementById('examCountdownNum').textContent = stats.daysToExam;
      document.getElementById('examDateDisplay').textContent = `Exam date: ${fmt(stats.examDate)}`;
    } else {
      document.getElementById('examCountdownNum').textContent = '?';
    }

    // Update domain bars based on study logs
    if (logs) {
      const topicCounts = {};
      logs.forEach(l => { if (l.topic) topicCounts[l.topic] = (topicCounts[l.topic] || 0) + 1; });
      const maxCount = Math.max(...Object.values(topicCounts), 1);
      document.querySelectorAll('.domain-item').forEach(d => {
        const topic = d.dataset.topic;
        const count = topicCounts[topic] || 0;
        const pct = Math.min(100, Math.round((count / Math.max(maxCount, 5)) * 100));
        d.querySelector('.domain-fill').style.width = pct + '%';
      });
    }
  }

  if (logs) {
    const container = document.getElementById('studyLog');
    container.innerHTML = '';
    if (logs.length === 0) {
      container.innerHTML = '<p class="empty-tasks">No study sessions logged yet. Let\'s start! 📚</p>';
    } else {
      logs.slice(0, 10).forEach(s => {
        const div = el('div', 'study-item animate-in');
        div.innerHTML = `
          <span class="study-date">${fmt(s.study_date)}</span>
          <span class="study-topic">${s.topic || 'General CIPM'}</span>
          <span class="study-dur">${s.duration ? s.duration + 'min' : ''}</span>
          ${s.score ? `<span class="task-category-chip">${s.score}%</span>` : ''}
        `;
        container.appendChild(div);
      });
    }
  }

  if (tasks) {
    const container = document.getElementById('cipmTasks');
    container.innerHTML = '';
    const active = tasks.filter(t => !t.completed);
    if (active.length === 0) container.innerHTML = '<p class="empty-tasks">No CIPM tasks. Add study goals!</p>';
    else active.forEach(t => container.appendChild(makeTaskItem(t, () => loadCIPM())));
  }
}

function setExamDate() {
  openModal('examDate');
}

// ==================== RUNNING ====================
async function loadRunning() {
  const [logs, stats] = await Promise.all([GET('/runs'), GET('/runs/stats')]);

  if (stats) {
    document.getElementById('runMilesWeek').textContent = parseFloat(stats.week.miles || 0).toFixed(1);
    document.getElementById('runGoalWeek').textContent = stats.goal;
    document.getElementById('runCountWeek').textContent = stats.week.runs;
    document.getElementById('runMilesMonth').textContent = parseFloat(stats.month.miles || 0).toFixed(1);

    const pct = Math.min(100, Math.round((stats.week.miles / (stats.goal || 15)) * 100));
    document.getElementById('runProgressFill').style.width = pct + '%';
    document.getElementById('runProgressLabel').textContent = `${pct}% of ${stats.goal} mile weekly goal`;
  }

  if (logs) {
    const container = document.getElementById('runLog');
    container.innerHTML = '';
    if (logs.length === 0) {
      container.innerHTML = '<p class="empty-tasks">No runs logged yet. Lace up! 👟</p>';
    } else {
      logs.slice(0, 15).forEach(r => {
        const feelingEmojis = ['', '😫', '😕', '😐', '😊', '🚀'];
        const div = el('div', 'run-item animate-in');
        div.innerHTML = `
          <span class="run-date">${fmt(r.run_date)}</span>
          <span class="run-dist">${parseFloat(r.distance || 0).toFixed(1)}<small style="font-size:13px;color:var(--mauve-light)"> ${r.distance_unit}</small></span>
          <div class="run-meta">
            ${r.duration ? `⏱ ${Math.floor(r.duration/60)}:${String(r.duration%60).padStart(2,'0')}` : ''}
            ${r.pace ? ` · ${r.pace}/mi` : ''}
            ${r.route ? ` · ${r.route}` : ''}
          </div>
          <span class="run-feeling">${feelingEmojis[r.feeling] || ''}</span>
          <button class="btn-danger" onclick="DEL('/runs/${r.id}').then(() => loadRunning())">×</button>
        `;
        container.appendChild(div);
      });
    }
  }
}

// ==================== VISION BOARD ====================
async function loadVision() {
  const items = await GET('/vision');
  if (!items) return;

  const container = document.getElementById('visionBoard');
  const empty = document.getElementById('visionEmpty');
  container.innerHTML = '';

  const filtered = state.visionFilter === 'all' ? items : items.filter(i => i.category === state.visionFilter);

  if (filtered.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  filtered.forEach(item => {
    const div = el('div', 'vision-item animate-in');
    const imgHtml = item.image_url
      ? `<img class="vision-img" src="${item.image_url}" alt="${item.title || ''}" onerror="this.parentNode.querySelector('.vision-img-placeholder').style.display='flex';this.style.display='none'">`
      : '';
    const placeholder = !item.image_url ? `<div class="vision-img-placeholder">🌟</div>` : `<div class="vision-img-placeholder" style="display:none">🌟</div>`;
    div.innerHTML = `
      ${imgHtml}${placeholder}
      <div class="vision-body">
        ${item.title ? `<div class="vtitle">${item.title}</div>` : ''}
        ${item.affirmation ? `<div class="vaffirm">"${item.affirmation}"</div>` : ''}
        ${item.description ? `<div class="vaffirm" style="margin-top:4px">${item.description}</div>` : ''}
        ${item.category ? `<div class="vcat">${item.category}</div>` : ''}
      </div>
      <button class="vision-del" onclick="deleteVisionItem(${item.id})">×</button>
    `;
    container.appendChild(div);
  });
}

async function deleteVisionItem(id) {
  await DEL(`/vision/${id}`);
  loadVision();
}

// ==================== BUCKET LIST ====================
async function loadBucket() {
  const items = await GET('/bucket-list');
  if (!items) return;

  const total = items.length;
  const done = items.filter(i => i.completed).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  document.getElementById('bucketTotal').textContent = total;
  document.getElementById('bucketDone').textContent = done;
  document.getElementById('bucketPercent').textContent = pct + '%';

  const container = document.getElementById('bucketList');
  container.innerHTML = '';

  let filtered = items;
  if (state.bucketFilter === 'completed') filtered = items.filter(i => i.completed);
  else if (state.bucketFilter !== 'all') filtered = items.filter(i => i.category === state.bucketFilter && !i.completed);
  else filtered = items.filter(i => !i.completed);

  if (filtered.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">✈️</div><p>No items in this category yet!</p></div>';
    return;
  }

  filtered.forEach(item => {
    const div = el('div', `bucket-item ${item.completed ? 'done' : ''} animate-in`);
    div.innerHTML = `
      <div class="btitle">${item.completed ? '✅ ' : ''}${item.title}</div>
      ${item.description ? `<div class="bdesc">${item.description}</div>` : ''}
      <div class="bucket-meta">
        <span class="bucket-cat-chip">${item.category}</span>
        ${item.completed ? `<span class="bucket-done-chip">Done ${fmt(item.completed_date)}</span>` : ''}
        ${item.target_date && !item.completed ? `<span style="font-size:11px;color:var(--mauve-light)">🎯 ${fmt(item.target_date)}</span>` : ''}
      </div>
      <div class="bucket-actions">
        <button class="bucket-toggle-btn" onclick="toggleBucket(${item.id}, this)">
          ${item.completed ? '↩ Unmark' : '✓ Mark Done'}
        </button>
        <button class="btn-danger" onclick="deleteBucket(${item.id})">×</button>
      </div>
    `;
    container.appendChild(div);
  });
}

async function toggleBucket(id, btn) {
  const data = await PATCH(`/bucket-list/${id}/toggle`);
  if (!data) return;
  if (data.completed) { confetti(); toast('Bucket list item accomplished! 🎉', 'success'); }
  loadBucket();
}

async function deleteBucket(id) {
  if (!confirm('Remove from bucket list?')) return;
  await DEL(`/bucket-list/${id}`);
  loadBucket();
}

// ==================== NOTION ====================
async function syncNotion() {
  const status = document.getElementById('notionStatus');
  status.textContent = '🔄 Syncing with Notion...';
  const data = await GET('/notion');
  if (!data) {
    status.textContent = '⚠️ Not configured — add NOTION_TOKEN and NOTION_DATABASE_ID to .env';
    return;
  }
  if (data.error) {
    status.textContent = `⚠️ Error: ${data.error}`;
    return;
  }

  status.textContent = `✓ Synced ${data.pages.length} items · Last sync: ${new Date(data.lastSync).toLocaleTimeString()}`;
  document.getElementById('notionSetupCard').style.display = 'none';

  const container = document.getElementById('notionGoals');
  container.innerHTML = '';
  if (data.pages.length === 0) {
    container.innerHTML = '<p class="empty-tasks">No items found in your Notion database.</p>';
    return;
  }

  data.pages.forEach(p => {
    const div = el('div', 'notion-item animate-in');
    div.innerHTML = `
      <div style="flex:1">
        <div class="notion-title">${p.title}</div>
        <div class="notion-meta">
          ${p.type ? p.type + ' · ' : ''}
          ${p.dueDate ? '📅 ' + fmt(p.dueDate) + ' · ' : ''}
          ${p.month ? p.month : ''}
        </div>
      </div>
      ${p.status ? `<span class="notion-status-badge">${p.status}</span>` : ''}
      <a href="${p.url}" target="_blank" class="notion-link" title="Open in Notion">↗</a>
    `;
    container.appendChild(div);
  });
}

async function loadNotion() {
  // Don't auto-sync — let user trigger it
  const notionToken = true; // We check on the backend
  document.getElementById('notionStatus').textContent = 'Click "Sync Notion" to load your goals.';
}

// ==================== HOME BASE ====================
async function loadHome() {
  const tasks = await GET('/house');
  if (!tasks) return;

  const today = new Date().toISOString().split('T')[0];
  const soon = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

  let filtered = tasks;
  if (state.roomFilter !== 'all') filtered = tasks.filter(t => t.room === state.roomFilter);

  const overdue = filtered.filter(t => t.next_due && t.next_due <= today);
  const upcoming = filtered.filter(t => t.next_due && t.next_due > today && t.next_due <= soon);
  const all = filtered;

  const renderHouse = (id, items, emptyMsg) => {
    const c = document.getElementById(id);
    c.innerHTML = '';
    if (items.length === 0) { c.innerHTML = `<p class="empty-tasks">${emptyMsg}</p>`; return; }
    items.forEach(h => c.appendChild(makeHouseItem(h, today)));
  };

  renderHouse('houseDueNow', overdue, 'Nothing overdue! 🌟');
  renderHouse('houseSoon', upcoming, 'Nothing due this week.');
  renderHouse('houseAllTasks', all, 'No home tasks. Add some!');
}

function makeHouseItem(task, today) {
  const overdue = task.next_due && task.next_due <= today;
  const div = el('div', `house-item ${overdue ? 'overdue' : ''} animate-in`);
  div.innerHTML = `
    <span class="house-title">🏠 ${task.title}</span>
    <span class="house-meta">${task.room} · ${task.frequency}</span>
    ${task.next_due ? `<span class="${overdue ? 'house-due-badge' : 'house-meta'}">${overdue ? '⚠️ ' : ''}${fmtRelTime(task.next_due)}</span>` : ''}
    <button class="btn-soft" onclick="markHouseDone(${task.id})">Done ✓</button>
    <button class="btn-danger" onclick="deleteHouse(${task.id})">×</button>
  `;
  return div;
}

async function markHouseDone(id) {
  const data = await PATCH(`/house/${id}/done`);
  if (!data) return;
  toast(`✓ Done! Next due: ${fmt(data.nextDue)}`, 'success');
  loadSection(state.currentSection);
}

async function deleteHouse(id) {
  if (!confirm('Remove this home task?')) return;
  await DEL(`/house/${id}`);
  loadSection(state.currentSection);
}

// ==================== EMAIL HUB ====================
async function loadEmail() {
  const tasks = await GET('/email-tasks');
  if (!tasks) return;

  const container = document.getElementById('emailTasks');
  container.innerHTML = '';

  if (tasks.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="empty-icon">📭</div><p>Inbox zero! Enjoy it. 🎉</p></div>';
    return;
  }

  tasks.forEach(t => {
    const priorityIcons = { high: '🔴', medium: '🟡', low: '🟢' };
    const div = el('div', `email-item ${t.priority} animate-in`);
    div.innerHTML = `
      <span class="email-priority">${priorityIcons[t.priority] || '📧'}</span>
      <div class="email-body">
        <div class="email-subject">${t.subject}</div>
        ${t.sender ? `<div class="email-sender">From: ${t.sender}</div>` : ''}
        ${t.action_needed ? `<div class="email-action">${t.action_needed}</div>` : ''}
        ${t.due_date ? `<div class="email-sender">Due: ${fmt(t.due_date)}</div>` : ''}
      </div>
      <div class="email-actions">
        <button class="btn-soft" onclick="markEmailDone(${t.id})">Done ✓</button>
        <button class="btn-danger" onclick="deleteEmailTask(${t.id})">×</button>
      </div>
    `;
    container.appendChild(div);
  });
}

async function markEmailDone(id) {
  await PATCH(`/email-tasks/${id}/done`);
  toast('Email handled! 📬', 'success');
  loadEmail();
}

async function deleteEmailTask(id) {
  await DEL(`/email-tasks/${id}`);
  loadEmail();
}

// ==================== DATE NIGHTS ====================
async function loadDates() {
  const today = new Date().toISOString().split('T')[0];
  const [upcoming, past] = await Promise.all([
    GET(`/events?type=date_night&from=${today}`),
    GET(`/events?type=date_night&to=${today}`)
  ]);

  const c1 = document.getElementById('plannedDates');
  const c2 = document.getElementById('pastDates');

  c1.innerHTML = '';
  c2.innerHTML = '';

  if (!upcoming || upcoming.length === 0) c1.innerHTML = '<p class="empty-tasks">No dates planned. Let\'s change that! 💕</p>';
  else upcoming.forEach(e => c1.appendChild(makeEventSmall(e)));

  if (!past || past.length === 0) c2.innerHTML = '<p class="empty-tasks">Past date memories will appear here 🌹</p>';
  else past.filter(e => e.start_datetime.split('T')[0] < today).slice(0, 5).forEach(e => c2.appendChild(makeEventSmall(e)));
}

// ==================== FAMILY DAYS ====================
async function loadFamily() {
  const today = new Date().toISOString().split('T')[0];
  const [upcoming, past] = await Promise.all([
    GET(`/events?type=family_day&from=${today}`),
    GET(`/events?type=family_day&to=${today}`)
  ]);

  const c1 = document.getElementById('plannedFamily');
  const c2 = document.getElementById('pastFamily');

  c1.innerHTML = '';
  c2.innerHTML = '';

  if (!upcoming || upcoming.length === 0) c1.innerHTML = '<p class="empty-tasks">No outings planned yet! 🌈</p>';
  else upcoming.forEach(e => c1.appendChild(makeEventSmall(e)));

  if (!past || past.length === 0) c2.innerHTML = '<p class="empty-tasks">Family memories will be captured here 🌟</p>';
  else past.filter(e => e.start_datetime.split('T')[0] < today).slice(0, 5).forEach(e => c2.appendChild(makeEventSmall(e)));
}

// ==================== LIFE TRACKER ====================
async function loadTracker() {
  const data = await GET('/tracker');
  if (!data) return;

  document.getElementById('trackerTasks').textContent = data.tasks.week;
  document.getElementById('trackerHabits').textContent = data.habits.logsWeek;
  document.getElementById('trackerMiles').textContent = parseFloat(data.running.miles || 0).toFixed(1);
  document.getElementById('trackerStudy').textContent = data.study.minutes;

  // Bucket ring
  const pct = data.bucketList.total > 0 ? data.bucketList.done / data.bucketList.total : 0;
  const circumference = 301.6;
  const offset = circumference - pct * circumference;
  document.getElementById('bucketRingFill').style.strokeDashoffset = offset;
  document.getElementById('bucketRingNum').textContent = Math.round(pct * 100) + '%';
  document.getElementById('trackerBucketDone').textContent = data.bucketList.done;
  document.getElementById('trackerBucketLeft').textContent = data.bucketList.total - data.bucketList.done;

  // Mood chart
  const moodContainer = document.getElementById('moodChart');
  moodContainer.innerHTML = '';
  if (data.moodHistory.length === 0) {
    moodContainer.innerHTML = '<p style="color:var(--mauve-light);font-size:13px">Start logging your mood to see the chart!</p>';
  } else {
    data.moodHistory.forEach(m => {
      const pct = (m.mood / 5) * 100;
      const colors = ['#E87070', '#F5C870', '#F5C870', '#A8D5B5', '#A8C5DA'];
      const color = colors[m.mood - 1] || '#C4B5D4';
      const bar = el('div', 'mood-bar');
      bar.style.height = pct + '%';
      bar.style.background = color;
      bar.innerHTML = `<div class="mood-bar-tooltip">${fmt(m.log_date)}: ${m.mood}/5</div>`;
      moodContainer.appendChild(bar);
    });
  }

  // Wins
  const winsContainer = document.getElementById('trackerWins');
  winsContainer.innerHTML = '';
  if (data.wins.length === 0) {
    winsContainer.innerHTML = '<p class="empty-tasks">Log your wins throughout the week! 🏆</p>';
  } else {
    data.wins.forEach(w => winsContainer.appendChild(makeWinItem(w)));
  }
}

// ==================== MOOD ====================
let moodVal = 0, energyVal = 0;

function initMoodListeners() {
  document.querySelectorAll('#moodScale .emoji-btn').forEach(btn => {
    btn.onclick = () => {
      moodVal = parseInt(btn.dataset.val);
      document.querySelectorAll('#moodScale .emoji-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    };
  });
  document.querySelectorAll('#energyScale .emoji-btn').forEach(btn => {
    btn.onclick = () => {
      energyVal = parseInt(btn.dataset.val);
      document.querySelectorAll('#energyScale .emoji-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    };
  });
}

async function saveMood() {
  if (!moodVal || !energyVal) {
    toast('Please select mood and energy levels', 'error');
    return;
  }
  const notes = document.getElementById('moodNote').value;
  await POST('/mood', { mood: moodVal, energy: energyVal, notes });
  const saved = document.getElementById('moodSaved');
  saved.textContent = '✨ Check-in saved!';
  saved.style.display = 'block';
  toast('Mood saved! 💫', 'success');
}

// ==================== MODAL SYSTEM ====================
const modalForms = {
  task: (priority, category) => `
    <div class="form-group">
      <label class="form-label">What needs to get done?</label>
      <input class="form-input" id="mTaskTitle" placeholder="Task title" required autofocus>
    </div>
    <div class="form-group">
      <label class="form-label">Description (optional)</label>
      <textarea class="form-textarea" id="mTaskDesc" placeholder="More details..." rows="2"></textarea>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Category</label>
        <select class="form-select" id="mTaskCat">
          <option value="general">General</option>
          <option value="selfcare">Self Care</option>
          <option value="privacy">Privacy Blueprint</option>
          <option value="content">Content Studio</option>
          <option value="cipm">CIPM Study</option>
          <option value="running">Running</option>
          <option value="home">Home</option>
          <option value="personal">Personal</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Priority</label>
        <select class="form-select" id="mTaskPriority">
          <option value="high" ${priority==='high'?'selected':''}>🔴 High</option>
          <option value="medium" ${!priority||priority==='medium'?'selected':''}>🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Due Date (optional)</label>
      <input class="form-input" type="date" id="mTaskDue">
    </div>
    <button class="form-submit" onclick="submitTask()">Add Task ✓</button>
  `,

  event: (type) => `
    <div class="form-group">
      <label class="form-label">Event Title</label>
      <input class="form-input" id="mEvTitle" placeholder="What's the occasion?" autofocus>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Date & Time</label>
        <input class="form-input" type="datetime-local" id="mEvStart">
      </div>
      <div class="form-group">
        <label class="form-label">End Time (optional)</label>
        <input class="form-input" type="datetime-local" id="mEvEnd">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Type</label>
        <select class="form-select" id="mEvType">
          <option value="event">General Event</option>
          <option value="date_night" ${type==='date_night'?'selected':''}>💑 Date Night</option>
          <option value="family_day" ${type==='family_day'?'selected':''}>👨‍👩‍👧‍👦 Family Day</option>
          <option value="appointment">Appointment</option>
          <option value="birthday">🎂 Birthday</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Location (optional)</label>
        <input class="form-input" id="mEvLocation" placeholder="Where?">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Notes (optional)</label>
      <textarea class="form-textarea" id="mEvNotes" placeholder="Any details..." rows="2"></textarea>
    </div>
    <button class="form-submit" onclick="submitEvent()">Add Event ✓</button>
  `,

  habit: () => `
    <div class="form-group">
      <label class="form-label">Habit Name</label>
      <input class="form-input" id="mHabitName" placeholder="e.g. Drink water, Morning walk..." autofocus>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Emoji</label>
        <input class="form-input" id="mHabitEmoji" value="✨" placeholder="Emoji" maxlength="4">
      </div>
      <div class="form-group">
        <label class="form-label">Category</label>
        <select class="form-select" id="mHabitCat">
          <option value="self-care">Self Care</option>
          <option value="health">Health</option>
          <option value="mindset">Mindset</option>
          <option value="work">Work</option>
          <option value="study">Study</option>
          <option value="fitness">Fitness</option>
          <option value="general">General</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Color</label>
      <div style="display:flex;gap:8px;flex-wrap:wrap" id="colorPicker">
        ${['#E8A598','#C4B5D4','#A8C5A0','#A8C5DA','#F5C5A0','#F5A0C4'].map(c =>
          `<div onclick="document.getElementById('mHabitColor').value='${c}';document.querySelectorAll('.color-dot').forEach(d=>d.classList.remove('selected'));this.classList.add('selected')"
               class="color-dot ${c==='#E8A598'?'selected':''}"
               style="width:28px;height:28px;border-radius:50%;background:${c};cursor:pointer;border:2px solid transparent;transition:all 0.2s"></div>`
        ).join('')}
      </div>
      <input type="hidden" id="mHabitColor" value="#E8A598">
    </div>
    <button class="form-submit" onclick="submitHabit()">Add Habit ✓</button>
  `,

  vision: () => `
    <div class="form-group">
      <label class="form-label">Image URL (optional)</label>
      <input class="form-input" id="mVisionImg" placeholder="https://... paste an image URL">
    </div>
    <div class="form-group">
      <label class="form-label">Title (optional)</label>
      <input class="form-input" id="mVisionTitle" placeholder="What does this represent?" autofocus>
    </div>
    <div class="form-group">
      <label class="form-label">Affirmation or Quote (optional)</label>
      <textarea class="form-textarea" id="mVisionAff" placeholder="Write an affirmation or inspiring quote..." rows="2"></textarea>
    </div>
    <div class="form-group">
      <label class="form-label">Category</label>
      <select class="form-select" id="mVisionCat">
        <option value="career">Career</option>
        <option value="health">Health</option>
        <option value="travel">Travel</option>
        <option value="family">Family</option>
        <option value="lifestyle">Lifestyle</option>
        <option value="mindset">Mindset</option>
        <option value="general">General</option>
      </select>
    </div>
    <button class="form-submit" onclick="submitVision()">Add to Board ✓</button>
  `,

  bucket: () => `
    <div class="form-group">
      <label class="form-label">Dream / Goal</label>
      <input class="form-input" id="mBucketTitle" placeholder="What do you want to do, see, or experience?" autofocus>
    </div>
    <div class="form-group">
      <label class="form-label">Description (optional)</label>
      <textarea class="form-textarea" id="mBucketDesc" placeholder="Tell me more about this dream..." rows="2"></textarea>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Category</label>
        <select class="form-select" id="mBucketCat">
          <option value="adventure">🗺️ Adventure</option>
          <option value="travel">✈️ Travel</option>
          <option value="family">👨‍👩‍👧‍👦 Family</option>
          <option value="learning">📚 Learning</option>
          <option value="health">💪 Health</option>
          <option value="career">💼 Career</option>
          <option value="creative">🎨 Creative</option>
          <option value="personal">✨ Personal</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Target Date (optional)</label>
        <input class="form-input" type="date" id="mBucketDate">
      </div>
    </div>
    <button class="form-submit" onclick="submitBucket()">Add Dream ✓</button>
  `,

  study: () => `
    <div class="form-group">
      <label class="form-label">Date</label>
      <input class="form-input" type="date" id="mStudyDate" value="${new Date().toISOString().split('T')[0]}">
    </div>
    <div class="form-group">
      <label class="form-label">Topic / Domain</label>
      <select class="form-select" id="mStudyTopic">
        <option value="">General CIPM</option>
        <option value="Introduction to Privacy">Introduction to Privacy</option>
        <option value="Privacy Frameworks & Programs">Privacy Frameworks & Programs</option>
        <option value="Information Risk">Information Risk</option>
        <option value="Privacy in Information Management">Privacy in Information Management</option>
        <option value="Privacy Operational Lifecycle">Privacy Operational Lifecycle</option>
        <option value="Technologies & Privacy Engineering">Technologies & Privacy Engineering</option>
        <option value="Privacy Law & Regulations">Privacy Law & Regulations</option>
        <option value="Practice Test">Practice Test</option>
      </select>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Duration (minutes)</label>
        <input class="form-input" type="number" id="mStudyDur" placeholder="e.g. 45">
      </div>
      <div class="form-group">
        <label class="form-label">Test Score % (optional)</label>
        <input class="form-input" type="number" id="mStudyScore" placeholder="e.g. 82">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Notes (optional)</label>
      <textarea class="form-textarea" id="mStudyNotes" placeholder="What did you study? Key takeaways?" rows="2"></textarea>
    </div>
    <button class="form-submit" onclick="submitStudy()">Log Session ✓</button>
  `,

  run: () => `
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Date</label>
        <input class="form-input" type="date" id="mRunDate" value="${new Date().toISOString().split('T')[0]}">
      </div>
      <div class="form-group">
        <label class="form-label">Distance</label>
        <input class="form-input" type="number" step="0.1" id="mRunDist" placeholder="e.g. 3.1">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Duration (minutes)</label>
        <input class="form-input" type="number" id="mRunDur" placeholder="e.g. 32">
      </div>
      <div class="form-group">
        <label class="form-label">Pace (optional)</label>
        <input class="form-input" id="mRunPace" placeholder="e.g. 10:15">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Route (optional)</label>
      <input class="form-input" id="mRunRoute" placeholder="Where did you run?">
    </div>
    <div class="form-group">
      <label class="form-label">How did it feel?</label>
      <div style="display:flex;gap:10px;margin-top:6px">
        ${['😫','😕','😐','😊','🚀'].map((e, i) =>
          `<button type="button" onclick="document.getElementById('mRunFeeling').value=${i+1};document.querySelectorAll('.feeling-btn').forEach(b=>b.style.opacity='0.3');this.style.opacity='1';this.style.transform='scale(1.2)'"
                  class="feeling-btn" style="font-size:24px;background:none;border:none;cursor:pointer;transition:all 0.2s">${e}</button>`
        ).join('')}
      </div>
      <input type="hidden" id="mRunFeeling" value="3">
    </div>
    <button class="form-submit" onclick="submitRun()">Log Run 👟</button>
  `,

  house: () => `
    <div class="form-group">
      <label class="form-label">Task</label>
      <input class="form-input" id="mHouseTitle" placeholder="e.g. Clean bathroom, Mop floors..." autofocus>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Room</label>
        <select class="form-select" id="mHouseRoom">
          <option value="Kitchen">Kitchen</option>
          <option value="Living Room">Living Room</option>
          <option value="Bedroom">Bedroom</option>
          <option value="Bathroom">Bathroom</option>
          <option value="General">General</option>
          <option value="Outdoor">Outdoor</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Frequency</label>
        <select class="form-select" id="mHouseFreq">
          <option value="daily">Daily</option>
          <option value="weekly" selected>Weekly</option>
          <option value="biweekly">Bi-weekly</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Next Due Date</label>
      <input class="form-input" type="date" id="mHouseDue" value="${new Date().toISOString().split('T')[0]}">
    </div>
    <button class="form-submit" onclick="submitHouse()">Add Task ✓</button>
  `,

  email: () => `
    <div class="form-group">
      <label class="form-label">Email Subject</label>
      <input class="form-input" id="mEmailSubject" placeholder="What's this email about?" autofocus>
    </div>
    <div class="form-group">
      <label class="form-label">From (optional)</label>
      <input class="form-input" id="mEmailFrom" placeholder="Sender name or email">
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Priority</label>
        <select class="form-select" id="mEmailPri">
          <option value="high">🔴 High</option>
          <option value="medium" selected>🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Due By (optional)</label>
        <input class="form-input" type="date" id="mEmailDue">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Action Needed</label>
      <textarea class="form-textarea" id="mEmailAction" placeholder="What do you need to do about this email?" rows="2"></textarea>
    </div>
    <button class="form-submit" onclick="submitEmail()">Add to Hub ✓</button>
  `,

  win: () => `
    <div class="form-group">
      <label class="form-label">What did you accomplish? 🏆</label>
      <input class="form-input" id="mWinTitle" placeholder="e.g. Finished that project, went for a run..." autofocus>
    </div>
    <div class="form-group">
      <label class="form-label">Details (optional)</label>
      <textarea class="form-textarea" id="mWinDesc" placeholder="Tell me more about this win!" rows="2"></textarea>
    </div>
    <button class="form-submit" onclick="submitWin()">Log Win 🎉</button>
  `,

  examDate: () => `
    <div class="form-group">
      <label class="form-label">CIPM Exam Date</label>
      <input class="form-input" type="date" id="mExamDate" autofocus>
    </div>
    <button class="form-submit" onclick="submitExamDate()">Save Exam Date ✓</button>
  `
};

function openModal(type, priority, category) {
  const titles = {
    task: '📋 Add Task', event: '📅 Add Event', habit: '✨ Add Habit',
    vision: '🌟 Add to Vision Board', bucket: '✈️ Add to Bucket List',
    study: '📚 Log Study Session', run: '🏃 Log Run', house: '🏠 Add Home Task',
    email: '📧 Add Email Task', win: '🏆 Log a Win', examDate: '📅 Set Exam Date'
  };

  document.getElementById('modalTitle').textContent = titles[type] || 'Add';
  document.getElementById('modalBody').innerHTML = modalForms[type] ? modalForms[type](priority, category) : '';
  document.getElementById('modalOverlay').classList.remove('hidden');

  // Pre-select category
  if (category && document.getElementById('mTaskCat')) {
    document.getElementById('mTaskCat').value = category;
  }
  if (priority && document.getElementById('mTaskPriority')) {
    document.getElementById('mTaskPriority').value = priority;
  }

  setTimeout(() => {
    const first = document.querySelector('#modal .form-input, #modal .form-select, #modal .form-textarea');
    if (first && first.type !== 'hidden') first.focus();
  }, 100);
}

function closeModal(e) {
  if (e && e.target !== document.getElementById('modalOverlay') && !e.target.classList.contains('modal-close')) return;
  document.getElementById('modalOverlay').classList.add('hidden');
}

// Submit handlers
async function submitTask() {
  const title = document.getElementById('mTaskTitle')?.value?.trim();
  if (!title) { toast('Please enter a task title', 'error'); return; }
  await POST('/tasks', {
    title,
    description: document.getElementById('mTaskDesc')?.value || null,
    category: document.getElementById('mTaskCat')?.value || 'general',
    priority: document.getElementById('mTaskPriority')?.value || 'medium',
    due_date: document.getElementById('mTaskDue')?.value || null
  });
  closeModal({ target: document.getElementById('modalOverlay') });
  toast('Task added! ✓', 'success');
  loadSection(state.currentSection);
}

async function submitEvent() {
  const title = document.getElementById('mEvTitle')?.value?.trim();
  const start = document.getElementById('mEvStart')?.value;
  if (!title || !start) { toast('Please enter a title and date', 'error'); return; }
  await POST('/events', {
    title, start_datetime: start,
    end_datetime: document.getElementById('mEvEnd')?.value || null,
    type: document.getElementById('mEvType')?.value || 'event',
    location: document.getElementById('mEvLocation')?.value || null,
    notes: document.getElementById('mEvNotes')?.value || null
  });
  closeModal({ target: document.getElementById('modalOverlay') });
  toast('Event added! 📅', 'success');
  loadSection(state.currentSection);
}

async function submitHabit() {
  const name = document.getElementById('mHabitName')?.value?.trim();
  if (!name) { toast('Please enter a habit name', 'error'); return; }
  await POST('/habits', {
    name,
    emoji: document.getElementById('mHabitEmoji')?.value || '✨',
    category: document.getElementById('mHabitCat')?.value || 'general',
    color: document.getElementById('mHabitColor')?.value || '#E8A598'
  });
  closeModal({ target: document.getElementById('modalOverlay') });
  toast('Habit added! 🌿', 'success');
  loadSelfCare();
}

async function submitVision() {
  const image_url = document.getElementById('mVisionImg')?.value?.trim();
  const title = document.getElementById('mVisionTitle')?.value?.trim();
  const affirmation = document.getElementById('mVisionAff')?.value?.trim();
  if (!image_url && !title && !affirmation) { toast('Add at least an image, title, or affirmation', 'error'); return; }
  await POST('/vision', {
    title: title || null, image_url: image_url || null,
    affirmation: affirmation || null,
    category: document.getElementById('mVisionCat')?.value || 'general'
  });
  closeModal({ target: document.getElementById('modalOverlay') });
  toast('Added to vision board! 🌟', 'success');
  loadVision();
}

async function submitBucket() {
  const title = document.getElementById('mBucketTitle')?.value?.trim();
  if (!title) { toast('Please enter a goal or dream', 'error'); return; }
  await POST('/bucket-list', {
    title,
    description: document.getElementById('mBucketDesc')?.value || null,
    category: document.getElementById('mBucketCat')?.value || 'adventure',
    target_date: document.getElementById('mBucketDate')?.value || null
  });
  closeModal({ target: document.getElementById('modalOverlay') });
  toast('Dream added! ✈️', 'success');
  loadBucket();
}

async function submitStudy() {
  const dur = document.getElementById('mStudyDur')?.value;
  await POST('/study', {
    study_date: document.getElementById('mStudyDate')?.value,
    topic: document.getElementById('mStudyTopic')?.value || null,
    duration: dur ? parseInt(dur) : null,
    score: document.getElementById('mStudyScore')?.value ? parseFloat(document.getElementById('mStudyScore').value) : null,
    notes: document.getElementById('mStudyNotes')?.value || null
  });
  closeModal({ target: document.getElementById('modalOverlay') });
  toast('Study session logged! 📚', 'success');
  loadCIPM();
}

async function submitRun() {
  const dist = document.getElementById('mRunDist')?.value;
  const dur = document.getElementById('mRunDur')?.value;
  if (!dist) { toast('Please enter distance', 'error'); return; }
  await POST('/runs', {
    run_date: document.getElementById('mRunDate')?.value,
    distance: parseFloat(dist),
    duration: dur ? parseInt(dur) * 60 : null,
    pace: document.getElementById('mRunPace')?.value || null,
    route: document.getElementById('mRunRoute')?.value || null,
    feeling: parseInt(document.getElementById('mRunFeeling')?.value) || 3
  });
  closeModal({ target: document.getElementById('modalOverlay') });
  toast('Run logged! 🏃', 'success');
  loadRunning();
}

async function submitHouse() {
  const title = document.getElementById('mHouseTitle')?.value?.trim();
  if (!title) { toast('Please enter a task', 'error'); return; }
  await POST('/house', {
    title,
    room: document.getElementById('mHouseRoom')?.value || 'General',
    frequency: document.getElementById('mHouseFreq')?.value || 'weekly',
    next_due: document.getElementById('mHouseDue')?.value || null
  });
  closeModal({ target: document.getElementById('modalOverlay') });
  toast('Home task added! 🏠', 'success');
  loadHome();
}

async function submitEmail() {
  const subject = document.getElementById('mEmailSubject')?.value?.trim();
  if (!subject) { toast('Please enter an email subject', 'error'); return; }
  await POST('/email-tasks', {
    subject,
    sender: document.getElementById('mEmailFrom')?.value || null,
    priority: document.getElementById('mEmailPri')?.value || 'medium',
    due_date: document.getElementById('mEmailDue')?.value || null,
    action_needed: document.getElementById('mEmailAction')?.value || null
  });
  closeModal({ target: document.getElementById('modalOverlay') });
  toast('Email task added! 📧', 'success');
  loadEmail();
}

async function submitWin() {
  const title = document.getElementById('mWinTitle')?.value?.trim();
  if (!title) { toast('Tell me about your win!', 'error'); return; }
  await POST('/wins', { title, description: document.getElementById('mWinDesc')?.value || null });
  confetti();
  closeModal({ target: document.getElementById('modalOverlay') });
  toast('Win logged! You rock! 🏆', 'success');
  loadSection(state.currentSection);
}

async function submitExamDate() {
  const date = document.getElementById('mExamDate')?.value;
  if (!date) { toast('Please select a date', 'error'); return; }
  await PUT('/settings', { cipm_exam_date: date });
  closeModal({ target: document.getElementById('modalOverlay') });
  toast('Exam date saved! 📚', 'success');
  loadCIPM();
}

// ==================== BRAIN DUMP ====================
function openBrainDump() {
  document.getElementById('brainDumpPanel').classList.remove('hidden');
  document.getElementById('brainDumpInput').focus();
  loadBrainDump();
}

function closeBrainDump() {
  document.getElementById('brainDumpPanel').classList.add('hidden');
}

async function saveBrainDump() {
  const content = document.getElementById('brainDumpInput').value.trim();
  if (!content) return;
  await POST('/brain-dump', { content });
  document.getElementById('brainDumpInput').value = '';
  toast('Captured! 💭', 'success');
  loadBrainDump();
}

async function loadBrainDump() {
  const items = await GET('/brain-dump');
  const container = document.getElementById('brainDumpList');
  container.innerHTML = '';
  if (!items || items.length === 0) return;
  items.slice(0, 15).forEach(item => {
    const div = el('div', 'brain-dump-entry');
    const dt = new Date(item.created_at);
    const timeStr = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' +
                    dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    div.innerHTML = `
      <div class="brain-dump-text">${item.content}</div>
      <div>
        <div class="brain-dump-time">${timeStr}</div>
        <button class="btn-danger" onclick="DEL('/brain-dump/${item.id}').then(loadBrainDump)" style="font-size:12px">×</button>
      </div>
    `;
    container.appendChild(div);
  });
}

// Brain dump keyboard shortcut
document.getElementById('brainDumpInput')?.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveBrainDump(); }
});

// ==================== FOCUS MODE ====================
async function openFocus() {
  const data = await GET('/today');
  if (!data) return;
  state.focusTasks = data.tasks.filter(t => !t.completed);
  state.focusTaskIndex = 0;

  if (state.focusTasks.length === 0) {
    toast('No pending tasks — enjoy your free time! 🌟', 'success');
    return;
  }

  showFocusTask();
  document.getElementById('focusOverlay').classList.remove('hidden');
}

function showFocusTask() {
  const task = state.focusTasks[state.focusTaskIndex];
  if (!task) return;
  document.getElementById('focusTaskTitle').textContent = task.title;
  state.focusTaskId = task.id;
  resetFocusTimer();
}

function closeFocus() {
  document.getElementById('focusOverlay').classList.add('hidden');
  clearInterval(state.focusTimer);
  state.focusRunning = false;
  state.focusSeconds = 25 * 60;
  document.getElementById('focusStartBtn').textContent = 'Start';
}

function toggleFocusTimer() {
  const btn = document.getElementById('focusStartBtn');
  if (state.focusRunning) {
    clearInterval(state.focusTimer);
    state.focusRunning = false;
    btn.textContent = 'Resume';
  } else {
    state.focusRunning = true;
    btn.textContent = 'Pause';
    state.focusTimer = setInterval(() => {
      state.focusSeconds--;
      const m = Math.floor(state.focusSeconds / 60);
      const s = state.focusSeconds % 60;
      document.getElementById('focusTime').textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
      if (state.focusSeconds <= 0) {
        clearInterval(state.focusTimer);
        state.focusRunning = false;
        btn.textContent = 'Start';
        state.focusSeconds = 25 * 60;
        document.getElementById('focusTime').textContent = '25:00';
        toast('⏰ Time\'s up! Take a 5-minute break.', 'success');
      }
    }, 1000);
  }
}

function resetFocusTimer() {
  clearInterval(state.focusTimer);
  state.focusRunning = false;
  state.focusSeconds = 25 * 60;
  document.getElementById('focusTime').textContent = '25:00';
  document.getElementById('focusStartBtn').textContent = 'Start';
}

async function markFocusTaskDone() {
  if (!state.focusTaskId) return;
  await PATCH(`/tasks/${state.focusTaskId}/toggle`);
  confetti();
  toast('Task done! 🎉', 'success');
  state.focusTasks = state.focusTasks.filter(t => t.id !== state.focusTaskId);
  nextFocusTask();
}

function nextFocusTask() {
  state.focusTaskIndex++;
  if (state.focusTaskIndex >= state.focusTasks.length) {
    toast('All tasks done! You\'re amazing! 🌟', 'success');
    closeFocus();
    return;
  }
  resetFocusTimer();
  showFocusTask();
}

// ==================== FILTER CHIPS ====================
function initFilterChips() {
  document.querySelectorAll('.vision-filter-bar .filter-chip').forEach(chip => {
    chip.onclick = () => {
      document.querySelectorAll('.vision-filter-bar .filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.visionFilter = chip.dataset.filter;
      loadVision();
    };
  });

  document.querySelectorAll('.bucket-filter-bar .filter-chip').forEach(chip => {
    chip.onclick = () => {
      document.querySelectorAll('.bucket-filter-bar .filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.bucketFilter = chip.dataset.filter;
      loadBucket();
    };
  });

  document.querySelectorAll('.room-filter-bar .filter-chip').forEach(chip => {
    chip.onclick = () => {
      document.querySelectorAll('.room-filter-bar .filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.roomFilter = chip.dataset.filter;
      loadHome();
    };
  });

  document.querySelectorAll('.tracker-tabs .tracker-tab').forEach(tab => {
    tab.onclick = () => {
      document.querySelectorAll('.tracker-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      // Could load different time range data here
      loadTracker();
    };
  });
}

// ==================== HEADER / GREETING ====================
function initHeader() {
  const now = new Date();
  const hour = now.getHours();
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
  else if (hour >= 17) greeting = 'Good evening';

  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // Load name from settings
  GET('/settings').then(settings => {
    if (!settings) return;
    const name = settings.user_name || 'Friend';
    document.getElementById('greetingText').textContent = `${greeting}, ${name}!`;
    document.getElementById('todayTitle').textContent = `${greeting}, ${name}! 🌅`;
  });

  document.getElementById('greetingDate').textContent = dateStr;
}

// ==================== SIDEBAR NAVIGATION ====================
function initNav() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.onclick = () => navigate(item.dataset.section);
  });

  // Mobile menu
  const menuBtn = document.getElementById('mobileMenuBtn');
  const sidebar = document.getElementById('sidebar');
  let overlay = document.querySelector('.sidebar-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
  }

  menuBtn?.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('visible');
  });
  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
  });

  // Brain dump buttons
  document.getElementById('openBrainDump')?.addEventListener('click', openBrainDump);
  document.getElementById('mobileBrainDump')?.addEventListener('click', openBrainDump);
  document.getElementById('openFocus')?.addEventListener('click', openFocus);

  // Logout
  document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    await fetch('/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  });
}

// ==================== KEYBOARD SHORTCUTS ====================
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal({ target: document.getElementById('modalOverlay') });
    closeBrainDump();
    closeFocus();
  }
  // Ctrl/Cmd + D = brain dump
  if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
    e.preventDefault();
    openBrainDump();
  }
});

// Click outside modal
document.getElementById('modalOverlay')?.addEventListener('click', function(e) {
  if (e.target === this) closeModal(e);
});

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initHeader();
  initMoodListeners();
  initFilterChips();
  navigate('today');
});
