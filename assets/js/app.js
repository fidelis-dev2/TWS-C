
let DATA = null;
let attendanceChart = null;
let statusChart = null;

function badgeClass(status){
  const s = String(status).toLowerCase();
  if (s === 'present' || s === 'online') return 'badge-present';
  if (s === 'late') return 'badge-late';
  if (s === 'absent' || s === 'offline') return 'badge-absent';
  return 'bg-secondary';
}

async function loadData(){
  const res = await fetch('assets/data/app-data.json');
  DATA = await res.json();

  document.getElementById('appName').textContent = DATA.appName;
  document.getElementById('brandAppName').textContent = DATA.appName;
  document.getElementById('welcomeTitle').textContent = DATA.welcome.title;
  document.getElementById('modulesTitle').textContent = DATA.welcome.modulesTitle;

  document.getElementById('welcomeText').innerHTML = DATA.welcome.text.map(t => `<p class="fs-5 mb-3">${t}</p>`).join('');
  document.getElementById('modulesList').innerHTML = DATA.modules.map(m => `<li class="fs-4">${m}</li>`).join('');

  document.getElementById('metrics').innerHTML = DATA.stats.map(s => `
    <div class="col-md-6 col-xl-3">
      <div class="card metric-card">
        <div class="card-body">
          <div class="text-muted fw-semibold">${s.title}</div>
          <div class="metric-value">${s.value}</div>
        </div>
      </div>
    </div>
  `).join('');

  document.getElementById('attendanceRows').innerHTML = DATA.attendanceRows.map(r => `
    <tr>
      <td>${r.lecturer}</td>
      <td>${r.room}</td>
      <td>${r.time}</td>
      <td><span class="badge ${badgeClass(r.status)}">${r.status}</span></td>
      <td>${r.duration}</td>
    </tr>
  `).join('');

  document.getElementById('deviceRows').innerHTML = DATA.deviceRows.map(r => `
    <tr>
      <td>${r.room}</td>
      <td><span class="badge ${badgeClass(r.aiCamera)}">${r.aiCamera}</span></td>
      <td><span class="badge ${badgeClass(r.biometric)}">${r.biometric}</span></td>
      <td><span class="badge ${badgeClass(r.rfid)}">${r.rfid}</span></td>
    </tr>
  `).join('');

  renderCharts();
}

function renderCharts(){
  const lineCtx = document.getElementById('attendanceTrendChart');
  const pieCtx = document.getElementById('statusChart');

  if (attendanceChart) attendanceChart.destroy();
  if (statusChart) statusChart.destroy();

  attendanceChart = new Chart(lineCtx, {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      datasets: [{
        label: 'Attendance Rate (%)',
        data: [82, 89, 77, 93, 85],
        borderColor: '#2f74b5',
        backgroundColor: 'rgba(47,116,181,0.18)',
        fill: true,
        tension: 0.35,
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: true } },
      scales: { y: { beginAtZero: true, max: 100 } }
    }
  });

  statusChart = new Chart(pieCtx, {
    type: 'doughnut',
    data: {
      labels: ['Present', 'Late', 'Absent'],
      datasets: [{
        data: [17, 3, 4],
        backgroundColor: ['#2f6b47', '#b7791f', '#b53d2f']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

function openLogin(){
  Swal.fire({
    title: 'Login to TeachWatch System',
    html: `
      <div class="text-start">
        <label class="form-label fw-bold">Username or Email</label>
        <input id="swal-user" class="form-control mb-3" value="admin@teachwatch.co.tz">
        <label class="form-label fw-bold">Password</label>
        <input id="swal-pass" type="password" class="form-control" value="12345678">
      </div>
    `,
    confirmButtonText: 'Login',
    confirmButtonColor: '#2f74b5',
    focusConfirm: false,
    preConfirm: () => {
      const user = document.getElementById('swal-user').value;
      const pass = document.getElementById('swal-pass').value;
      if (!user || !pass) {
        Swal.showValidationMessage('Please enter username and password');
        return false;
      }
      return { user, pass };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        icon: 'success',
        title: 'Login successful',
        text: 'Welcome to TeachWatch System demo.',
        timer: 1200,
        showConfirmButton: false
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadData();
  document.getElementById('loginLink').addEventListener('click', (e) => {
    e.preventDefault();
    openLogin();
  });
  document.getElementById('downloadAppBtn').addEventListener('click', () => {
    Swal.fire({
      icon: 'info',
      title: 'Presentation Demo',
      text: 'This button is part of the visual simulation only.'
    });
  });
});
