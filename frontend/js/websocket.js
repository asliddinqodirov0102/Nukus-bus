let ws;
// WebSocket URL: Lokal da ws://localhost, production da wss://nukus-bus.onrender.com
const WS_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'ws://localhost:8000'
    : `wss://${window.location.hostname}`;  // production: xuddi shu domen
const WS_URL = `${WS_BASE}/ws/live`;



// Simulated active buses for testing if WebSocket fails
let activeBuses = [
    { id: "b1", routeNum: "1", nextStation: "Markaziy Bozor", eta: 4, lat: 42.4570, lon: 59.6150, speed: 45 },
    { id: "b2", routeNum: "4", nextStation: "Nukus Aeroporti", eta: 12, lat: 42.4700, lon: 59.6200, speed: 50 },
    { id: "b3", routeNum: "15", nextStation: "Universitet", eta: 3, lat: 42.4640, lon: 59.6180, speed: 30 }
];

document.addEventListener('DOMContentLoaded', () => {
    connectWebSocket();

    // Re-render UI list initially using simulated if we want
    renderBusList();

    // Listen for language changes to re-render the list items
    document.addEventListener('languageChanged', (e) => {
        renderBusList();
    });
});

function connectWebSocket() {
    try {
        ws = new WebSocket(WS_URL);

        ws.onopen = () => {
            console.log('WebSocket connected');
            setConnectionStatus(true);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            handleIncomingData(data);
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected. Reconnecting in 5s...');
            setConnectionStatus(false);
            setTimeout(connectWebSocket, 5000);
        };

        ws.onerror = (err) => {
            console.error('WebSocket Error:', err);
            ws.close();
            // Start simulation mode if WS fails (e.g. backend not running yet)
            startSimulationMode();
        };

    } catch (e) {
        startSimulationMode();
    }
}

function setConnectionStatus(isConnected) {
    const statusContainer = document.getElementById('connStatusContainer');
    const dot = document.getElementById('connectionDot');
    const text = document.getElementById('connectionStatus');

    if (isConnected) {
        statusContainer.classList.remove('bg-red-500/10', 'border-red-500/30');
        statusContainer.classList.add('bg-green-500/10', 'border-green-500/30');
        dot.classList.remove('bg-red-500');
        dot.classList.add('bg-green-500', 'animate-pulse');
        text.classList.remove('text-red-400');
        text.classList.add('text-green-400');
        text.innerText = getTranslation('live_status');
    } else {
        statusContainer.classList.add('bg-red-500/10', 'border-red-500/30');
        statusContainer.classList.remove('bg-green-500/10', 'border-green-500/30');
        dot.classList.add('bg-red-500');
        dot.classList.remove('bg-green-500', 'animate-pulse');
        text.classList.add('text-red-400');
        text.classList.remove('text-green-400');
        text.innerText = "Offline";
    }
}

function handleIncomingData(data) {
    // Expected incoming JSON structure:
    // { "type": "bus_update", "buses": [ { bus_id, lat, lon, speed, eta... } ] }
    if (data.type === "bus_update") {
        activeBuses = data.buses;
        
        // Update Markers on map
        activeBuses.forEach(b => {
            if(window.updateBusMarker) {
                updateBusMarker(b.bus_id, b.lat, b.lon, b.routeNum, b.speed);
            }
        });

        // Update list
        renderBusList();
    }
}

function updateCounters() {
    const totalEl = document.getElementById('totalActiveBusesCounter');
    const rightPanelActive = document.getElementById('liveMonitorActive');
    if (totalEl) {
        totalEl.innerText = activeBuses.length;
    }
    if (rightPanelActive) {
        rightPanelActive.innerText = activeBuses.length;
    }
}

function renderBusList() {
    const listContainer = document.getElementById('busList');
    const loading = document.getElementById('loading');
    
    updateCounters();

    if(!listContainer || !loading) return;

    loading.classList.add('hidden');
    listContainer.classList.remove('hidden');

    listContainer.innerHTML = ''; // clear

    activeBuses.forEach(bus => {
        const item = document.createElement('div');
        item.className = 'flex items-center space-x-4 bg-white/50 dark:bg-gray-800/80 p-3.5 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-700/80 hover:scale-[1.02] transform transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md';
        
        // Click to center map
        item.onclick = () => {
            if(window.map) {
                map.flyTo([bus.lat, bus.lon], 16, { animate: true, duration: 1 });
            }
        };

        item.innerHTML = `
            <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-md rotate-3 group-hover:rotate-6 transition-transform">
                ${bus.routeNum}
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-gray-800 dark:text-white truncate">
                    ${getTranslation('next_station')}: <span class="text-blue-600 dark:text-blue-400 font-extrabold uppercase text-[11px] tracking-wider ml-1 bg-blue-100 dark:bg-blue-500/20 px-2 py-0.5 rounded">${bus.nextStation || '-'}</span>
                </p>
                <div class="flex flex-wrap items-center mt-1.5 text-xs space-x-3 text-gray-500 dark:text-gray-400 font-medium">
                    <span class="flex items-center bg-gray-100 dark:bg-gray-800 px-2 pl-1 py-0.5 rounded shadow-inner"><ion-icon name="speedometer-outline" class="mr-1 text-gray-400"></ion-icon> ${bus.speed || 0} ${getTranslation('km_h')}</span>
                    <span class="flex items-center text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2 pl-1 py-0.5 rounded shadow-inner"><ion-icon name="time-outline" class="mr-1"></ion-icon> ~${bus.eta || '-'} ${getTranslation('min')}</span>
                </div>
            </div>
        `;
        listContainer.appendChild(item);
    });
}

// ----------------------------------------------------
// Simulation for testing UI without backend
// ----------------------------------------------------
let simInterval = null;
function startSimulationMode() {
    console.warn("Backend not found. Falling back to local visual simulation mode.");
    
    // Initial draw
    activeBuses.forEach(b => {
        if(window.updateBusMarker) {
            updateBusMarker(b.id, b.lat, b.lon, b.routeNum, b.speed);
        }
    });
    renderBusList();

    if(simInterval) clearInterval(simInterval);

    simInterval = setInterval(() => {
        // randomly move buses
        activeBuses = activeBuses.map(b => {
            return {
                ...b,
                lat: b.lat + (Math.random() - 0.5) * 0.001,
                lon: b.lon + (Math.random() - 0.5) * 0.001,
                speed: Math.max(10, Math.floor(b.speed + (Math.random() - 0.5) * 10))
            }
        });
        
        activeBuses.forEach(b => {
            if(window.updateBusMarker) {
                updateBusMarker(b.id, b.lat, b.lon, b.routeNum, b.speed);
            }
        });
        
        renderBusList();

    }, 3000); // update every 3 secs
}
