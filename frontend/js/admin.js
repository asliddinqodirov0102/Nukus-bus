// ── API URL: Lokal da va production da relative URL ────────────────────────
// Frontend va backend bitta Render servisida (https://nukus-bus.onrender.com)
const API_BASE = '';

document.addEventListener('DOMContentLoaded', () => {
    
    // Auth Check
    const token = localStorage.getItem('adminToken');
    if (token) {
        showDashboard();
    } else {
        showLogin();
    }

    // Login Form Listener
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;
        const err = document.getElementById('loginError');

        // Mock Login for now since we don't have backend
        if (user === 'admin' && pass === '123') {
            err.classList.add('hidden');
            localStorage.setItem('adminToken', 'mock_jwt_token_for_nukus');
            showDashboard();
        } else {
            err.classList.remove('hidden');
        }
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('adminToken');
        showLogin();
    });

    // I18n trigger for chart and table updates (optional)
    document.addEventListener('languageChanged', () => {
        renderBuses();
        // optionally redraw chart labels here
    });
// Modal logic
    const openModalBtn = document.getElementById('openAddBusModal');
    const closeModalBtn = document.getElementById('closeAddBusModal');
    const modal = document.getElementById('addBusModal');
    const addBusForm = document.getElementById('addBusForm');

    if(openModalBtn) {
        openModalBtn.addEventListener('click', () => {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        });
    }

    if(closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        });
    }

    if(addBusForm) {
        addBusForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const routeNum = document.getElementById('newRouteNum').value;
            const routeName = document.getElementById('newRouteName').value;
            const driverPhone = document.getElementById('newDriverPhone').value;

            try {
                const res = await fetch(`${API_BASE}/api/admin/buses`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        route_num: routeNum,
                        route_name: routeName,
                        driver_phone: driverPhone,
                        is_active: true
                    })
                });
                if(res.ok) {
                    modal.classList.add('hidden');
                    modal.classList.remove('flex');
                    addBusForm.reset();
                    // Refetch buses
                    fetchAdminData();
                } else {
                    alert('Xatolik yuz berdi');
                }
            } catch (err) {
                console.error(err);
                alert('Serverga ulanib bo\'lmadi');
            }
        });
    }
});

function showLogin() {
    document.getElementById('loginOverlay').classList.remove('hidden');
    document.getElementById('loginOverlay').classList.add('flex');
    document.getElementById('dashboardContainer').classList.add('hidden');
}

function showDashboard() {
    document.getElementById('loginOverlay').classList.add('hidden');
    document.getElementById('loginOverlay').classList.remove('flex');
    document.getElementById('dashboardContainer').classList.remove('hidden');

    // Init data
    fetchAdminData();
    initChart();
}


// Admin Data Store
let busesData = [];

async function fetchAdminData() {
    try {
        const res = await fetch(`${API_BASE}/api/admin/buses`);
        if(res.ok) {
            busesData = await res.json();
            renderBuses();
            document.getElementById('activeBusCount').innerText = busesData.filter(b => b.is_active).length;
        }
    } catch (e) {
        console.error("Buses fetch error", e);
    }
}

function renderBuses() {
    const tbody = document.getElementById('busTableBody');
    tbody.innerHTML = '';

    busesData.forEach((bus, index) => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors';
        tr.innerHTML = `
            <td class="px-4 py-3 font-medium text-white">${bus.route_num}</td>
            <td class="px-4 py-3">${bus.route_name}</td>
            <td class="px-4 py-3">${bus.driver_phone || '-'}</td>
            <td class="px-4 py-3">
                <span class="px-2 py-1 rounded-full text-xs font-medium ${bus.is_active ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}">
                    ${bus.is_active ? 'On Line' : 'Off Line'}
                </span>
            </td>
            <td class="px-4 py-3 space-x-2">
                <button class="text-blue-400 hover:text-blue-300 transition-colors" title="Edit">
                    <ion-icon name="create-outline" class="text-lg"></ion-icon>
                </button>
                <button class="text-red-400 hover:text-red-300 transition-colors" title="Delete">
                    <ion-icon name="trash-outline" class="text-lg"></ion-icon>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function initChart() {
    const ctx = document.getElementById('distanceChart').getContext('2d');
    
    // Destroy previous Chart instance if exists
    if(window.distChart) window.distChart.destroy();

    // Chart.js global defaults for dark theme
    Chart.defaults.color = '#9ca3af'; // text-gray-400
    Chart.defaults.scale.grid.color = 'rgba(255, 255, 255, 0.05)';

    window.distChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'],
            datasets: [{
                label: 'Kunlik Masofa (km)',
                data: [3500, 3800, 4100, 3900, 4203, 3100, 2900],
                borderColor: '#3b82f6', // blue-500
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#1e3a8a',
                pointBorderColor: '#3b82f6',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#cbd5e1',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    padding: 10,
                    displayColors: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    suggestedMin: 2000
                }
            }
        }
    });
}
