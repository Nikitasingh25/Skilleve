/* =========================================
   SKILLEVE — app.js
   All features + localStorage persistence
   ========================================= */

// ─── NAVIGATION ───────────────────────────
function go(page) {
  window.location.href = page;
}

// ─── TOAST UTILITY ────────────────────────
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2800);
}

// ─── DATA STORE ───────────────────────────
const DEFAULT_SKILLS = [
  { id: 1, name: 'Web Development', category: 'tech',     desc: 'HTML, CSS, JavaScript, React and more.',    level: 'Beginner → Advanced', icon: '🌐' },
  { id: 2, name: 'Artificial Intelligence', category: 'tech', desc: 'ML, deep learning, NLP and AI fundamentals.', level: 'Intermediate',        icon: '🤖' },
  { id: 3, name: 'UI/UX Design', category: 'design',  desc: 'Figma, wireframing, user research & prototyping.', level: 'All levels',       icon: '🎨' },
  { id: 4, name: 'Cyber Security', category: 'tech',   desc: 'Ethical hacking, OWASP, network security.',  level: 'Intermediate',        icon: '🔒' },
  { id: 5, name: 'Data Science',   category: 'tech',   desc: 'Python, pandas, visualization & statistics.', level: 'Beginner',           icon: '📊' },
  { id: 6, name: 'Public Speaking', category: 'business', desc: 'Presentation skills, debate & communication.', level: 'All levels',       icon: '🎤' },
  { id: 7, name: 'Graphic Design', category: 'design',  desc: 'Adobe suite, branding, typography & layout.', level: 'Beginner',           icon: '✏️' },
  { id: 8, name: 'Music Production', category: 'creative', desc: 'DAWs, mixing, mastering & beatmaking.',   level: 'All levels',          icon: '🎵' },
];

const DEFAULT_EVENTS = [
  { id: 1, name: 'National Hackathon 2025', category: 'hackathon',   date: 'Apr 20, 2025', desc: 'Build innovative solutions in 24 hours.',   participants: 120, tag: '🏆 Prize ₹50K' },
  { id: 2, name: 'AI Workshop Series',      category: 'workshop',    date: 'Apr 28, 2025', desc: 'Hands-on sessions with ML practitioners.',   participants: 60,  tag: '🎓 Certificate' },
  { id: 3, name: 'Design Sprint Challenge', category: 'competition', date: 'May 5, 2025',  desc: 'UX challenge — solve a real-world problem.', participants: 45,  tag: '🥇 Featured' },
  { id: 4, name: 'Web Dev Bootcamp',        category: 'workshop',    date: 'May 12, 2025', desc: 'From zero to full-stack in a weekend.',       participants: 80,  tag: '🎓 Certificate' },
  { id: 5, name: 'Startup Pitch Night',     category: 'competition', date: 'May 18, 2025', desc: 'Pitch your idea to investors and mentors.',   participants: 30,  tag: '💡 Networking' },
];

const DEFAULT_PROFILES = [
  { name: 'Rahul Sharma',  skill: 'Web Development',       bio: '3rd year CSE student. Love building web apps with React.', initials: 'RS' },
  { name: 'Anita Desai',   skill: 'Artificial Intelligence', bio: 'ML enthusiast working on NLP projects. Open to collaborations.', initials: 'AD' },
  { name: 'Priya Mehta',   skill: 'UI/UX Design',           bio: 'Figma lover. Designed 10+ apps. Teaching design thinking.', initials: 'PM' },
  { name: 'Karan Bose',    skill: 'Cyber Security',         bio: 'CTF player. Bug bounty hunter. Learning ethical hacking.', initials: 'KB' },
];

function getSkills()   { return JSON.parse(localStorage.getItem('se_skills'))  || DEFAULT_SKILLS; }
function getEvents()   { return JSON.parse(localStorage.getItem('se_events'))  || DEFAULT_EVENTS; }
function getChats()    { return JSON.parse(localStorage.getItem('se_chats'))   || []; }
function getMessages(user) { return JSON.parse(localStorage.getItem('se_msgs_' + user)) || []; }

function saveChats(arr)       { localStorage.setItem('se_chats', JSON.stringify(arr)); }
function saveMessages(user, arr) { localStorage.setItem('se_msgs_' + user, JSON.stringify(arr)); }

// ─── SKILLS PAGE ──────────────────────────
let currentFilter = 'all';

function renderSkills(list) {
  const container = document.getElementById('skillList');
  if (!container) return;
  container.innerHTML = '';

  if (list.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--muted);padding:40px;grid-column:1/-1">No skills found. Try a different search.</p>';
    return;
  }

  list.forEach((s, i) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.animationDelay = (i * 0.06) + 's';
    card.innerHTML = `
      <span class="card-tag">${s.category}</span>
      <h3>${s.icon || '📚'} ${s.name}</h3>
      <p>${s.desc}</p>
      <div class="card-meta">
        <span>📶 ${s.level}</span>
      </div>
      <div class="card-actions">
        <button class="btn btn-primary btn-sm" onclick="startSwipe('${s.name}')">Learn</button>
        <button class="btn btn-ghost btn-sm" onclick="startSwipe('${s.name}')">Teach</button>
      </div>`;
    container.appendChild(card);
  });
}

function searchSkill() {
  const q = (document.getElementById('search')?.value || '').toLowerCase().trim();
  const all = getSkills();
  const filtered = all.filter(s =>
    (s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q)) &&
    (currentFilter === 'all' || s.category === currentFilter)
  );
  renderSkills(filtered);
}

function filterSkill(cat, btn) {
  currentFilter = cat;
  document.querySelectorAll('.filter-chips .chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  searchSkill();
}

function startSwipe(skill) {
  localStorage.setItem('se_skill', skill);
  go('swipe.html');
}

// ─── EVENTS PAGE ──────────────────────────
let currentEventFilter = 'all';

function renderEvents(list) {
  const container = document.getElementById('eventList');
  if (!container) return;
  container.innerHTML = '';

  if (list.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:var(--muted);padding:40px;grid-column:1/-1">No events found.</p>';
    return;
  }

  list.forEach((e, i) => {
    const registered = isRegistered(e.id);
    const card = document.createElement('div');
    card.className = 'card';
    card.style.animationDelay = (i * 0.07) + 's';
    card.innerHTML = `
      <span class="card-tag">${e.category}</span>
      <h3>${e.name}</h3>
      <p>${e.desc}</p>
      <div class="card-meta">
        <span>📅 ${e.date}</span>
        <span>👥 ${e.participants} joined</span>
        <span>${e.tag}</span>
      </div>
      <div class="card-actions">
        <button class="btn ${registered ? 'btn-danger' : 'btn-primary'} btn-sm" onclick="toggleRegister(${e.id}, this)">
          ${registered ? '✓ Registered' : 'Register'}
        </button>
        <button class="btn btn-ghost btn-sm" onclick="showToast('📋 More details coming soon!')">Details</button>
      </div>`;
    container.appendChild(card);
  });
}

function isRegistered(id) {
  const regs = JSON.parse(localStorage.getItem('se_registrations') || '[]');
  return regs.includes(id);
}

function toggleRegister(id, btn) {
  let regs = JSON.parse(localStorage.getItem('se_registrations') || '[]');
  if (regs.includes(id)) {
    regs = regs.filter(r => r !== id);
    btn.textContent = 'Register';
    btn.className = 'btn btn-primary btn-sm';
    showToast('❌ Registration cancelled');
  } else {
    regs.push(id);
    btn.textContent = '✓ Registered';
    btn.className = 'btn btn-danger btn-sm';
    showToast('🎉 Successfully registered!');
  }
  localStorage.setItem('se_registrations', JSON.stringify(regs));
}

function searchEvent() {
  const q = (document.getElementById('searchEvent')?.value || '').toLowerCase().trim();
  const all = getEvents();
  const filtered = all.filter(e =>
    (e.name.toLowerCase().includes(q) || e.desc.toLowerCase().includes(q)) &&
    (currentEventFilter === 'all' || e.category === currentEventFilter)
  );
  renderEvents(filtered);
}

function filterEvent(cat, btn) {
  currentEventFilter = cat;
  document.querySelectorAll('.filter-chips .chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  searchEvent();
}

// ─── SWIPE / PROFILES PAGE ────────────────
let swipeIndex = 0;

function loadProfile() {
  const card = document.getElementById('profileCard');
  if (!card) return;

  const profiles = DEFAULT_PROFILES;
  const p = profiles[swipeIndex];

  document.getElementById('swipeIndex').textContent = swipeIndex + 1;
  document.getElementById('swipeTotal').textContent = profiles.length;

  card.style.animation = 'none';
  void card.offsetWidth;
  card.style.animation = 'fadeUp 0.35s ease both';

  card.innerHTML = `
    <div class="profile-avatar">${p.initials}</div>
    <h2>${p.name}</h2>
    <div class="profile-skill-tag">🎯 ${p.skill}</div>
    <p class="profile-bio">${p.bio}</p>`;
}

function like() {
  const profiles = DEFAULT_PROFILES;
  const p = profiles[swipeIndex];
  const chats = getChats();
  if (!chats.find(c => c.name === p.name)) {
    chats.push({ name: p.name, initials: p.initials, preview: 'Say hi! 👋' });
    saveChats(chats);
  }
  showToast('✅ Matched with ' + p.name + '!');
  setTimeout(() => {
    localStorage.setItem('se_chatUser', p.name);
    localStorage.setItem('se_chatInitials', p.initials);
    go('chat.html');
  }, 900);
}

function skip() {
  const profiles = DEFAULT_PROFILES;
  swipeIndex = (swipeIndex + 1) % profiles.length;
  loadProfile();
}

// ─── CHAT PAGE ────────────────────────────
function initChat() {
  const userEl = document.getElementById('chatUser');
  const avatarEl = document.getElementById('chatAvatar');
  if (!userEl) return;

  const name     = localStorage.getItem('se_chatUser')     || 'User';
  const initials = localStorage.getItem('se_chatInitials') || name[0].toUpperCase();

  userEl.textContent   = name;
  avatarEl.textContent = initials;
  document.title = 'Chat — ' + name;

  // Load message history
  const msgs = getMessages(name);
  const box  = document.getElementById('chatBox');
  box.innerHTML = '';
  msgs.forEach(m => appendBubble(m.text, m.sent, m.time, false));
  box.scrollTop = box.scrollHeight;
}

function appendBubble(text, sent, time, scroll = true) {
  const box = document.getElementById('chatBox');

  // Group consecutive same-sender bubbles into one row
  const lastRow = box.lastElementChild;
  const senderClass = sent ? 'sent' : 'received';
  let row;
  if (lastRow && lastRow.classList.contains('msg-row') && lastRow.classList.contains(senderClass)) {
    row = lastRow;
    // Remove tail from previous bubble in this row
    const prev = row.querySelector('.msg-bubble:last-child');
    if (prev) prev.style.borderBottomRightRadius = sent ? '12px' : '';
    if (prev) prev.style.borderBottomLeftRadius  = sent ? '' : '12px';
  } else {
    row = document.createElement('div');
    row.className = 'msg-row ' + senderClass;
    box.appendChild(row);
  }

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.innerHTML = `${text}<div class="msg-footer"><span class="msg-time">${time}</span>${sent ? '<span class="msg-tick">✓✓</span>' : ''}</div>`;
  row.appendChild(bubble);

  if (scroll) box.scrollTop = box.scrollHeight;
}

function send() {
  const input = document.getElementById('msg');
  const text  = input.value.trim();
  if (!text) return;

  const name = localStorage.getItem('se_chatUser') || 'User';
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  appendBubble(text, true, time);
  input.value = '';

  // Persist
  const msgs = getMessages(name);
  msgs.push({ text, sent: true, time });
  saveMessages(name, msgs);

  // Simulate reply after 1–2 seconds
  setTimeout(() => {
    const replies = [
      'Sounds great! Let\'s connect 😊',
      'That works for me!',
      'Sure, I\'m available this weekend.',
      'Can we schedule a session?',
      'I\'d love to collaborate!',
      'Let me check my schedule and get back.',
    ];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    const rTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    appendBubble(reply, false, rTime);
    msgs.push({ text: reply, sent: false, time: rTime });
    saveMessages(name, msgs);
  }, 1000 + Math.random() * 800);
}

// ─── CHAT SIDEBAR (skills page) ───────────
function toggleChat() {
  const sidebar  = document.getElementById('chatList');
  const overlay  = document.getElementById('chatOverlay');
  const badge    = document.getElementById('chatBadge');
  if (!sidebar) return;

  const isOpen = sidebar.classList.toggle('active');
  overlay?.classList.toggle('active', isOpen);

  if (isOpen) renderChatList();
  if (badge) badge.style.display = 'none';
}

function renderChatList() {
  const inner = document.getElementById('chatListInner');
  if (!inner) return;

  const chats = getChats();
  inner.innerHTML = '';

  if (chats.length === 0) {
    inner.innerHTML = '<div class="empty-chats">No chats yet.<br>Match with someone to start!</div>';
    return;
  }

  chats.forEach(c => {
    const item = document.createElement('div');
    item.className = 'chat-item';
    item.innerHTML = `
      <div class="avatar">${c.initials || c.name[0]}</div>
      <div>
        <div class="chat-item-name">${c.name}</div>
        <div class="chat-item-preview">${c.preview || 'Tap to chat'}</div>
      </div>`;
    item.onclick = () => openChat(c.name, c.initials);
    inner.appendChild(item);
  });
}

function openChat(name, initials) {
  localStorage.setItem('se_chatUser',     name);
  localStorage.setItem('se_chatInitials', initials || name[0].toUpperCase());
  go('chat.html');
}

// ─── PROFILE SIDEBAR ──────────────────────
function toggleProfileSidebar() {
  const sb  = document.getElementById('profileSidebar');
  const ov  = document.getElementById('psbOverlay');
  if (!sb) return;
  const open = sb.classList.toggle('active');
  if (ov) ov.classList.toggle('active', open);
  if (open) refreshProfileSidebar();
}

function refreshProfileSidebar() {
  const name     = localStorage.getItem('se_userName')     || 'Guest User';
  const email    = localStorage.getItem('se_userEmail')    || 'guest@skilleve.app';
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
  const nameEl   = document.getElementById('psbName');
  const emailEl  = document.getElementById('psbEmail');
  const avEl     = document.getElementById('psbAvatar');
  const navAvEl  = document.querySelector('.nav-avatar');
  if (nameEl)  nameEl.textContent  = name;
  if (emailEl) emailEl.textContent = email;
  if (avEl)    avEl.textContent    = initials;
  if (navAvEl) navAvEl.textContent = initials;
}

function openSettings() {
  toggleProfileSidebar();
  const name  = prompt('Enter your name:', localStorage.getItem('se_userName') || '');
  if (name === null) return;
  const email = prompt('Enter your email:', localStorage.getItem('se_userEmail') || '');
  if (email === null) return;
  if (name.trim())  localStorage.setItem('se_userName',  name.trim());
  if (email.trim()) localStorage.setItem('se_userEmail', email.trim());
  showToast('✅ Profile updated!');
  refreshProfileSidebar();
}

function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'light';
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  localStorage.setItem('se_theme', isDark ? 'dark' : 'light');
  showToast(isDark ? '🌙 Dark mode on' : '☀️ Light mode on');
}

function logOut() {
  if (!confirm('Log out of SkillEve?')) return;
  localStorage.removeItem('se_chatUser');
  localStorage.removeItem('se_chatInitials');
  localStorage.removeItem('se_userName');
  localStorage.removeItem('se_userEmail');
  showToast('👋 Logged out!');
  setTimeout(() => go('index.html'), 900);
}

// ─── ADD EVENT MODAL ──────────────────────
function openAddEvent() {
  const m = document.getElementById('addEventModal');
  if (m) m.classList.add('active');
}
function closeAddEvent() {
  const m = document.getElementById('addEventModal');
  if (m) m.classList.remove('active');
}
function submitAddEvent() {
  const name = document.getElementById('evtName')?.value.trim();
  const date = document.getElementById('evtDate')?.value.trim();
  const cat  = document.getElementById('evtCat')?.value;
  const desc = document.getElementById('evtDesc')?.value.trim();
  const tag  = document.getElementById('evtTag')?.value.trim() || '🆕 New';

  if (!name || !date || !desc) { showToast('⚠️ Please fill all required fields'); return; }

  const events = getEvents();
  const newEvent = {
    id: Date.now(),
    name, date, category: cat, desc, tag,
    participants: 0
  };
  events.unshift(newEvent);
  localStorage.setItem('se_events', JSON.stringify(events));
  closeAddEvent();
  showToast('🎉 Event added successfully!');
  renderEvents(events);

  // Clear fields
  ['evtName','evtDate','evtDesc','evtTag'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

// ─── CHAT MENU ────────────────────────────
function toggleChatMenu() {
  const m = document.getElementById('waMenu');
  if (m) m.classList.toggle('active');
}

function clearChat() {
  const name = localStorage.getItem('se_chatUser') || 'User';
  if (!confirm('Clear all messages?')) return;
  localStorage.removeItem('se_msgs_' + name);
  const box = document.getElementById('chatBox');
  if (box) box.innerHTML = '';
  toggleChatMenu();
  showToast('🗑️ Chat cleared');
}

// Close chat menu when clicking outside
document.addEventListener('click', function(e) {
  const menu = document.getElementById('waMenu');
  const btn  = document.querySelector('.wa-more-btn');
  if (menu && !menu.contains(e.target) && e.target !== btn) {
    menu.classList.remove('active');
  }
});


function initGreeting() {
  const el = document.getElementById('greeting');
  if (!el) return;
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning ☀️' : hour < 17 ? 'Good afternoon 👋' : 'Good evening 🌙';
  el.textContent = greet;
}

// ─── SWIPE PAGE SETUP ─────────────────────
function initSwipe() {
  const skill = localStorage.getItem('se_skill');
  const el = document.getElementById('currentSkill');
  if (el && skill) el.textContent = skill;
  loadProfile();
}

// ─── INIT ON PAGE LOAD ────────────────────
(function init() {
  const page = window.location.pathname.split('/').pop() || 'index.html';

  // Apply saved theme
  const theme = localStorage.getItem('se_theme');
  if (theme) document.documentElement.setAttribute('data-theme', theme);

  // Refresh profile avatar in navbar on all pages
  refreshProfileSidebar();

  if (page === 'skills.html') {
    renderSkills(getSkills());
    const chats = getChats();
    const badge = document.getElementById('chatBadge');
    if (badge && chats.length > 0) {
      badge.textContent = chats.length;
      badge.style.display = 'flex';
    }
  }

  if (page === 'events.html') {
    renderEvents(getEvents());
  }

  if (page === 'swipe.html') {
    initSwipe();
  }

  if (page === 'chat.html') {
    initChat();
  }

  if (page === 'home.html') {
    initGreeting();
  }
})();