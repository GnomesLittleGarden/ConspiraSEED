/* === CONFIG  ========================================================== */
const CITIES = {
  edmonton: {
    label: "Edmonton Central",
    center: [53.5444, -113.4909],
    bbox: [[53.42, -113.75], [53.70, -113.25]],
    zoom: 13,
    description: "Primary operational area - central planning zone"
  },
  downtown: {
    label: "Downtown Core",
    center: [53.5420, -113.4950],
    bbox: [[53.53, -113.52], [53.55, -113.48]],
    zoom: 15,
    description: "High-density target area - financial/government matrix nodes"
  },
  university: {
    label: "University Area",
    center: [53.5240, -113.5250],
    bbox: [[53.51, -113.54], [53.54, -113.51]],
    zoom: 15,
    description: "Knowledge cluster - academic infiltration zone"
  },
  whyte: {
    label: "Whyte Ave District",
    center: [53.5180, -113.5050],
    bbox: [[53.50, -113.53], [53.53, -113.48]],
    zoom: 15,
    description: "Cultural district - high-visibility impact zone"
  },
  westend: {
    label: "West Edmonton",
    center: [53.5260, -113.6230],
    bbox: [[53.51, -113.65], [53.54, -113.60]],
    zoom: 14,
    description: "Commercial hub - consumer matrix disruption target"
  },
  river: {
    label: "River Valley",
    center: [53.5320, -113.5190],
    bbox: [[53.52, -113.54], [53.54, -113.49]],
    zoom: 14,
    description: "Ecological corridor - natural system integration points"
  },
  nait: {
    label: "NAIT Area",
    center: [53.5690, -113.5060],
    bbox: [[53.56, -113.52], [53.58, -113.49]],
    zoom: 15,
    description: "Technical district - industrial matrix connection"
  }
};

const DEFAULT_CITY = "edmonton"; // Always use edmonton as default now
const MATRIX_CODE_CHARS = "01アカサタナハマヤラワンABCDEFGHIJKLMNOPQRSTUVWXYZ";

/* ===  BOOT UP  ======================================================== */
// Create map with custom options
const map = L.map("map", {
  zoomControl: false,  // We'll add it manually in a different position
  attributionControl: true,
  minZoom: 11,
  maxZoom: 18,
  doubleClickZoom: false // Disable default double-click zoom
});

/* ===  ICONS =============================================== */
const ICONS = {
  potential: L.icon({ 
    iconUrl: "https://i.imgur.com/fBfAmUV.png", // Yellow sprout placeholder
    iconSize: [28, 28], 
    iconAnchor: [14, 28], 
    popupAnchor: [0, -28],
    className: "pulse-icon"
  }),
  confirmed: L.icon({ 
    iconUrl: "https://i.imgur.com/aTJEfti.png", // Green sprout placeholder 
    iconSize: [28, 28], 
    iconAnchor: [14, 28], 
    popupAnchor: [0, -28],
    className: "pulse-icon confirmed-icon" 
  }),
  danger: L.icon({ 
    iconUrl: "https://i.imgur.com/ZFJvAnG.png", // Red hazard placeholder
    iconSize: [28, 28], 
    iconAnchor: [14, 28], 
    popupAnchor: [0, -28],
    className: "pulse-icon danger-icon" 
  }),
  breach: L.icon({ 
    iconUrl: "https://i.imgur.com/UYrZBcQ.png", // Purple breach placeholder
    iconSize: [28, 28], 
    iconAnchor: [14, 28], 
    popupAnchor: [0, -28],
    className: "pulse-icon breach-icon" 
  })
};
const DEFAULT_TYPE = "potential";

/* Legend for the map */
function createLegend() {
  const legend = L.control({ position: 'bottomright' });
  
  legend.onAdd = function() {
    const div = L.DomUtil.create('div', 'matrix-legend');
    div.innerHTML = `
      <div class="legend-title">SEED BOMB CLASSIFICATION</div>
      <div class="legend-item"><span class="legend-color potential"></span> Seed Potential</div>
      <div class="legend-item"><span class="legend-color confirmed"></span> Confirmed Growth</div>
      <div class="legend-item"><span class="legend-color danger"></span> High Danger</div>
      <div class="legend-item"><span class="legend-color breach"></span> Breach Success</div>
      <div class="legend-help">DOUBLE-CLICK to add | RIGHT-CLICK to remove</div>
    `;
    return div;
  };
  
  return legend;
}

/* Area description panel */
function createAreaPanel() {
  const panel = L.control({ position: 'topleft' });
  
  panel.onAdd = function() {
    const div = L.DomUtil.create('div', 'area-panel');
    updateAreaPanel(div, DEFAULT_CITY);
    return div;
  };
  
  return panel;
}

function updateAreaPanel(panelDiv, cityKey) {
  const cfg = CITIES[cityKey];
  panelDiv.innerHTML = `
    <div class="area-title">${cfg.label}</div>
    <div class="area-description">${cfg.description}</div>
    <div class="area-stats">
      <div>POTENTIAL SITES: ${countHitsByType(cityKey, 'potential')}</div>
      <div>CONFIRMED: ${countHitsByType(cityKey, 'confirmed')}</div>
      <div>BREACHES: ${countHitsByType(cityKey, 'breach')}</div>
    </div>
  `;
}

function countHitsByType(cityKey, type) {
  return ALL_HITS.filter(hit => hit.city === cityKey && hit.mtype === type).length;
}

// Add Matrix digital rain effect to the background
function createMatrixRain() {
  const container = document.createElement('div');
  container.className = 'matrix-rain';
  document.body.appendChild(container);
  
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const ctx = canvas.getContext('2d');
  const columns = Math.floor(canvas.width / 20);
  const drops = [];

  // Initialize drops at random positions
  for (let i = 0; i < columns; i++) {
    drops[i] = Math.floor(Math.random() * canvas.height);
  }

  function draw() {
    // Translucent black background to show trail
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Green text
    ctx.fillStyle = '#0f0';
    ctx.font = '15px monospace';

    // Loop over drops
    for (let i = 0; i < drops.length; i++) {
      // Random character from our matrix code
      const text = MATRIX_CODE_CHARS.charAt(Math.floor(Math.random() * MATRIX_CODE_CHARS.length));
      ctx.fillText(text, i * 20, drops[i] * 20);

      // Reset when hitting the bottom and randomize speed
      if (drops[i] * 20 > canvas.height && Math.random() > 0.98) {
        drops[i] = 0;
      }

      // Move drops down
      drops[i]++;
    }
  }

  setInterval(draw, 60);

  // Handle window resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// Add a status panel showing current operation data
function createStatusPanel() {
  const panel = document.createElement('div');
  panel.className = 'status-panel';
  document.body.appendChild(panel);
  
  const today = new Date().toISOString().split('T')[0];
  const operativeId = localStorage.getItem('OPERATIVE_ID') || 'ANON-' + Math.floor(Math.random() * 10000);
  localStorage.setItem('OPERATIVE_ID', operativeId);
  
  // Calculate total count stats
  const totalConfirmed = ALL_HITS.filter(hit => hit.mtype === 'confirmed').length;
  const totalBreaches = ALL_HITS.filter(hit => hit.mtype === 'breach').length;
  const totalDanger = ALL_HITS.filter(hit => hit.mtype === 'danger').length;
  
  panel.innerHTML = `
    <div class="status-title">OPERATION STATUS</div>
    <div class="status-row">DATE: <span class="status-value">${today}</span></div>
    <div class="status-row">OPERATIVE: <span class="status-value">${operativeId}</span></div>
    <div class="status-row">SEED BANKS: <span class="status-value">4 ACTIVE</span></div>
    <div class="status-row">DEPLOYMENT: <span class="status-value">PHASE 2</span></div>
    <div class="status-row">SUCCESSFUL: <span class="status-value">${totalConfirmed + totalBreaches}</span></div>
    <div class="status-row">HIGH ALERT: <span class="status-value">${totalDanger}</span></div>
  `;
  
  return panel;
}

function showMatrixMessage(message) {
  const msgElement = document.createElement('div');
  msgElement.className = 'matrix-message';
  msgElement.textContent = message;
  document.body.appendChild(msgElement);
  
  setTimeout(() => {
    msgElement.style.opacity = '0';
    setTimeout(() => msgElement.remove(), 500);
  }, 2000);
}

/* load + draw hits ********************************************************/
const SEED_HITS = (typeof HIT_LOG !== "undefined") ? [...HIT_LOG] : [];
let LOCAL_HITS = JSON.parse(localStorage.getItem("HITS") || "[]");
let ALL_HITS = [...SEED_HITS, ...LOCAL_HITS];

function reloadAllHits() {
  LOCAL_HITS = JSON.parse(localStorage.getItem("HITS") || "[]");
  ALL_HITS = [...SEED_HITS, ...LOCAL_HITS];
}

/* === functions ========================================================= */
let markerLayer;   // will hold a LayerGroup we replace on city switch
let heatmapLayer;  // will hold potential heatmap
let areaPanel;     // will hold area description panel

function initCity(cityKey) {
  const cfg = CITIES[cityKey];

  /* map frame */
  map.setMaxBounds(cfg.bbox);
  map.setView(cfg.center, cfg.zoom || 13);

  /* base tiles – added once */
  if (!map._tiles) {
    // Dark map style from CartoDB
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
      detectRetina: true, 
      reuseTiles: true
    }).addTo(map);
    
    // Add zoom control to the bottom left position
    L.control.zoom({ position: "bottomleft" }).addTo(map);
    
    createLegend().addTo(map);
    areaPanel = createAreaPanel().addTo(map);
  } else {
    // Update area panel with new city
    const panelDiv = document.querySelector('.area-panel');
    if (panelDiv) {
      updateAreaPanel(panelDiv, cityKey);
    }
  }

  /* wipe previous markers */
  if (markerLayer) map.removeLayer(markerLayer);
  markerLayer = L.layerGroup().addTo(map);

  /* draw hits for this city */
  ALL_HITS.forEach(drawHit);
}

function drawHit(hit) {
  const icon = ICONS[hit.mtype] || ICONS[DEFAULT_TYPE];
  const marker = L.marker([hit.lat, hit.lng], { icon, hitId: hit.id })
    .addTo(markerLayer)
    .bindPopup(createPopupContent(hit));
  
  // Add marker type as class for styling
  const element = marker.getElement();
  if (element) {
    element.classList.add(`marker-${hit.mtype || DEFAULT_TYPE}`);
    
    // Add right-click handler for deletion
    element.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      handleMarkerRightClick(marker, hit);
    });
  }
  
  return marker;
}

function createPopupContent(hit) {
  // Check if it's a predefined hit or user-added hit
  const isUserHit = hit.id.startsWith('EDM-') && !hit.id.match(/^EDM-(CONF|BREACH|DANGER|POT)-\d+$/);
  const deleteButton = isUserHit ? 
    `<button class="delete-hit-btn" data-hit-id="${hit.id}">DELETE</button>` : '';
  
  return `
    <div class="hit-popup">
      <strong>${hit.label}</strong>
      <div class="popup-date">${hit.date}</div>
      <div class="popup-notes">${hit.notes}</div>
      ${deleteButton}
    </div>
  `;
}

function handleMarkerRightClick(marker, hit) {
  // Only allow deletion of user-added hits (not pre-defined ones)
  if (!hit.id.match(/^EDM-(CONF|BREACH|DANGER|POT)-\d+$/)) {
    showDeleteConfirmation(marker, hit);
  } else {
    showMatrixMessage('SYSTEM LOCATION - CANNOT DELETE');
  }
}

function showDeleteConfirmation(marker, hit) {
  const confirmBox = document.createElement('div');
  confirmBox.className = 'delete-confirmation';
  confirmBox.innerHTML = `
    <div class="delete-message">DELETE LOCATION?</div>
    <div class="delete-location">${hit.label}</div>
    <div class="delete-buttons">
      <button class="confirm-delete">CONFIRM</button>
      <button class="cancel-delete">CANCEL</button>
    </div>
  `;
  
  document.body.appendChild(confirmBox);
  
  // Position centered
  confirmBox.style.top = '50%';
  confirmBox.style.left = '50%';
  confirmBox.style.transform = 'translate(-50%, -50%)';
  
  // Add event listeners
  const confirmBtn = confirmBox.querySelector('.confirm-delete');
  const cancelBtn = confirmBox.querySelector('.cancel-delete');
  
  confirmBtn.addEventListener('click', () => {
    deleteHit(hit.id);
    map.removeLayer(marker);
    confirmBox.remove();
    showMatrixMessage('LOCATION DELETED');
  });
  
  cancelBtn.addEventListener('click', () => {
    confirmBox.remove();
  });
}

function deleteHit(hitId) {
  // Filter out the hit from localStorage
  const stash = JSON.parse(localStorage.getItem("HITS") || "[]");
  const newStash = stash.filter(h => h.id !== hitId);
  localStorage.setItem("HITS", JSON.stringify(newStash));
  
  // Update our local arrays
  LOCAL_HITS = LOCAL_HITS.filter(h => h.id !== hitId);
  ALL_HITS = [...SEED_HITS, ...LOCAL_HITS];
  
  // Update area panel stats
  const panelDiv = document.querySelector('.area-panel');
  if (panelDiv) {
    updateAreaPanel(panelDiv, DEFAULT_CITY);
  }
}

function saveHit(hit) {
  /* stash local */
  const stash = JSON.parse(localStorage.getItem("HITS") || "[]");
  stash.push(hit);
  localStorage.setItem("HITS", JSON.stringify(stash));
  
  // Update our local arrays
  LOCAL_HITS.push(hit);
  ALL_HITS = [...SEED_HITS, ...LOCAL_HITS];
  
  // Update area panel stats
  const panelDiv = document.querySelector('.area-panel');
  if (panelDiv) {
    updateAreaPanel(panelDiv, DEFAULT_CITY);
  }
  
  showMatrixMessage('SEED BOMB LOCATION RECORDED');
}

/* === double-click-to-plant ============================================= */
map.on("dblclick", e => {
  if (!map.getBounds().contains(e.latlng)) return;

  const icon = ICONS[DEFAULT_TYPE];
  const m = L.marker(e.latlng, { icon, draggable: true }).addTo(markerLayer);
  const id = `EDM-${Date.now()}`;
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  
  m.bindPopup(`
    <form id="f-${id}" class="hit-form">
      <input name="label" placeholder="Location Label" required /><br>
      <textarea name="notes" rows="2" placeholder="Mission Notes"></textarea><br>
      <select name="mtype">
        <option value="potential">Seed Potential</option>
        <option value="confirmed">Confirmed Growth</option>
        <option value="danger">High Danger</option>
        <option value="breach">Great Breach Spot</option>
      </select><br>
      <button type="submit">RECORD IN THE MATRIX</button>
    </form>`).openPopup();

  m.once("popupopen", () => {
    const f = document.getElementById(`f-${id}`);
    f.addEventListener("submit", ev => {
      ev.preventDefault();
      const formData = new FormData(f);
      const hit = {
        id: id,
        city: DEFAULT_CITY,
        mtype: formData.get('mtype') || DEFAULT_TYPE,
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        label: formData.get('label'),
        date: today,
        notes: formData.get('notes')
      };
      
      const newIcon = ICONS[hit.mtype] || ICONS[DEFAULT_TYPE];
      m.setIcon(newIcon)
       .bindPopup(createPopupContent(hit))
       .openPopup();
      
      // Update the marker element with the correct class
      const element = m.getElement();
      if (element) {
        // Remove previous type classes
        element.classList.remove('marker-potential', 'marker-confirmed', 'marker-danger', 'marker-breach');
        // Add new type class
        element.classList.add(`marker-${hit.mtype}`);
        
        // Add right-click handler for deletion
        element.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          handleMarkerRightClick(m, hit);
        });
      }
      
      saveHit(hit);
    });
  });
});

/* Add click listener to handle delete buttons in popups */
document.addEventListener('click', function(e) {
  if (e.target && e.target.classList.contains('delete-hit-btn')) {
    const hitId = e.target.getAttribute('data-hit-id');
    if (hitId) {
      // Find and remove the marker
      markerLayer.eachLayer(layer => {
        if (layer.options.hitId === hitId) {
          map.removeLayer(layer);
        }
      });
      
      deleteHit(hitId);
      map.closePopup();
    }
  }
});

/* === keyboard shortcuts =============================================== */
document.addEventListener('keydown', (e) => {
  // ESCAPE key closes any open dialogs
  if (e.key === 'Escape') {
    const dialogs = document.querySelectorAll('.delete-confirmation');
    dialogs.forEach(dialog => dialog.remove());
  }
});

/* === kick-off ========================================================= */
createMatrixRain(); // Initialize the Matrix rain effect
createStatusPanel(); // Add status panel
initCity(DEFAULT_CITY);

// Add Matrix typing sound on user interactions
document.addEventListener('click', () => {
  const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3');
  audio.volume = 0.05;
  audio.play().catch(() => {});
});