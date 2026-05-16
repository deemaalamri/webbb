
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
function loadDashboard() {
  requireLogin();

  const deadlines = JSON.parse(localStorage.getItem("ssp_deadlines") || "[]");

  const today = new Date();
  today.setHours(0,0,0,0);

  let upcomingExams = [];
  let upcomingAssignments = [];

  let totalTasks = deadlines.length;
  let completedTasks = JSON.parse(localStorage.getItem("completedTasks") || "[]").length;

  deadlines.forEach(d => {
    const diffDays = Math.ceil((new Date(d.date) - today) / (1000*60*60*24));

    // 🔴 اختبارات قريبة (7 أيام)
    if (d.type === "Exam" && diffDays <= 7 && diffDays >= 0) {
      upcomingExams.push(d);
    }

    // 🟡 واجبات قريبة (7 أيام)
    if (d.type === "Assignment" && diffDays <= 7 && diffDays >= 0) {
      upcomingAssignments.push(d);
    }
  });

  // ===== الإحصائيات =====
  document.getElementById("totalCourses").textContent =
    localStorage.getItem("ssp_totalCourses") || 0;

  document.getElementById("totalDeadlines").textContent = totalTasks;

  document.getElementById("weeklyHours").textContent =
    (localStorage.getItem("ssp_totalHours") || 0) + "h";

  const percent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  document.getElementById("weeklyProgressBar").style.width = percent + "%";
  document.getElementById("weeklyProgressText").textContent = percent + "%";

  // ===== عرض المواد القريبة =====
  const examBox = document.getElementById("upcomingExams");
  const assignBox = document.getElementById("upcomingAssignments");

  if (examBox) {
    examBox.innerHTML = upcomingExams.length
      ? upcomingExams.map(e => `
        <div class="mini-card">
          <strong>${e.course}</strong>
          <p>${e.name} - ${e.date}</p>
        </div>
      `).join("")
      : "<p>No upcoming exams</p>";
  }

  if (assignBox) {
    assignBox.innerHTML = upcomingAssignments.length
      ? upcomingAssignments.map(a => `
        <div class="mini-card">
          <strong>${a.course}</strong>
          <p>${a.name} - ${a.date}</p>
        </div>
      `).join("")
      : "<p>No upcoming assignments</p>";
  }
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
      plan[day].forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.course} (${item.duration})`;
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
      items.forEach(item => {
        counts[item.course] = (counts[item.course] || 0) + 1;
        const row = document.createElement("div");
        row.className = "plan-session";
        row.innerHTML = `
          <div>
            <strong>${item.course}</strong>
            <p>${item.title}</p>
          </div>
          <span>${item.duration}</span>
        `;
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


// للددلاين  يضيف ماده موجوده 

function loadCoursesToSelect() {

 const courses =
  JSON.parse(localStorage.getItem("courses")) || [];

 const assignSelect =
  document.getElementById("assignCourse");

 const examSelect =
  document.getElementById("examCourse");

 assignSelect.innerHTML =
  `<option value="">Select Course</option>`;

 examSelect.innerHTML =
  `<option value="">Select Course</option>`;

 courses.forEach(course => {

  assignSelect.innerHTML += `
   <option value="${course.name}">
    ${course.name}
   </option>
  `;

  examSelect.innerHTML += `
   <option value="${course.name}">
    ${course.name}
   </option>
  `;
 });
}




/* =========================
   Weekly Plan Page (Auto)
========================= */

function renderWeeklyPlanPage() {

 const weeklyPlans =
 JSON.parse(localStorage.getItem("weeklyPlans") || "[]");

 const days = [
  "Sunday","Monday","Tuesday",
  "Wednesday","Thursday","Friday","Saturday"
 ];

 const weekMap = {
  Sunday: [], Monday: [], Tuesday: [],
  Wednesday: [], Thursday: [], Friday: [], Saturday: []
 };

 weeklyPlans.forEach(p => {
  if (weekMap[p.day]) {
   weekMap[p.day].push(p);
  }
 });

 const tbody = document.getElementById("weeklyPlanBody");

 if (!tbody) {
  console.log("NO TABLE FOUND");
  return;
 }

 tbody.innerHTML = "";

 const maxRows = 6;

 for (let i = 0; i < maxRows; i++) {

  let row = "<tr>";

  days.forEach(day => {

   const task = weekMap[day][i];

   if (task) {
    row += `
     <td>
      <div class="task-box">
        <strong>${task.course}</strong><br>
        <small>⏱ ${task.hours} hrs</small>
      </div>
     </td>
    `;
   } else {
    row += `<td></td>`;
   }

  });

  row += "</tr>";

  tbody.innerHTML += row;

 }

}


/* =========================
   Priority System
========================= */

function getPriority(date) {

 const days =
 Math.ceil(
  (new Date(date) - new Date())
  / (1000*60*60*24)
 );

 if (days <= 3) return "high";
 if (days <= 7) return "medium";
 return "low";
}

function getPriorityLabel(date) {

 const p = getPriority(date);

 if (p === "high") return "High";
 if (p === "medium") return "Medium";
 return "Low";
}

// =========================
// Weekly Plan System CLEAN
// =========================

let weeklyPlans =
JSON.parse(localStorage.getItem("weeklyPlans")) || [];


// =========================
// Load Courses
// =========================





// =========================
// Add Plan
// =========================

function addPlan() {

 const day = document.getElementById("planDay").value;
 const course = document.getElementById("planCourse").value;
 const hours = document.getElementById("planHours").value;

 console.log(day, course, hours); // 👈 مهم للتأكد

 if (!day || !course || !hours) {
  alert("Fill all fields");
  return;
 }

 let weeklyPlans =
 JSON.parse(localStorage.getItem("weeklyPlans") || "[]");

 weeklyPlans.push({
  day,
  course,
  hours
 });

 localStorage.setItem(
  "weeklyPlans",
  JSON.stringify(weeklyPlans)
 );

 console.log("Saved:", weeklyPlans); // 👈 تأكيد

 renderWeeklyPlanPage();
}

