
// ===== صفحة نجاح مؤقتة =====
function showSuccessAndRedirect(name, nextPage, action = "Registration Successful! Redirecting...") {
  document.body.innerHTML = `
    <div style="
      width:100%;
      height:100vh;
      display:flex;
      flex-direction:column;
      justify-content:center;
      align-items:center;
      text-align:center;
      background:linear-gradient(135deg,#e9f1ff,#cfe0ff);
      font-family:'Poppins',sans-serif;">
      
      <h1 style="color:#1e3f7f;font-size:28px;font-weight:600;">
        Welcome, ${name} 🎉
      </h1>
      <p style="font-size:18px;color:#333;margin-top:10px;">
        ${action}
      </p>
    </div>
  `;
  // يحجز الوقت للانتقال بعد 3 ثواني
  setTimeout(() => { window.location.href = nextPage; }, 3000);
}

// ===== تسجيل المستخدم =====
function toggleForm(signupMode){
  document.getElementById("signupCard").style.display = signupMode?"block":"none";
  document.getElementById("loginCard").style.display = signupMode?"none":"block";
}
function signUpUser() {
  const email = document.getElementById("signupEmail").value.trim();
  const pass = document.getElementById("signupPassword").value.trim();
  const gender = document.getElementById("gender").value; // ← الجنس

  if (!email || !pass) return alert("املأ جميع الحقول");

  let users = JSON.parse(localStorage.getItem("ssp_users") || "[]");
  if (users.find(u => u.email === email)) return alert("هذا البريد مسجل مسبقاً");

  // نحفظ البيانات مع الجنس
  users.push({ email, pass, gender });
  localStorage.setItem("ssp_users", JSON.stringify(users));
  localStorage.setItem("ssp_currentUser", email);

  const name = email.split("@")[0];
  showSuccessAndRedirect(name, "dashboard.html", "تم إنشاء الحساب بنجاح! سيتم نقلك بعد لحظات...");
}




function loginUser() {
  const email = document.getElementById("loginEmail").value.trim();
  const pass = document.getElementById("loginPassword").value.trim();
  const users = JSON.parse(localStorage.getItem("ssp_users") || "[]");
  const user = users.find(u => u.email === email && u.pass === pass);
  if (!user) return alert("بيانات غير صحيحة");

  localStorage.setItem("ssp_currentUser", email);

  // ✨ صفحة الترحيب تظهر هنا
  const name = email.split('@')[0];
  showSuccessAndRedirect(name, "dashboard.html", "Welcome back! Redirecting...");
}



function logoutUser(){localStorage.removeItem("ssp_currentUser");window.location.href="signUp.html";}
function requireLogin(){if(!localStorage.getItem("ssp_currentUser"))window.location.href="signUp.html";}


// ===== Courses =====
function addCourse(){
  const name=document.getElementById("courseName").value.trim();
  const hrs=parseFloat(document.getElementById("creditHours").value)||0;
  if(!name)return alert("أدخل اسم المقرر");
  let list=JSON.parse(localStorage.getItem("ssp_courses")||"[]");
  list.push({id:Date.now(),name,hrs});
  localStorage.setItem("ssp_courses",JSON.stringify(list));
  loadCourses();
}
function deleteCourse(id){
  let list=JSON.parse(localStorage.getItem("ssp_courses")||"[]");
  list=list.filter(c=>c.id!==id);
  localStorage.setItem("ssp_courses",JSON.stringify(list));
  loadCourses();
}
function loadCourses(){
  requireLogin();
  const body=document.getElementById("courseBody");
  const list=JSON.parse(localStorage.getItem("ssp_courses")||"[]");
  body.innerHTML="";
  list.forEach((c,i)=>{
    body.innerHTML+=`<tr><td>${i+1}</td><td>${c.name}</td><td>${c.hrs}</td>
    <td><button class='btn-delete' onclick='deleteCourse(${c.id})'>❌</button></td></tr>`;
  });
  localStorage.setItem("ssp_totalCourses",list.length);
}

// ===== Deadlines =====
function addDeadline(){
  const type=document.getElementById("deadlineType").value;
  const course=document.getElementById("deadlineCourse").value.trim();
  const name=document.getElementById("deadlineName").value.trim();
  const date=document.getElementById("deadlineDate").value;
  if(!course||!name||!date)return alert("املأ كل الحقول");
  let list=JSON.parse(localStorage.getItem("ssp_deadlines")||"[]");
  list.push({id:Date.now(),type,course,name,date});
  localStorage.setItem("ssp_deadlines",JSON.stringify(list));
  loadDeadlines();
}
function deleteDeadline(id){
  let list=JSON.parse(localStorage.getItem("ssp_deadlines")||"[]");
  list=list.filter(d=>d.id!==id);
  localStorage.setItem("ssp_deadlines",JSON.stringify(list));
  loadDeadlines();
}
function loadDeadlines(){
  requireLogin();
  const body=document.getElementById("deadlineBody");
  const list=JSON.parse(localStorage.getItem("ssp_deadlines")||"[]");
  body.innerHTML="";
  list.forEach(d=>{
    const daysLeft=Math.ceil((new Date(d.date)-new Date())/(1000*60*60*24));
    body.innerHTML+=`<tr><td>${d.type}</td><td>${d.course}</td><td>${d.name}</td>
    <td>${d.date}</td><td>${daysLeft>0?daysLeft:"0"}</td>
    <td><button class='btn-delete' onclick='deleteDeadline(${d.id})'>❌</button></td></tr>`;
  });
  localStorage.setItem("ssp_totalDeadlines",list.length);
}

// ===== Availability =====
function loadAvailability(){
  requireLogin();
  const days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const table=document.getElementById("availabilityTable");
  table.innerHTML="";
  const data=JSON.parse(localStorage.getItem("ssp_availability")||"{}");
  days.forEach(d=>{
    table.innerHTML+=`<tr><td>${d}</td><td><input id="${d}" type="number" min="0" value="${data[d]||0}"></td></tr>`;
  });
}
function saveAvailability(){
  const days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  let total=0, obj={};
  days.forEach(d=>{
    const val=parseFloat(document.getElementById(d).value)||0;
    obj[d]=val; total+=val;
  });
  localStorage.setItem("ssp_availability",JSON.stringify(obj));
  localStorage.setItem("ssp_totalHours",total);
  alert("تم الحفظ ("+total+" ساعات)");
}

// ===== Dashboard =====
function loadDashboard(){
  requireLogin();
  const totalHours=localStorage.getItem("ssp_totalHours")||0;
  document.getElementById("weeklyHours").textContent=totalHours+"h";
  document.getElementById("totalCourses").textContent=localStorage.getItem("ssp_totalCourses")||0;
  document.getElementById("totalDeadlines").textContent=localStorage.getItem("ssp_totalDeadlines")||0;
  const percent=Math.min((totalHours/40)*100,100);
  document.getElementById("weeklyProgressBar").style.width=percent+"%";
  document.getElementById("weeklyProgressText").textContent=percent.toFixed(0)+"%";
}

// ===== Statistics =====
function loadStatistics(){
  requireLogin();
  const body=document.getElementById("statsBody");
  const avail=JSON.parse(localStorage.getItem("ssp_availability")||"{}");
  body.innerHTML="";
  Object.keys(avail).forEach(day=>{
    const hrs=avail[day];
    const status=hrs>0?"✅":"—";
    body.innerHTML+=`<tr><td>${day}</td><td>${hrs}</td><td>${status}</td></tr>`;
  });
}















// ===== Shared profile =====
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
  const deadlines = JSON.parse(localStorage.getItem("deadlines") || localStorage.getItem("ssp_deadlines") || "[]");
  const availability = JSON.parse(localStorage.getItem("availability") || localStorage.getItem("ssp_availability") || "{}");
  return { deadlines, availability };
}

function buildWeeklyPlan() {
  const { deadlines, availability } = getWeeklyPlanData();
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const sortedDeadlines = [...deadlines].sort((a, b) => new Date(a.date) - new Date(b.date));
  const plan = {};
  let taskIndex = 0;

  days.forEach(day => {
    const slots = Number(availability[day] || 0);
    plan[day] = [];
    for (let i = 0; i < slots; i++) {
      if (sortedDeadlines.length === 0) break;
      const task = sortedDeadlines[taskIndex % sortedDeadlines.length];
      plan[day].push({
        course: task.course || "Study",
        title: task.name || task.course || "Study session",
        date: task.date || "",
        duration: "1h"
      });
      taskIndex++;
    }
  });

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
  });
  return checkbox;
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

function generateWeeklyPlan(containerId = "weeklyPlan") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const { plan } = buildWeeklyPlan();
  container.innerHTML = "";

  Object.keys(plan).forEach(day => {
    const dayBlock = document.createElement("div");
    dayBlock.className = "plan-day-block";

    const title = document.createElement("h4");
    title.textContent = day;
    dayBlock.appendChild(title);

    if (plan[day].length === 0) {
      const free = document.createElement("p");
      free.className = "plan-free";
      free.textContent = "Free";
      dayBlock.appendChild(free);
    } else {
      const ul = document.createElement("ul");
      ul.className = "plan-inline-list";
      plan[day].forEach((item, index) => {
        const li = document.createElement("li");
        const taskId = `weekly-${day}-${index}-${item.course}-${item.title || ""}`;
        li.appendChild(createTaskCheckItem(taskId, `${item.course} (${item.duration})`));
        ul.appendChild(li);
      });
      dayBlock.appendChild(ul);
    }

    container.appendChild(dayBlock);
  });
}

function renderWeeklyPlanPage() {
  const grid = document.getElementById("weeklyPlanGrid");
  if (!grid) return;

  const { plan, deadlines } = buildWeeklyPlan();
  grid.innerHTML = "";

  let sessions = 0;
  let activeDays = 0;
  const counts = {};

  Object.entries(plan).forEach(([day, items]) => {
    if (items.length > 0) activeDays++;
    sessions += items.length;

    const card = document.createElement("div");
    card.className = "plan-card";

    const header = document.createElement("div");
    header.className = "plan-card-header";
    header.innerHTML = `<h3>${day}</h3><span>${items.length} session${items.length === 1 ? '' : 's'}</span>`;
    card.appendChild(header);

    if (items.length === 0) {
      const empty = document.createElement("div");
      empty.className = "plan-empty";
      empty.textContent = "Free day";
      card.appendChild(empty);
    } else {
      items.forEach((item, index) => {
        counts[item.course] = (counts[item.course] || 0) + 1;
        const row = document.createElement("div");
        row.className = "plan-session";

        const taskId = `planpage-${day}-${index}-${item.course}-${item.title || ""}`;
        const checkItem = createTaskCheckItem(taskId, `${item.course} (${item.duration})`, item.title);

        row.appendChild(checkItem);
        card.appendChild(row);
      });
    }

    grid.appendChild(card);
  });

  const planSessions = document.getElementById("planSessions");
  const planActiveDays = document.getElementById("planActiveDays");
  const planTopCourse = document.getElementById("planTopCourse");
  if (planSessions) planSessions.textContent = sessions;
  if (planActiveDays) planActiveDays.textContent = activeDays;
  if (planTopCourse) {
    const top = Object.keys(counts).sort((a,b) => counts[b]-counts[a])[0] || (deadlines[0]?.course || '-');
    planTopCourse.textContent = top;
  }
}


// ===== Availability + Weekly Plan (Merged Page) =====
function initMergedAvailabilityPage() {
  if (!document.getElementById("availabilityTable")) return;

  const savedAvailability =
    JSON.parse(localStorage.getItem("ssp_availability")) ||
    JSON.parse(localStorage.getItem("availability")) || {
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
  localStorage.setItem("ssp_availability", JSON.stringify(availability));
  renderAvailabilityStats();
  renderAvailabilityBars();
  alert("Availability saved successfully!");
}

function renderAvailabilityStats() {
  const availability =
    JSON.parse(localStorage.getItem("ssp_availability")) ||
    getMergedAvailability();

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
  const availability =
    JSON.parse(localStorage.getItem("ssp_availability")) ||
    getMergedAvailability();

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

  const availability =
    JSON.parse(localStorage.getItem("ssp_availability")) ||
    JSON.parse(localStorage.getItem("availability")) || {};

  const deadlines =
    JSON.parse(localStorage.getItem("ssp_deadlines")) ||
    JSON.parse(localStorage.getItem("deadlines")) || [];

  const container = document.getElementById("weeklyPlan");
  if (!container) return;

  container.innerHTML = "";

  if (deadlines.length === 0) {
    container.innerHTML = "<p>Please add deadlines first.</p>";
    return;
  }

  const sortedDeadlines = [...deadlines].sort((a, b) => new Date(a.date) - new Date(b.date));
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let taskIndex = 0;

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

    const sessionList = document.createElement("div");
    sessionList.className = "plan-session-list";

    for (let i = 0; i < slots; i++) {
      const task = sortedDeadlines[taskIndex % sortedDeadlines.length];

      const item = document.createElement("div");
      item.className = "plan-session-item";

      const taskId = `merged-${day}-${i}-${task.course || "Course"}-${task.name || task.examName || "Study Session"}`;

      const checkItem = createTaskCheckItem(
        taskId,
        `${task.course || "Course"} (1h)`,
        task.name || task.examName || "Study Session"
      );

      item.appendChild(checkItem);
      sessionList.appendChild(item);

      taskIndex++;
    }

    dayCard.appendChild(sessionList);
    container.appendChild(dayCard);
  });
}
