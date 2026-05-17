function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("show");
  }, 100);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

function showSuccessAndRedirect(name, nextPage, action = "Registration Successful! Redirecting...") {
  document.body.innerHTML = `
    <div class="success-redirect-page">
      <h1>Welcome, ${name} 🎉</h1>
      <p>${action}</p>
    </div>
  `;
  setTimeout(() => { window.location.href = nextPage; }, 3000);
}

let modalCallback = null;

function showConfirm(message, callback) {
  document.getElementById("modalMessage").textContent = message;
  document.getElementById("confirmModal").classList.add("active");
  modalCallback = callback;
}

function closeModal() {
  document.getElementById("confirmModal").classList.remove("active");
  modalCallback = null;
}

function confirmAction() {
  closeModal();
  if (modalCallback) modalCallback();
}

function loadUserProfile() {
  const username = localStorage.getItem("loggedInUser") || localStorage.getItem("ssp_currentUser") || "Student";
  const name = username.includes("@") ? username.split("@")[0] : username;
  const nameEls = document.querySelectorAll("#userNameDisplay");
  nameEls.forEach(el => el.textContent = name);
  const avatar = document.getElementById("userAvatar");
  if (avatar && !avatar.getAttribute("src")) {
    avatar.setAttribute("src", "female.png");
  }
}

function getWeeklyPlanData() {
  const deadlines = JSON.parse(localStorage.getItem("deadlines") || "[]");
  const availability = JSON.parse(localStorage.getItem("availability") || "{}");
  return { deadlines, availability };
}

function parseLocalDate(dateString) {
  if (!dateString) return null;
  const parts = String(dateString).split('-').map(Number);
  if (parts.length >= 3 && parts.every(Boolean)) {
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  const d = new Date(dateString);
  return isNaN(d) ? null : d;
}

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function getCurrentWeekDates() {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = startOfToday();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay());
  return days.reduce((map, day, index) => {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + index);
    map[day] = date;
    return map;
  }, {});
}

function isTaskAvailableForPlanDay(task, dayName) {
  const due = parseLocalDate(task.date);
  if (!due) return false;
  const today = startOfToday();
  if (due < today) return false;
  const weekDates = getCurrentWeekDates();
  const planDate = weekDates[dayName];
  if (!planDate) return false;
  return planDate <= due;
}

function getTaskDisplayName(task) {
  return task.name || task.examName || task.title || task.course || "Study Session";
}

function getUpcomingDeadlines(deadlines) {
  const today = startOfToday();
  return [...deadlines]
    .filter(task => {
      const due = parseLocalDate(task.date);
      return due && due >= today;
    })
    .sort((a, b) => parseLocalDate(a.date) - parseLocalDate(b.date));
}

function renderUpcomingReminder() {
  const reminder = document.getElementById("upcomingReminder");
  if (!reminder) return;
  const { deadlines } = getWeeklyPlanData();
  const upcoming = getUpcomingDeadlines(deadlines);
  if (upcoming.length === 0) {
    reminder.textContent = "✅ No upcoming tasks or deadlines.";
    return;
  }
  const names = upcoming.slice(0, 3).map(task => {
    const label = task.name || task.examName || task.course || "Task";
    const course = task.course ? ` - ${task.course}` : "";
    return `${label}${course}`;
  }).join(", ");
  const extra = upcoming.length > 3 ? ` and ${upcoming.length - 3} more` : "";
  reminder.textContent = `⚠️ Reminder: Upcoming tasks: ${names}${extra}.`;
}

function getRequiredHours(task) {
  return task.estimatedHours && task.estimatedHours > 0 ? task.estimatedHours : 1;
}

function getPriorityLabel(task) {
  const today = startOfToday();
  const due = parseLocalDate(task.date);
  if (!due) return "Low";
  const daysLeft = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  if (daysLeft <= 3) return "High";
  if (daysLeft <= 7) return "Medium";
  return "Low";
}

function buildSmartPlan(deadlines, availability) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const upcoming = getUpcomingDeadlines(deadlines);
  const taskBudget = {};
  upcoming.forEach(t => {
    taskBudget[t.id] = getRequiredHours(t);
  });
  const plan = {};
  days.forEach(d => { plan[d] = []; });
  days.forEach(day => {
    let slotsLeft = Number(availability[day] || 0);
    if (slotsLeft <= 0) return;
    const availableForDay = upcoming.filter(t =>
      isTaskAvailableForPlanDay(t, day) && (taskBudget[t.id] || 0) > 0
    );
    if (availableForDay.length === 0) return;
    const today = startOfToday();
    let i = 0;
    while (slotsLeft > 0 && i < availableForDay.length) {
      const task = availableForDay[i];
      const due = parseLocalDate(task.date);
      const daysLeft = due ? Math.max(Math.ceil((due - today) / (1000 * 60 * 60 * 24)), 0) : 999;
      const sameDateTasks = availableForDay.filter(t => t.date === task.date && (taskBudget[t.id] || 0) > 0);
      if (sameDateTasks.length > 1) {
        const totalBudget = sameDateTasks.reduce((s, t) => s + taskBudget[t.id], 0);
        const sharedSlots = Math.min(slotsLeft, totalBudget);
        sameDateTasks.forEach(t => {
          const share = Math.round((taskBudget[t.id] / totalBudget) * sharedSlots);
          const actual = Math.min(share, taskBudget[t.id], slotsLeft);
          for (let h = 0; h < actual; h++) {
            plan[day].push({
              course: t.course || "Study",
              title: getTaskDisplayName(t),
              date: t.date || "",
              duration: "1h",
              daysLeft,
              priority: getPriorityLabel(t),
              taskId: t.id
            });
          }
          taskBudget[t.id] -= actual;
          slotsLeft -= actual;
        });
        i += sameDateTasks.length;
      } else {
        const hoursToAssign = Math.min(taskBudget[task.id], slotsLeft);
        for (let h = 0; h < hoursToAssign; h++) {
          plan[day].push({
            course: task.course || "Study",
            title: getTaskDisplayName(task),
            date: task.date || "",
            duration: "1h",
            daysLeft,
            priority: getPriorityLabel(task),
            taskId: task.id
          });
        }
        taskBudget[task.id] -= hoursToAssign;
        slotsLeft -= hoursToAssign;
        i++;
      }
    }
  });
  return plan;
}

function buildWeeklyPlan() {
  const { deadlines, availability } = getWeeklyPlanData();
  const sortedDeadlines = getUpcomingDeadlines(deadlines);
  const plan = buildSmartPlan(deadlines, availability);
  return { plan, deadlines: sortedDeadlines, availability };
}

function getTaskStateMap() {
  return JSON.parse(localStorage.getItem("ssp_completedTasks") || "{}");
}

function setTaskState(taskId, checked) {
  const completedTasks = getTaskStateMap();
  completedTasks[taskId] = checked;
  localStorage.setItem("ssp_completedTasks", JSON.stringify(completedTasks));
}

function createTaskCheckbox(taskId, checked = false) {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-checkbox";
  checkbox.checked = checked;
  checkbox.addEventListener("change", () => {
    setTaskState(taskId, checkbox.checked);
    const wrapper = checkbox.closest(".task-check-item");
    if (wrapper) wrapper.classList.toggle("is-complete", checkbox.checked);
    if (!checkbox.checked) {
      const missedTasks = JSON.parse(localStorage.getItem("missedTasks") || "[]");
      if (!missedTasks.includes(taskId)) {
        missedTasks.push(taskId);
        localStorage.setItem("missedTasks", JSON.stringify(missedTasks));
      }
      rescheduleAfterMiss();
    } else {
      let missedTasks = JSON.parse(localStorage.getItem("missedTasks") || "[]");
      missedTasks = missedTasks.filter(id => id !== taskId);
      localStorage.setItem("missedTasks", JSON.stringify(missedTasks));
    }
  });
  return checkbox;
}

function rescheduleAfterMiss() {
  const missedTasks = JSON.parse(localStorage.getItem("missedTasks") || "[]");
  if (missedTasks.length === 0) return;
  const availability = JSON.parse(localStorage.getItem("availability") || "{}");
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  let extraSessions = missedTasks.length;
  while (extraSessions > 0) {
    days.forEach(day => {
      if (extraSessions <= 0) return;
      const current = Number(availability[day] || 0);
      availability[day] = current + 1;
      extraSessions--;
    });
  }
  localStorage.setItem("availability", JSON.stringify(availability));
  const planContainer = document.getElementById("weeklyPlan");
  if (planContainer) {
    generateMergedWeeklyPlan();
    showToast("Schedule updated due to missed session!", "error");
  }
}

function createTaskCheckItem(taskId, mainText, subText = "") {
  const completedTasks = getTaskStateMap();
  const wrapper = document.createElement("label");
  wrapper.className = "task-check-item";
  if (completedTasks[taskId]) wrapper.classList.add("is-complete");
  const checkbox = createTaskCheckbox(taskId, completedTasks[taskId] || false);
  const textWrap = document.createElement("div");
  textWrap.className = "task-check-text";
  const main = document.createElement("span");
  main.className = "task-check-main";
  main.textContent = mainText;
  textWrap.appendChild(main);
  if (subText) {
    const sub = document.createElement("small");
    sub.className = "task-check-sub";
    sub.textContent = subText;
    textWrap.appendChild(sub);
  }
  wrapper.appendChild(checkbox);
  wrapper.appendChild(textWrap);
  return wrapper;
}

function initMergedAvailabilityPage() {
  if (!document.getElementById("availabilityTable")) return;
  const savedAvailability = JSON.parse(localStorage.getItem("availability")) || {
    Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0,
    Thursday: 0, Friday: 0, Saturday: 0
  };
  const table = document.getElementById("availabilityTable");
  for (let i = 1; i < table.rows.length; i++) {
    const day = table.rows[i].cells[0].innerText.trim();
    table.rows[i].cells[1].innerText = savedAvailability[day] || 0;
  }
  renderAvailabilityStats();
  renderAvailabilityBars();
  renderUpcomingReminder();
  const saveBtn = document.getElementById("saveAvailability");
  const planBtn = document.getElementById("generateWeeklyPlanBtn");
  if (saveBtn) saveBtn.onclick = saveMergedAvailability;
  if (planBtn) planBtn.onclick = generateMergedWeeklyPlan;
}

function getMergedAvailability() {
  const table = document.getElementById("availabilityTable");
  const availability = {};
  if (!table) return availability;
  for (let i = 1; i < table.rows.length; i++) {
    const day = table.rows[i].cells[0].innerText.trim();
    const hours = parseInt(table.rows[i].cells[1].innerText) || 0;
    availability[day] = hours;
  }
  return availability;
}

function saveMergedAvailability() {
  const availability = getMergedAvailability();
  localStorage.setItem("availability", JSON.stringify(availability));
  renderAvailabilityStats();
  renderAvailabilityBars();
  showToast("Availability saved successfully!");
}

function renderAvailabilityStats() {
  const availability = JSON.parse(localStorage.getItem("availability")) || getMergedAvailability();
  const values = Object.values(availability);
  const total = values.reduce((sum, value) => sum + value, 0);
  const avg = (total / 7).toFixed(1);
  const active = values.filter(v => v > 0).length;
  const totalEl = document.getElementById("totalHours");
  const avgEl = document.getElementById("avgHours");
  const activeEl = document.getElementById("activeDays");
  if (totalEl) totalEl.innerText = total + "h";
  if (avgEl) avgEl.innerText = avg + "h";
  if (activeEl) activeEl.innerText = active;
}

function renderAvailabilityBars() {
  const availability = JSON.parse(localStorage.getItem("availability")) || getMergedAvailability();
  const container = document.getElementById("visualBars");
  if (!container) return;
  const values = Object.values(availability);
  const maxHours = Math.max(...values, 1);
  container.innerHTML = Object.entries(availability).map(([day, hours]) => {
    const width = Math.max((hours / maxHours) * 100, 8);
    return `
      <div class="day-bar">
        <span class="day-name">${day.slice(0,3)}</span>
        <div class="bar" style="width:${width}%">${hours}h</div>
      </div>
    `;
  }).join("");
}

function generateMergedWeeklyPlan() {
  saveMergedAvailability();
  const availability = JSON.parse(localStorage.getItem("availability")) || {};
  const deadlines = JSON.parse(localStorage.getItem("deadlines")) || [];
  const container = document.getElementById("weeklyPlan");
  if (!container) return;
  container.innerHTML = "";
  if (deadlines.length === 0) {
    container.innerHTML = "<p>Please add deadlines first.</p>";
    return;
  }
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const plan = buildSmartPlan(deadlines, availability);

  function priorityIcon(p) {
    if (p === "High") return "🔴";
    if (p === "Medium") return "🟡";
    return "🟢";
  }

  days.forEach(day => {
    const dayCard = document.createElement("div");
    dayCard.className = "plan-day-card";
    const header = document.createElement("div");
    header.className = "plan-day-header";
    const title = document.createElement("h4");
    title.innerText = day;
    const slots = Number(availability[day] || 0);
    const badge = document.createElement("span");
    badge.className = "plan-session-badge";
    badge.innerText = slots === 1 ? "1 session" : `${slots} sessions`;
    header.appendChild(title);
    header.appendChild(badge);
    dayCard.appendChild(header);
    if (slots <= 0) {
      const empty = document.createElement("div");
      empty.className = "plan-empty";
      empty.innerText = "Free day";
      dayCard.appendChild(empty);
      container.appendChild(dayCard);
      return;
    }
    const items = plan[day] || [];
    if (items.length === 0) {
      const empty = document.createElement("div");
      empty.className = "plan-empty";
      empty.innerText = "No upcoming tasks for this day";
      dayCard.appendChild(empty);
      container.appendChild(dayCard);
      return;
    }
    const sessionList = document.createElement("div");
    sessionList.className = "plan-session-list";
    items.forEach((item, i) => {
      const el = document.createElement("div");
      el.className = "plan-session-item";
      const taskId = `merged-${day}-${i}-${item.course}-${item.title}`;
      const label = item.daysLeft !== null
        ? `${item.title} (1h) — ${priorityIcon(item.priority)} ${item.daysLeft}d left`
        : `${item.title} (1h)`;
      const checkItem = createTaskCheckItem(taskId, label, item.course);
      el.appendChild(checkItem);
      sessionList.appendChild(el);
    });
    dayCard.appendChild(sessionList);
    container.appendChild(dayCard);
  });
}
