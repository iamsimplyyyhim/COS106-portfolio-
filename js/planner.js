/* ============================================
   PLANNER.JS — Academic Task Manager
   COS 106 | Isaiah Jr. | MIVA Open University
   ============================================ */

var tasks = [];
var currentFilter = 'all';
var STORAGE_KEY = 'cos106_tasks';

/* ---- LOAD / SAVE ---- */
function loadTasks() {
  var stored = localStorage.getItem(STORAGE_KEY);
  tasks = stored ? JSON.parse(stored) : getDefaultTasks();
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function getDefaultTasks() {
  return [
    { id: uid(), text: 'Complete COS 106 Portfolio Project', category: 'assignment', priority: 'high', completed: false, date: '2025-06-30' },
    { id: uid(), text: 'Review HTML semantic elements lecture notes', category: 'study', priority: 'medium', completed: true, date: '2025-06-20' },
    { id: uid(), text: 'Watch CSS Grid tutorial videos', category: 'study', priority: 'medium', completed: false, date: '2025-06-22' },
    { id: uid(), text: 'Submit JavaScript assignment via LMS', category: 'assignment', priority: 'high', completed: false, date: '2025-06-28' },
  ];
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

/* ---- RENDER ---- */
function getFilteredTasks() {
  var filtered = tasks.slice();
  if (currentFilter === 'active') {
    filtered = filtered.filter(function (t) { return !t.completed; });
  } else if (currentFilter === 'completed') {
    filtered = filtered.filter(function (t) { return t.completed; });
  }
  return filtered;
}

function getCategoryLabel(cat) {
  var labels = { assignment: 'Assignment', study: 'Study', exam: 'Exam', project: 'Project', other: 'Other' };
  return labels[cat] || cat;
}

function getCategoryClass(cat) {
  var map = { assignment: 'tag-red', study: 'tag-blue', exam: 'tag-gold', project: 'tag-green', other: 'tag-blue' };
  return map[cat] || 'tag-blue';
}

function getPriorityClass(p) {
  var map = { high: 'tag-red', medium: 'tag-gold', low: 'tag-green' };
  return map[p] || 'tag-blue';
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  var d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' });
}

function renderTasks() {
  var list = document.getElementById('taskList');
  var filtered = getFilteredTasks();

  if (filtered.length === 0) {
    var msgs = {
      all: { icon: '📋', title: 'No tasks yet', desc: 'Add your first task above to get started.' },
      active: { icon: '✅', title: 'Nothing pending', desc: 'You\'re all caught up! Great work.' },
      completed: { icon: '🎯', title: 'No completed tasks', desc: 'Complete a task to see it here.' }
    };
    var m = msgs[currentFilter];
    list.innerHTML = '<div class="empty-state"><div class="empty-icon">' + m.icon + '</div><h3>' + m.title + '</h3><p>' + m.desc + '</p></div>';
    return;
  }

  list.innerHTML = filtered.map(function (task) {
    return '<div class="task-item' + (task.completed ? ' completed' : '') + '" data-id="' + task.id + '">' +
      '<div class="task-checkbox" onclick="toggleTask(\'' + task.id + '\')">' + (task.completed ? '✓' : '') + '</div>' +
      '<div class="task-content">' +
        '<div class="task-text">' + escapeHtml(task.text) + '</div>' +
        '<div class="task-meta">' +
          '<span class="tag ' + getCategoryClass(task.category) + '">' + getCategoryLabel(task.category) + '</span>' +
          '<span class="tag ' + getPriorityClass(task.priority) + '">' + task.priority.charAt(0).toUpperCase() + task.priority.slice(1) + ' Priority</span>' +
          (task.date ? '<span class="text-muted" style="font-size:0.78rem">📅 ' + formatDate(task.date) + '</span>' : '') +
        '</div>' +
      '</div>' +
      '<div class="task-actions">' +
        '<button class="task-btn delete" onclick="deleteTask(\'' + task.id + '\')" title="Delete task">✕</button>' +
      '</div>' +
    '</div>';
  }).join('');
}

function renderStats() {
  var total = tasks.length;
  var done  = tasks.filter(function (t) { return t.completed; }).length;
  var pct   = total ? Math.round((done / total) * 100) : 0;

  var totalEl = document.getElementById('statTotal');
  var doneEl  = document.getElementById('statDone');
  var pendEl  = document.getElementById('statPending');
  var fillEl  = document.getElementById('progressFill');
  var pctEl   = document.getElementById('progressPct');

  if (totalEl) totalEl.textContent = total;
  if (doneEl)  doneEl.textContent  = done;
  if (pendEl)  pendEl.textContent  = total - done;
  if (fillEl)  fillEl.style.width  = pct + '%';
  if (pctEl)   pctEl.textContent   = pct + '%';
}

function render() {
  renderTasks();
  renderStats();
}

/* ---- ACTIONS ---- */
function addTask(event) {
  event.preventDefault();
  var textInput = document.getElementById('taskInput');
  var categoryInput = document.getElementById('taskCategory');
  var priorityInput = document.getElementById('taskPriority');
  var dateInput = document.getElementById('taskDate');
  var errorEl = document.getElementById('taskError');

  var text = textInput.value.trim();
  if (!text) {
    if (errorEl) { errorEl.textContent = 'Please enter a task description.'; errorEl.style.display = 'block'; }
    textInput.focus();
    return;
  }
  if (errorEl) errorEl.style.display = 'none';

  var task = {
    id: uid(),
    text: text,
    category: categoryInput ? categoryInput.value : 'other',
    priority: priorityInput ? priorityInput.value : 'medium',
    date: dateInput ? dateInput.value : '',
    completed: false
  };

  tasks.unshift(task);
  saveTasks();
  render();

  textInput.value = '';
  if (dateInput) dateInput.value = '';
  textInput.focus();

  // Brief highlight
  setTimeout(function () {
    var newItem = document.querySelector('.task-item[data-id="' + task.id + '"]');
    if (newItem) { newItem.style.borderColor = 'var(--accent)'; setTimeout(function () { newItem.style.borderColor = ''; }, 800); }
  }, 50);
}

function toggleTask(id) {
  tasks = tasks.map(function (t) {
    if (t.id === id) t.completed = !t.completed;
    return t;
  });
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(function (t) { return t.id !== id; });
  saveTasks();
  render();
}

function setFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll('.filter-tab').forEach(function (btn) {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  render();
}

function clearCompleted() {
  tasks = tasks.filter(function (t) { return !t.completed; });
  saveTasks();
  render();
}

/* ---- UTILS ---- */
function escapeHtml(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/* ---- INIT ---- */
document.addEventListener('DOMContentLoaded', function () {
  loadTasks();
  render();

  var addForm = document.getElementById('addTaskForm');
  if (addForm) addForm.addEventListener('submit', addTask);

  document.querySelectorAll('.filter-tab').forEach(function (btn) {
    btn.addEventListener('click', function () { setFilter(btn.dataset.filter); });
  });

  var clearBtn = document.getElementById('clearCompleted');
  if (clearBtn) clearBtn.addEventListener('click', clearCompleted);
});
