// H2O - Main Orchestration & Application UI
import './style.css';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
  BarController,
  BarElement
} from 'chart.js';
import confetti from 'canvas-confetti';
import { PRESET_LOCATIONS, analyzeGroundwater } from './data/groundwaterEngine.js';
import { REGIONAL_GAZETTEER, QUICK_SEARCH_REGIONS, searchLocalGazetteer } from './data/placesGazetteer.js';
import { MapManager } from './components/mapManager.js';
import { calculateBorewellCost } from './components/costCalculator.js';
import { renderFullReportHtml } from './components/reportGenerator.js';

// Register Chart.js components
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
  BarController,
  BarElement
);

// Application State
const state = {
  currentLat: 12.42447,
  currentLng: 76.23050,
  locationLabel: 'Your Location (12°25\'28"N 76°13\'50"E)',
  unit: 'ft', // 'ft' or 'm'
  currency: 'INR', // 'INR' or 'USD'
  calcDepthFt: 250,
  calcCasingFt: 45,
  calcCasingType: 'medium_1_8mm',
  calcPumpHp: 3,
  currentData: null,
  hydrographChart: null,
  mapManager: null,
  showBorewells: true,
  showFractures: true,
  showProspect: true
};

// Initial App Shell HTML
function renderAppShell() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <!-- Top Navigation Header -->
    <header class="app-header">
      <div class="brand-section">
        <div class="brand-logo-wrap">💧</div>
        <div class="brand-text">
          <h1>H2O <span class="brand-tag">v2.4 AI PRO</span></h1>
          <p class="brand-sub">Groundwater Availability & Borewell Intelligence System</p>
        </div>
      </div>

      <div class="header-actions">
        <div class="search-box-wrap">
          <div class="search-input-shell">
            <svg class="search-prefix-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              id="location-search" 
              class="search-input" 
              placeholder="Search village, town, taluk, district, or GPS (e.g. 12.524, 76.896)..." 
              autocomplete="off"
              spellcheck="false"
            />
            <div id="search-spinner" class="search-spinner"></div>
            <button id="btn-search-clear" class="search-clear-btn" title="Clear search" aria-label="Clear">✕</button>
          </div>

          <button class="btn-search-submit" id="btn-search-submit" title="Search Location" type="button">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span>Search</span>
          </button>

          <div id="search-suggestions" class="search-suggestions"></div>
        </div>

        <select id="preset-selector" class="preset-select" aria-label="Select benchmark location">
          <option value="">⚡ Benchmark Regions</option>
          ${PRESET_LOCATIONS.map(p => `
            <option value="${p.id}">${p.name} (${p.potential})</option>
          `).join('')}
        </select>
      </div>

      <div class="header-controls">
        <div class="btn-toggle-view" id="view-mode-toggle" title="Switch Workspace Layout">
          <button class="view-btn active" data-mode="split" title="Split Screen (Map + Dashboard)">◧ Split</button>
          <button class="view-btn" data-mode="dashboard" title="Full Width Dashboard">📄 Full Report</button>
          <button class="view-btn" data-mode="map" title="Full Screen Map">🗺️ Map</button>
        </div>

        <div class="btn-toggle-unit" id="unit-toggle" title="Toggle Depth Unit">
          <span class="unit-opt active" data-unit="ft">Feet</span>
          <span class="unit-opt" data-unit="m">Meters</span>
        </div>

        <button class="btn-locate" id="btn-gps" title="Find Current GPS Location">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
          </svg>
          <span>Locate GPS</span>
        </button>

        <button class="btn-cost-calc" id="btn-open-cost" title="Calculate Drilling Project Cost">
          <span>💰 Cost Estimator</span>
        </button>

        <button class="btn-report" id="btn-open-report" title="Generate Official Hydrogeological Report">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <span>Dossier Report</span>
        </button>
      </div>
    </header>

    <!-- Main Workspace Layout -->
    <main class="main-layout">
      <!-- Left Map Section -->
      <section class="map-pane">
        <!-- Floating Layer & Overlays Bar -->
        <div class="map-floating-bar">
          <div class="map-control-card">
            <span style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">BASEMAP:</span>
            <div class="map-layer-btn-group" id="layer-selector">
              <button class="layer-btn active" data-layer="satellite">🛰️ Satellite</button>
              <button class="layer-btn" data-layer="dark">🗺️ Dark Tech</button>
              <button class="layer-btn" data-layer="topo">⛰️ Topo</button>
              <button class="layer-btn" data-layer="streets">🛣️ Street</button>
            </div>
          </div>

          <div class="map-control-card">
            <div class="map-overlay-toggles">
              <label class="toggle-label">
                <input type="checkbox" id="toggle-wells" checked />
                <span>🚰 Borewells</span>
              </label>
              <label class="toggle-label">
                <input type="checkbox" id="toggle-fractures" checked />
                <span>⚡ Fault Fissures</span>
              </label>
              <label class="toggle-label">
                <input type="checkbox" id="toggle-prospect" checked />
                <span>🌊 Recharge Belt</span>
              </label>
            </div>
          </div>

          <div class="map-control-card map-hint-card">
            <span class="map-hint-text">📍 Click anywhere on map or drag crosshair to analyze</span>
          </div>
        </div>

        <!-- Leaflet Map Container -->
        <div id="map-container"></div>

        <!-- Hydrogeological Map Legend Overlay -->
        <div class="map-legend-overlay" id="map-legend">
          <div class="legend-header">🗺️ HYDRO-PROSPECT LAYERS (CGWB)</div>
          <div class="legend-content">
            <div class="legend-row">
              <span class="legend-badge-color" style="background: rgba(16, 185, 129, 0.5); border: 1.5px solid #10b981;"></span>
              <span><strong>Active Valley Recharge Belt</strong> (&gt;200 mm/yr)</span>
            </div>
            <div class="legend-row">
              <span class="legend-badge-color" style="background: rgba(0, 242, 254, 0.4); border: 1.5px dashed #00f2fe;"></span>
              <span><strong>Pediplain Fracture Infiltration</strong> (100–200 mm/yr)</span>
            </div>
            <div class="legend-row">
              <span class="legend-badge-color" style="background: rgba(244, 63, 94, 0.4); border: 1.5px dashed #f43f5e;"></span>
              <span><strong>Critical Depleted / Over-Exploited</strong> (&lt;80 mm/yr)</span>
            </div>
            <div class="legend-row">
              <span class="legend-line" style="border-top: 2px dashed #38bdf8;"></span>
              <span><strong>Subsurface Fault Fissure Lineament</strong></span>
            </div>
          </div>
        </div>
      </section>

      <!-- Right Hydrogeological Intelligence Dashboard -->
      <section class="dashboard-pane" id="dashboard-content">
        <!-- Will be populated dynamically by updateDashboard() -->
      </section>
    </main>

    <!-- Borewell Cost Estimator Modal -->
    <div class="modal-backdrop" id="cost-modal">
      <div class="modal-box">
        <div class="modal-header">
          <h3>💰 Borewell Drilling & Equipment Cost Estimator</h3>
          <button class="modal-close-btn" id="close-cost-modal">&times;</button>
        </div>
        <div class="modal-body" id="cost-modal-body">
          <!-- Filled dynamically -->
        </div>
      </div>
    </div>

    <!-- Official Report Dossier Modal -->
    <div class="modal-backdrop" id="report-modal">
      <div class="modal-box" style="max-width: 900px;">
        <div class="modal-header">
          <h3>📄 Hydrogeological Feasibility & Drilling Assessment Report</h3>
          <div style="display: flex; gap: 10px; align-items: center;">
            <button class="btn-report" id="btn-print-report" style="padding: 6px 14px;">
              🖨️ Print / Save PDF
            </button>
            <button class="modal-close-btn" id="close-report-modal">&times;</button>
          </div>
        </div>
        <div class="modal-body" id="report-modal-body" style="padding: 0; background: #fff;">
          <!-- Filled dynamically -->
        </div>
      </div>
    </div>
  `;
}

// Format Depth string according to active unit (ft or m)
function fmtDepth(feetVal, unit = state.unit) {
  if (Array.isArray(feetVal)) {
    if (unit === 'm') {
      const m1 = (feetVal[0] * 0.3048).toFixed(0);
      const m2 = (feetVal[1] * 0.3048).toFixed(0);
      return `${m1} - ${m2} m`;
    }
    return `${feetVal[0]} - ${feetVal[1]} ft`;
  }
  if (unit === 'm') {
    return `${(feetVal * 0.3048).toFixed(0)} m`;
  }
  return `${feetVal} ft`;
}

function altDepth(feetVal, unit = state.unit) {
  if (Array.isArray(feetVal)) {
    if (unit === 'm') {
      return `(${feetVal[0]} - ${feetVal[1]} ft)`;
    }
    const m1 = (feetVal[0] * 0.3048).toFixed(1);
    const m2 = (feetVal[1] * 0.3048).toFixed(1);
    return `(${m1} - ${m2} m)`;
  }
  if (unit === 'm') {
    return `(${feetVal} ft)`;
  }
  return `(${(feetVal * 0.3048).toFixed(1)} m)`;
}

// Update Right Dashboard Pane
function updateDashboard(data) {
  state.currentData = data;
  state.calcDepthFt = data.recommendedDepthFt;
  state.calcCasingFt = data.casingDepthFt;

  const dashboard = document.getElementById('dashboard-content');
  if (!dashboard) return;
  dashboard.scrollTop = 0;

  const isHigh = data.probability >= 72;
  const isLow = data.probability < 50;
  const statusClass = isHigh ? 'high' : isLow ? 'low' : 'mod';
  const statusColor = isHigh ? '#10b981' : isLow ? '#f43f5e' : '#f59e0b';

  // SVG Gauge calculations (circumference = 2 * PI * r = 2 * 3.14159 * 52 = 326.7)
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (data.probability / 100) * circumference;

  dashboard.innerHTML = `
    <!-- Full Report Hero Header (Visible in Full Report Mode) -->
    <div class="full-report-header-banner" id="full-report-top-banner">
      <div class="full-report-banner-left">
        <div class="report-badge-pill">OFFICIAL HYDROGEOLOGICAL FEASIBILITY REPORT</div>
        <h2 class="full-report-banner-title">${data.locationName}</h2>
        <div class="full-report-banner-meta">
          <span>📍 ${data.lat.toFixed(5)}° N, ${data.lng.toFixed(5)}° E</span>
          <span>•</span>
          <span>${data.terrainDescription}</span>
          <span>•</span>
          <span style="color:var(--cyan-glow); font-weight:700;">${data.potentialCategory} Potential (${data.probability}%)</span>
        </div>
      </div>
      <div class="full-report-banner-actions">
        <button class="btn-dossier-action view-dossier" id="btn-banner-view-dossier" type="button" title="View formatted official dossier">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <span>Official Dossier Document</span>
        </button>
        <button class="btn-dossier-action print" id="btn-banner-print-pdf" type="button" title="Print or save as PDF">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
          </svg>
          <span>Print / Save PDF</span>
        </button>
      </div>
    </div>

    <!-- Quick-Jump Section Navigation Strip -->
    <div class="dashboard-quick-nav">
      <button class="quick-nav-pill active" onclick="document.getElementById('sec-overview')?.scrollIntoView({ behavior: 'smooth', block: 'start' })">🎯 Overview</button>
      <button class="quick-nav-pill" onclick="document.getElementById('sec-depths')?.scrollIntoView({ behavior: 'smooth', block: 'start' })">📏 Depths</button>
      <button class="quick-nav-pill" onclick="document.getElementById('sec-recharge')?.scrollIntoView({ behavior: 'smooth', block: 'start' })">🌊 Recharge</button>
      <button class="quick-nav-pill" onclick="document.getElementById('sec-strata')?.scrollIntoView({ behavior: 'smooth', block: 'start' })">🪨 Strata</button>
      <button class="quick-nav-pill" onclick="document.getElementById('sec-hydrograph')?.scrollIntoView({ behavior: 'smooth', block: 'start' })">📈 Hydrograph</button>
      <button class="quick-nav-pill" onclick="document.getElementById('sec-wells')?.scrollIntoView({ behavior: 'smooth', block: 'start' })">🚰 Wells</button>
      <button class="quick-nav-pill" onclick="document.getElementById('sec-advice')?.scrollIntoView({ behavior: 'smooth', block: 'start' })">🤖 AI Advice</button>
    </div>

    <!-- Target Overview Hero Card -->
    <div class="overview-card" id="sec-overview">
      <div class="location-top-bar">
        <div class="loc-title-group">
          <h2>${data.locationName}</h2>
          <div class="loc-coords">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>${data.lat.toFixed(5)}° N, ${data.lng.toFixed(5)}° E</span>
          </div>
          <div class="loc-terrain">${data.terrainDescription} • <strong>${data.rockType}</strong></div>
        </div>
        <div class="status-badge ${statusClass}">
          <span>● ${data.potentialCategory} Potential</span>
        </div>
      </div>

      <div class="potential-gauge-row">
        <div class="gauge-circular">
          <svg class="gauge-svg" viewBox="0 0 120 120">
            <circle class="gauge-bg" cx="60" cy="60" r="${radius}"></circle>
            <circle 
              class="gauge-fill" 
              cx="60" 
              cy="60" 
              r="${radius}" 
              stroke="${statusColor}"
              stroke-dasharray="${circumference}" 
              stroke-dashoffset="${offset}"
            ></circle>
          </svg>
          <div class="gauge-center-text">
            <span class="gauge-percent">${data.probability}%</span>
            <span class="gauge-caption">Chance</span>
          </div>
        </div>

        <div class="gauge-insights">
          <div class="gauge-headline">
            ${isHigh 
              ? '✨ Prime Groundwater Formation Detected' 
              : isLow 
              ? '⚠️ Deep Crystalline Rock / Depleted Aquifer' 
              : '⚡ Favorable Fissure Secondary Porosity'}
          </div>
          <p class="gauge-detail">
            ${isHigh 
              ? 'Multiple permeable fracture intersections and active recharge zone. High probability of striking productive perennial water yield.'
              : isLow 
              ? 'High risk of dry or low-discharge borehole in shallow horizons. Deep pneumatic DTH hammer drilling required to tap confined fractures.'
              : 'Moderate strike potential. Water occurrence is controlled by localized quartz veins and joints in the bedrock.'}
          </p>
          <div class="confidence-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 14 14"></polyline>
            </svg>
            <span>Data Confidence: <strong>${data.confidenceScore}</strong></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Predicted Drilling Depths Grid -->
    <div class="depths-grid-section" id="sec-depths">
      <!-- First Strike -->
      <div class="depth-stat-card">
        <div class="depth-card-header">
          <span>💧 1st Water Strike</span>
        </div>
        <div class="depth-card-val">${fmtDepth(data.firstStrikeFt)}</div>
        <div class="depth-card-alt">${altDepth(data.firstStrikeFt)}</div>
        <div class="depth-card-sub">Shallow weathered seepage horizon (300–800 GPH)</div>
      </div>

      <!-- Main Strike -->
      <div class="depth-stat-card featured">
        <div class="depth-card-header">
          <span>💎 Major Aquifer Strike</span>
        </div>
        <div class="depth-card-val">${fmtDepth(data.majorStrikeFt)}</div>
        <div class="depth-card-alt">${altDepth(data.majorStrikeFt)}</div>
        <div class="depth-card-sub">Primary fracture zone with expected ${data.yieldInches} yield</div>
      </div>

      <!-- Required Casing -->
      <div class="depth-stat-card">
        <div class="depth-card-header">
          <span>🛡️ Casing Depth</span>
        </div>
        <div class="depth-card-val">${fmtDepth(data.casingDepthFt)}</div>
        <div class="depth-card-alt">${altDepth(data.casingDepthFt)}</div>
        <div class="depth-card-sub">Drive 5ft into hard rock to seal loose silt & boulders</div>
      </div>

      <!-- Recommended Cutoff -->
      <div class="depth-stat-card">
        <div class="depth-card-header">
          <span>🛑 Max Drill Depth</span>
        </div>
        <div class="depth-card-val">${fmtDepth(data.recommendedDepthFt)}</div>
        <div class="depth-card-alt">${altDepth(data.recommendedDepthFt)}</div>
        <div class="depth-card-sub">Cease drilling beyond this; impermeable basement rock</div>
      </div>
    </div>

    <!-- Groundwater Recharge Belt & Watershed Infiltration Intelligence -->
    <div class="section-panel recharge-panel" id="sec-recharge">
      <div class="section-head">
        <h3>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${data.rechargeData ? data.rechargeData.color : 'var(--cyan-glow)'}" stroke-width="2">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
          </svg>
          Groundwater Recharge & Watershed Hydro-Dynamics
        </h3>
        <span class="section-tag">Bhuvan-Bhujal (NRSC) & CGWB Intelligence</span>
      </div>

      <div class="recharge-card ${data.rechargeData ? data.rechargeData.statusClass : 'safe'}">
        <div class="recharge-card-header">
          <div class="recharge-title-wrap">
            <div class="recharge-title">${data.rechargeData ? data.rechargeData.zoneTitle : 'Regional Infiltration Belt'}</div>
            <div class="recharge-sub-wrap">
              <span class="recharge-status-badge ${data.rechargeData ? data.rechargeData.statusClass : 'safe'}">
                ● ${data.rechargeData ? data.rechargeData.cgwbStatus : 'Evaluating Aquifer Recharge'}
              </span>
              <span class="recharge-setting-badge">
                📍 ${data.rechargeData ? data.rechargeData.boreholeSetting : 'Site Location'}
              </span>
            </div>
          </div>
          <div class="recharge-rate-display">
            <span class="recharge-rate-number">${data.rechargeData ? data.rechargeData.infiltrationRateMmYr : 200} mm/yr</span>
            <span class="recharge-rate-label">Annual Aquifer Infiltration</span>
          </div>
        </div>

        <p class="recharge-description-p">${data.rechargeData ? data.rechargeData.beltSummary : ''}</p>

        <!-- Watershed Rainfall Partitioning Visualizer -->
        <div class="partition-container">
          <div class="partition-title-row">
            <span>🌧️ Monsoon Precipitation Partitioning (Water Balance)</span>
            <span>Annual Rain: <strong>${data.seasonalTrend ? data.seasonalTrend.annualRainfallMm[4] : 850} mm</strong></span>
          </div>
          <div class="partition-stacked-bar">
            <div class="partition-segment seg-infil" style="width: ${data.rechargeData ? data.rechargeData.infiltrationPct : 25}%;" title="Infiltration into Aquifer">
              <span>💧 Infiltration ${data.rechargeData ? data.rechargeData.infiltrationPct : 25}%</span>
            </div>
            <div class="partition-segment seg-runoff" style="width: ${data.rechargeData ? data.rechargeData.runoffPct : 45}%;" title="Surface Runoff Loss">
              <span>🌊 Runoff ${data.rechargeData ? data.rechargeData.runoffPct : 45}%</span>
            </div>
            <div class="partition-segment seg-evap" style="width: ${data.rechargeData ? data.rechargeData.evapotranspirationPct : 30}%;" title="Evapotranspiration">
              <span>☀️ Evap ${data.rechargeData ? data.rechargeData.evapotranspirationPct : 30}%</span>
            </div>
          </div>
        </div>

        <div class="recharge-specs-grid">
          <div class="recharge-spec-item">
            <span class="spec-label">Soil Infiltration Permeability</span>
            <span class="spec-value">${data.rechargeData ? data.rechargeData.soilPermeability : 'Moderate'}</span>
          </div>
          <div class="recharge-spec-item">
            <span class="spec-label">Subsurface Hydraulic Gradient</span>
            <span class="spec-value">${data.rechargeData ? data.rechargeData.flowDirection : 'Natural'}</span>
          </div>
          <div class="recharge-spec-item full-span">
            <span class="spec-label">🛠️ Recommended Artificial Recharge Engineering</span>
            <span class="spec-value advice-hl">${data.rechargeData ? data.rechargeData.artificialAdvice : ''}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Subsurface Stratigraphic Cross-Section Visualizer -->
    <div class="section-panel" id="sec-strata">
      <div class="section-head">
        <h3>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cyan-glow)" stroke-width="2">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
          Subsurface Geological Strata Column
        </h3>
        <span class="section-tag">Interactive Subterranean Cross-Section</span>
      </div>

      <div class="strata-visual-container">
        ${data.strata.map(s => `
          <div class="strata-layer-bar ${s.waterPresent ? 'water-active' : ''}">
            <div class="strata-depth-col">
              ${state.unit === 'm' ? s.depthM : s.depthFt}
            </div>
            <div class="strata-name-col">
              <div class="strata-name-title">
                <span style="display:inline-block; width:10px; height:10px; border-radius:2px; background:${s.color};"></span>
                ${s.name}
              </div>
              <div class="strata-desc">${s.notes}</div>
            </div>
            <div class="strata-status-col">
              ${s.waterPresent ? `<span class="badge-water-strike">💧 ${s.waterStrikeDepthFt ? fmtDepth(s.waterStrikeDepthFt) : 'Aquifer'}</span>` : ''}
              ${s.isCased ? `<span class="badge-cased">Cased Pipe</span>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Historical Seasonal Hydrograph Chart -->
    <div class="section-panel" id="sec-hydrograph">
      <div class="section-head">
        <h3>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cyan-glow)" stroke-width="2">
            <line x1="18" y1="20" x2="18" y2="10"></line>
            <line x1="12" y1="20" x2="12" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
          </svg>
          Seasonal Groundwater Trends & Rainfall (5-Year Hydrograph)
        </h3>
        <span class="section-tag">CGWB / India-WRIS Records</span>
      </div>

      <div class="chart-container-wrap">
        <canvas id="hydrograph-canvas"></canvas>
      </div>
      <div class="chart-trend-note">
        <strong>Recharge Evaluation:</strong> ${data.seasonalTrend.trendSummary}
      </div>
    </div>

    <!-- Nearby Registered Borewell Records -->
    <div class="section-panel" id="sec-wells">
      <div class="section-head">
        <h3>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--cyan-glow)" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 8v8M8 12h8"></path>
          </svg>
          Nearby Field Borewells (${data.nearbyWells.length} Records)
        </h3>
        <span class="section-tag">Recorded Depths & Actual Discharge</span>
      </div>

      <div class="nearby-wells-grid">
        ${data.nearbyWells.map(w => `
          <div class="well-card-mini">
            <div class="well-top">
              <span class="well-id">${w.id}</span>
              <span class="well-dist">${w.distance}</span>
            </div>
            <div class="well-stats-row">
              <span>Total Depth: <strong>${fmtDepth(w.totalDepthFt)}</strong></span>
              <span>Water Strike: <strong>${fmtDepth(w.strikeDepthFt)}</strong></span>
            </div>
            <div class="well-stats-row">
              <span>Discharge: <strong class="well-yield-hl">${w.yieldInches}</strong> (${w.yieldGph} GPH)</span>
              <span>SWL: <strong>${fmtDepth(w.staticWaterLevelFt)}</strong></span>
            </div>
            <div style="font-size: 0.68rem; color: var(--text-dim); display:flex; justify-content:space-between;">
              <span>${w.status}</span>
              <span>Drilled: ${w.yearDrilled}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Plain-Language AI Hydrogeological Narrative & Field Advice -->
    <div class="ai-summary-card" id="sec-advice">
      <div class="ai-header">
        <div class="ai-icon-pill">🧠</div>
        <div>
          <div class="ai-title">Hydrogeological AI Synthesis & Contractor Guidelines</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">Plain-language analysis for landowners, farmers & drillers</div>
        </div>
      </div>

      <div class="ai-narrative-text">
        ${data.aiInsights.hydroSummary}
      </div>

      <div class="driller-advice-grid">
        <div class="driller-advice-item">
          <strong>🚜 Recommended Drilling Rig</strong>
          <span>${data.aiInsights.rigAdvice}</span>
        </div>
        <div class="driller-advice-item">
          <strong>📅 Optimal Drilling Season</strong>
          <span>${data.aiInsights.bestSeason}</span>
        </div>
        <div class="driller-advice-item">
          <strong>🛡️ Casing Standard</strong>
          <span>${data.aiInsights.casingAdvice}</span>
        </div>
        <div class="driller-advice-item">
          <strong>🌧️ Artificial Aquifer Recharge</strong>
          <span>${data.aiInsights.rechargeRecommendation}</span>
        </div>
      </div>
    </div>

    <!-- Water Quality & Chemistry Strip -->
    <div class="section-panel" style="padding: 14px 18px;">
      <div class="section-head" style="margin-bottom: 8px;">
        <h3>🧪 Water Quality & Chemical Parameters</h3>
        <span class="section-tag">Aquifer Potability</span>
      </div>
      <div class="water-quality-strip">
        <div class="wq-card">
          <span class="wq-label">Total Dissolved Solids (TDS)</span>
          <span class="wq-val">${data.tdsMgL} mg/L</span>
        </div>
        <div class="wq-card">
          <span class="wq-label">Quality Status</span>
          <span class="wq-val" style="color: ${data.tdsMgL < 500 ? 'var(--emerald-accent)' : 'var(--amber-accent)'};">
            ${data.waterQuality}
          </span>
        </div>
        <div class="wq-card">
          <span class="wq-label">Static Water Table (SWL)</span>
          <span class="wq-val">${fmtDepth(data.staticWaterLevelFt)} bgl</span>
        </div>
      </div>
    </div>

    <!-- Statutory Disclaimer -->
    <div class="disclaimer-banner">
      <strong>⚠️ Statutory Hydrogeological Advisory:</strong> A map-based estimate provides regional evidence and hydrogeological probability, but cannot guarantee water at every micro-spot due to subterranean fractures varying over 10–30 meters. We recommend commissioning a qualified hydrogeologist for a <strong>Vertical Electrical Sounding (VES) Resistivity Survey</strong> on your specific plot before drilling.
    </div>
  `;

  // Ensure dashboard starts at top
  dashboard.scrollTop = 0;

  // Banner action button events
  const bannerViewBtn = document.getElementById('btn-banner-view-dossier');
  if (bannerViewBtn) {
    bannerViewBtn.addEventListener('click', () => {
      document.getElementById('btn-open-report')?.click();
    });
  }
  const bannerPrintBtn = document.getElementById('btn-banner-print-pdf');
  if (bannerPrintBtn) {
    bannerPrintBtn.addEventListener('click', () => {
      updateReportModalUI();
      window.print();
    });
  }

  // Initialize or update Chart.js
  try {
    initHydrographChart(data.seasonalTrend);
  } catch (chartErr) {
    console.warn('[H2O] Chart init:', chartErr);
  }
}

// Chart.js Seasonal Hydrograph
function initHydrographChart(seasonalData) {
  const canvas = document.getElementById('hydrograph-canvas');
  if (!canvas) return;

  if (state.hydrographChart) {
    state.hydrographChart.destroy();
  }

  const ctx = canvas.getContext('2d');

  // Convert depths if meters
  const mult = state.unit === 'm' ? 0.3048 : 1;
  const unitLabel = state.unit === 'm' ? 'Meters bgl' : 'Feet bgl';

  const preLevels = seasonalData.preMonsoonLevels.map(v => Number((v * mult).toFixed(1)));
  const postLevels = seasonalData.postMonsoonLevels.map(v => Number((v * mult).toFixed(1)));

  state.hydrographChart = new Chart(ctx, {
    data: {
      labels: seasonalData.labels,
      datasets: [
        {
          type: 'line',
          label: `Post-Monsoon Water Table (${unitLabel})`,
          data: postLevels,
          borderColor: '#00f2fe',
          backgroundColor: 'rgba(0, 242, 254, 0.1)',
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#00f2fe',
          pointRadius: 4,
          yAxisID: 'y'
        },
        {
          type: 'line',
          label: `Pre-Monsoon Peak Summer (${unitLabel})`,
          data: preLevels,
          borderColor: '#f59e0b',
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          tension: 0.35,
          pointBackgroundColor: '#f59e0b',
          pointRadius: 4,
          yAxisID: 'y'
        },
        {
          type: 'bar',
          label: 'Annual Rainfall (mm)',
          data: seasonalData.annualRainfallMm,
          backgroundColor: 'rgba(56, 189, 248, 0.25)',
          borderRadius: 4,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: '#94a3b8',
            font: { family: 'Inter', size: 11 },
            boxWidth: 12
          }
        },
        tooltip: {
          backgroundColor: 'rgba(5, 10, 23, 0.95)',
          titleColor: '#00f2fe',
          bodyColor: '#ffffff',
          borderColor: 'rgba(56, 189, 248, 0.3)',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#94a3b8', font: { family: 'Space Mono', size: 10 } }
        },
        y: {
          type: 'linear',
          position: 'left',
          reverse: true, // deeper water table is lower down
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          ticks: { color: '#94a3b8', font: { family: 'Space Mono', size: 10 } },
          title: {
            display: true,
            text: `Water Level (${unitLabel} - Depth)`,
            color: '#64748b',
            font: { size: 10 }
          }
        },
        y1: {
          type: 'linear',
          position: 'right',
          grid: { drawOnChartArea: false },
          ticks: { color: '#38bdf8', font: { family: 'Space Mono', size: 10 } },
          title: {
            display: true,
            text: 'Rainfall (mm)',
            color: '#38bdf8',
            font: { size: 10 }
          }
        }
      }
    }
  });
}

// Update Cost Calculator Modal UI
function updateCostModalUI() {
  const container = document.getElementById('cost-modal-body');
  if (!container || !state.currentData) return;

  const cost = calculateBorewellCost({
    depthFt: state.calcDepthFt,
    casingFt: state.calcCasingFt,
    casingType: state.calcCasingType,
    pumpHp: state.calcPumpHp,
    currency: state.currency
  });

  container.innerHTML = `
    <div class="calc-controls-grid">
      <div class="control-field">
        <label>Total Target Depth: <span class="slider-val" id="disp-depth">${state.calcDepthFt} ft</span></label>
        <div class="range-slider-wrap">
          <input type="range" id="slider-depth" min="100" max="1500" step="25" value="${state.calcDepthFt}" />
        </div>
      </div>

      <div class="control-field">
        <label>Casing Pipe Length: <span class="slider-val" id="disp-casing">${state.calcCasingFt} ft</span></label>
        <div class="range-slider-wrap">
          <input type="range" id="slider-casing" min="20" max="250" step="5" value="${state.calcCasingFt}" />
        </div>
      </div>

      <div class="control-field">
        <label>Casing Pipe Quality & Specification</label>
        <select class="calc-select" id="select-casing-type">
          <option value="low_1_6mm" ${state.calcCasingType === 'low_1_6mm' ? 'selected' : ''}>Low quality casing (1.6mm) 39KG — ₹300/ft</option>
          <option value="medium_1_8mm" ${state.calcCasingType === 'medium_1_8mm' || state.calcCasingType === 'pvc' ? 'selected' : ''}>Medium quality casing (1.8mm) 45KG — ₹380/ft</option>
          <option value="high_2mm" ${state.calcCasingType === 'high_2mm' || state.calcCasingType === 'ms' ? 'selected' : ''}>High quality casing (2mm) 50KG — ₹480/ft</option>
          <option value="ga_2mm" ${state.calcCasingType === 'ga_2mm' ? 'selected' : ''}>GA (2mm) — ₹750/ft</option>
        </select>
      </div>

      <div class="control-field">
        <label>Submersible Pump Rating</label>
        <select class="calc-select" id="select-pump-hp">
          <option value="2" ${state.calcPumpHp === 2 ? 'selected' : ''}>2.0 HP (Shallow wells < 200 ft)</option>
          <option value="3" ${state.calcPumpHp === 3 ? 'selected' : ''}>3.0 HP (Standard 200 - 450 ft)</option>
          <option value="5" ${state.calcPumpHp === 5 ? 'selected' : ''}>5.0 HP (Deep hard rock 450 - 750 ft)</option>
          <option value="7.5" ${state.calcPumpHp === 7.5 ? 'selected' : ''}>7.5 HP (Very deep 750+ ft)</option>
        </select>
      </div>
    </div>

    <div style="display: flex; justify-content: flex-end; margin-bottom: 14px; gap: 8px;">
      <button class="btn-toggle-unit" id="currency-toggle">
        <span class="curr-opt ${state.currency === 'INR' ? 'active' : ''}" data-curr="INR">₹ INR</span>
        <span class="curr-opt ${state.currency === 'USD' ? 'active' : ''}" data-curr="USD">$ USD</span>
      </button>
    </div>

    <div class="cost-total-banner">
      <div>
        <span style="font-size:0.85rem; color:var(--text-muted); display:block;">Estimated Project Investment</span>
        <span class="cost-grand-val">${cost.symbol}${cost.total.toLocaleString()}</span>
      </div>
      <div style="text-align: right; font-size: 0.8rem; color: #94a3b8;">
        Target: <strong>${state.calcDepthFt} ft</strong> drilling (@ ₹110/ft) • <strong>${state.calcCasingFt} ft</strong> casing (${cost.selectedCasing?.shortName || ''})
      </div>
    </div>

    <table class="cost-table">
      <thead>
        <tr>
          <th>Line Item Breakdown</th>
          <th>Specification</th>
          <th style="text-align:right;">Estimated Amount</th>
        </tr>
      </thead>
      <tbody>
        ${cost.breakdown.map(item => `
          <tr>
            <td><strong>${item.item}</strong></td>
            <td style="color:var(--text-muted);">${item.detail}</td>
            <td style="text-align:right; color:#ffffff; font-weight:700;">${cost.symbol}${item.amount.toLocaleString()}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  // Attach event listeners inside cost modal
  document.getElementById('slider-depth').addEventListener('input', (e) => {
    state.calcDepthFt = Number(e.target.value);
    document.getElementById('disp-depth').textContent = `${state.calcDepthFt} ft`;
    updateCostModalUI();
  });

  document.getElementById('slider-casing').addEventListener('input', (e) => {
    state.calcCasingFt = Number(e.target.value);
    document.getElementById('disp-casing').textContent = `${state.calcCasingFt} ft`;
    updateCostModalUI();
  });

  document.getElementById('select-casing-type').addEventListener('change', (e) => {
    state.calcCasingType = e.target.value;
    updateCostModalUI();
  });

  document.getElementById('select-pump-hp').addEventListener('change', (e) => {
    state.calcPumpHp = Number(e.target.value);
    updateCostModalUI();
  });

  document.getElementById('currency-toggle').addEventListener('click', (e) => {
    const opt = e.target.closest('.curr-opt');
    if (opt) {
      state.currency = opt.dataset.curr;
      updateCostModalUI();
    }
  });
}

// Update Report Modal UI
function updateReportModalUI() {
  const container = document.getElementById('report-modal-body');
  if (!container) return;

  if (!state.currentData) {
    state.currentData = analyzeGroundwater(state.currentLat, state.currentLng, state.locationLabel);
  }

  const cost = calculateBorewellCost({
    depthFt: state.calcDepthFt,
    casingFt: state.calcCasingFt,
    casingType: state.calcCasingType,
    pumpHp: state.calcPumpHp,
    currency: state.currency
  });

  container.innerHTML = renderFullReportHtml(state.currentData, cost);
}

// Convert DMS (Degrees Minutes Seconds) to decimal degrees
function dmsToDecimal(deg, min, sec, dir) {
  let decimal = parseFloat(deg) + parseFloat(min) / 60 + parseFloat(sec) / 3600;
  if (dir && (dir.toUpperCase() === 'S' || dir.toUpperCase() === 'W')) {
    decimal = -decimal;
  }
  return decimal;
}

// Helper to parse GPS coordinates from various string formats
function parseCoordinates(str) {
  if (!str) return null;
  const clean = str.trim();

  // ── DMS Format: 12*25'28.1"N 76*13'49.8"E  (asterisk as degree symbol)
  // Also handles: 12°25'28.1"N, 76°13'49.8"E  or  12 25 28.1 N 76 13 49.8 E
  const dmsRe = /(\d+)[*°\s](\d+)['\s](\d+(?:\.\d+)?)["\s]*([NSns])[,;\s]+(\d+)[*°\s](\d+)['\s](\d+(?:\.\d+)?)["\s]*([EWew])/;
  const md = clean.replace(/[^\d\s°'"*.,NSEW]/gi, ' ').match(dmsRe) || clean.match(dmsRe);
  if (md) {
    const lat = dmsToDecimal(md[1], md[2], md[3], md[4]);
    const lng = dmsToDecimal(md[5], md[6], md[7], md[8]);
    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return { lat, lng, name: `GPS Point (${lat.toFixed(5)}, ${lng.toFixed(5)})` };
    }
  }

  // ── DMS with only Degrees & Minutes (no seconds): 12°25'N 76°13'E
  const dmRe = /(\d+)[*°\s](\d+(?:\.\d+)?)['\s]*([NSns])[,;\s]+(\d+)[*°\s](\d+(?:\.\d+)?)['\s]*([EWew])/;
  const mdm = clean.match(dmRe);
  if (mdm) {
    const lat = dmsToDecimal(mdm[1], mdm[2], 0, mdm[3]);
    const lng = dmsToDecimal(mdm[4], mdm[5], 0, mdm[6]);
    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return { lat, lng, name: `GPS Point (${lat.toFixed(5)}, ${lng.toFixed(5)})` };
    }
  }

  // ── Decimal degrees: "12.524, 76.896" or "12.524 76.896"
  const m1 = clean.match(/^(-?\d+(\.\d+)?)[,\s]+(-?\d+(\.\d+)?)$/);
  if (m1) {
    const lat = parseFloat(m1[1]);
    const lng = parseFloat(m1[3]);
    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return { lat, lng, name: `GPS Point (${lat.toFixed(5)}, ${lng.toFixed(5)})` };
    }
  }

  // ── Decimal with direction: "12.524N, 76.896E" or "12.524° N, 76.896° E"
  const m2 = clean.match(/^(-?\d+(\.\d+)?)\s*°?\s*([NSns])[,\s]+(-?\d+(\.\d+)?)\s*°?\s*([EWew])$/);
  if (m2) {
    let lat = parseFloat(m2[1]);
    if (m2[3].toUpperCase() === 'S') lat = -lat;
    let lng = parseFloat(m2[4]);
    if (m2[6].toUpperCase() === 'W') lng = -lng;
    if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return { lat, lng, name: `GPS Point (${lat.toFixed(5)}, ${lng.toFixed(5)})` };
    }
  }

  return null;
}

// Distance helper in kilometers to prevent duplicate suggestions
function getApproxDistanceKm(lat1, lon1, lat2, lon2) {
  const dLat = (lat2 - lat1) * 111;
  const dLon = (lon2 - lon1) * 111 * Math.cos((lat1 * Math.PI) / 180);
  return Math.sqrt(dLat * dLat + dLon * dLon);
}

// Autocomplete Location Search - Instant 0ms, User-Friendly with Quick Chips & Full Karnataka Coverage
function setupSearch() {
  const input = document.getElementById('location-search');
  const suggestionsBox = document.getElementById('search-suggestions');
  const spinner = document.getElementById('search-spinner');
  const clearBtn = document.getElementById('btn-search-clear');
  const submitBtn = document.getElementById('btn-search-submit');

  if (!input || !suggestionsBox) return;

  let debounceTimer = null;
  let activeAbortController = null;
  let currentResults = [];
  let selectedIndex = -1;

  function showSpinner(show) {
    if (spinner) {
      if (show) spinner.classList.add('active');
      else spinner.classList.remove('active');
    }
  }

  function updateClearBtn() {
    if (clearBtn) {
      if (input.value.trim().length > 0) {
        clearBtn.classList.add('active');
      } else {
        clearBtn.classList.remove('active');
      }
    }
  }

  function selectLocation(lat, lng, name) {
    const cleanName = name.split('(')[0].split(',')[0].trim();
    input.value = cleanName;
    suggestionsBox.classList.remove('active');
    selectedIndex = -1;
    currentResults = [];
    updateClearBtn();

    state.currentLat = lat;
    state.currentLng = lng;
    state.locationLabel = name;

    state.mapManager.flyTo(lat, lng, 14);
    state.mapManager.updateSelection(lat, lng, name, true);
  }

  function escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function highlightMatches(text, query) {
    if (!query || !text) return escapeHtml(text);
    const escaped = escapeHtml(text);
    const q = query.trim().replace(/[^a-zA-Z0-9]/g, '');
    if (!q) return escaped;
    try {
      const regex = new RegExp(`(${q})`, 'gi');
      return escaped.replace(regex, '<span class="search-highlight">$1</span>');
    } catch (e) {
      return escaped;
    }
  }

  // Render Default Quick Menu when search bar is focused or empty
  function renderQuickMenu() {
    selectedIndex = -1;
    currentResults = [];

    let html = `
      <div class="search-quick-section">
        <div class="search-quick-title">
          <span>⚡ POPULAR REGIONS & HYDRO-BENCHMARKS (1-CLICK JUMP)</span>
        </div>
        <div class="search-chips-grid">
          ${QUICK_SEARCH_REGIONS.map((item, idx) => `
            <button 
              type="button" 
              class="search-chip ${item.isBenchmark ? 'benchmark' : ''}" 
              data-chip-idx="${idx}"
              data-lat="${item.lat}"
              data-lng="${item.lng}"
              data-name="${escapeHtml(item.name)}"
            >
              <span>${item.badge.split(' ')[0]}</span>
              <span>${escapeHtml(item.name)}</span>
            </button>
          `).join('')}
        </div>

        <button type="button" class="search-gps-shortcut" id="quick-gps-btn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
          </svg>
          <span>🎯 Detect & Analyze My Current GPS Location</span>
        </button>
      </div>

      <div class="search-guide-note">
        <span>💡</span>
        <span>Search any village, town, taluk, Bangalore area, or coordinates (e.g. 12.524, 76.896)</span>
      </div>
    `;

    suggestionsBox.innerHTML = html;
    suggestionsBox.classList.add('active');

    // Attach quick GPS button
    const gpsBtn = suggestionsBox.querySelector('#quick-gps-btn');
    if (gpsBtn) {
      gpsBtn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        suggestionsBox.classList.remove('active');
        document.getElementById('btn-gps')?.click();
      });
    }

    // Attach chips click
    const chips = suggestionsBox.querySelectorAll('.search-chip');
    chips.forEach(chip => {
      chip.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const lat = parseFloat(chip.dataset.lat);
        const lng = parseFloat(chip.dataset.lng);
        const name = chip.dataset.name;
        if (!isNaN(lat) && !isNaN(lng)) {
          selectLocation(lat, lng, name);
        }
      });
    });
  }

  // Render Search Results List
  function renderSuggestions(results, query) {
    currentResults = results;
    selectedIndex = -1;

    if (!results || results.length === 0) {
      suggestionsBox.innerHTML = `
        <div style="padding:18px 16px; text-align:center; color:var(--text-muted); font-size:0.82rem;">
          <div style="font-size:1.1rem; margin-bottom:6px;">🔍</div>
          <div>No matching locations found for "<strong>${escapeHtml(query)}</strong>"</div>
          <div style="font-size:0.72rem; color:var(--text-dim); margin-top:6px; line-height:1.4;">
            Try searching a Karnataka district, taluk, village, or enter GPS coordinates (e.g. <code>12.524, 76.896</code>)
          </div>
          <div style="margin-top:12px;">
            <button type="button" class="search-chip benchmark" id="reset-quick-btn">
              ⚡ Browse Popular Regions
            </button>
          </div>
        </div>
      `;
      suggestionsBox.classList.add('active');
      const resetBtn = suggestionsBox.querySelector('#reset-quick-btn');
      if (resetBtn) {
        resetBtn.addEventListener('mousedown', (e) => {
          e.preventDefault();
          renderQuickMenu();
        });
      }
      return;
    }

    let html = `
      <div class="search-status-bar">
        <span>${results.length} Locations Found</span>
        <span style="font-size:0.65rem; color:var(--text-dim);">↑ ↓ Navigate • ↵ Select</span>
      </div>
    `;

    results.forEach((item, index) => {
      const highlightedTitle = highlightMatches(item.title || item.name, query);
      html += `
        <div class="suggestion-item" data-index="${index}" data-lat="${item.lat}" data-lng="${item.lng}" data-name="${escapeHtml(item.name)}">
          <div class="suggestion-left">
            <div class="suggestion-title">
              <span>${item.icon || '📍'}</span>
              <span>${highlightedTitle}</span>
            </div>
            ${item.subText ? `<div class="suggestion-sub">${escapeHtml(item.subText)}</div>` : ''}
          </div>
          <span class="suggestion-badge ${item.badgeClass || 'badge-regional'}">${escapeHtml(item.badgeText || 'Explore')}</span>
        </div>
      `;
    });

    suggestionsBox.innerHTML = html;
    suggestionsBox.classList.add('active');
  }

  function updateHighlightedItem() {
    const items = suggestionsBox.querySelectorAll('.suggestion-item');
    items.forEach((el, idx) => {
      if (idx === selectedIndex) {
        el.classList.add('selected');
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        el.classList.remove('selected');
      }
    });
  }

  // Unified multi-source search query runner
  async function runSearch(query, isImmediate = false) {
    const q = query.trim();
    if (!q) {
      renderQuickMenu();
      showSpinner(false);
      return;
    }

    // 1. Direct GPS coordinates check
    const coords = parseCoordinates(q);
    if (coords) {
      const gpsResult = [{
        lat: coords.lat,
        lng: coords.lng,
        name: coords.name,
        title: coords.name,
        subText: `Direct GPS Latitude: ${coords.lat.toFixed(5)}, Longitude: ${coords.lng.toFixed(5)}`,
        icon: '🎯',
        badgeText: 'GPS Target',
        badgeClass: 'badge-gps'
      }];

      if (isImmediate) {
        selectLocation(coords.lat, coords.lng, coords.name);
        return;
      }
      renderSuggestions(gpsResult, q);
      showSpinner(false);
      return;
    }

    // 2. Instant Local Matches (Presets + 250+ Regional Karnataka Districts/Taluks/Metros + Aliases)
    const localResults = [];

    // Presets
    const presetMatches = PRESET_LOCATIONS.filter(p =>
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      (p.terrain && p.terrain.toLowerCase().includes(q.toLowerCase()))
    );
    presetMatches.forEach(p => {
      localResults.push({
        lat: p.lat,
        lng: p.lng,
        name: p.name,
        title: p.name,
        subText: p.tag || 'Benchmark Region',
        icon: '⚡',
        badgeText: `${p.potential} Potential`,
        badgeClass: 'badge-benchmark'
      });
    });

    // Local Regional Gazetteer with full Karnataka coverage & aliases
    const gazetteerMatches = searchLocalGazetteer(q, 10);
    gazetteerMatches.forEach(g => {
      const isDuplicate = localResults.some(r => getApproxDistanceKm(r.lat, r.lng, g.lat, g.lng) < 3);
      if (!isDuplicate) {
        localResults.push({
          lat: g.lat,
          lng: g.lng,
          name: `${g.name}`,
          title: g.name.split(',')[0],
          subText: `${g.category} • ${g.state}`,
          icon: '📍',
          badgeText: g.category.split('/')[0].trim(),
          badgeClass: 'badge-regional'
        });
      }
    });

    // Render local results right away for 0ms instant feedback
    if (localResults.length > 0) {
      renderSuggestions(localResults, q);
      if (isImmediate) {
        selectLocation(localResults[0].lat, localResults[0].lng, localResults[0].name);
        return;
      }
    }

    // 3. Optional Background Online Geocoding with fast 2-second timeout
    if (q.length >= 3) {
      showSpinner(true);
      if (activeAbortController) {
        activeAbortController.abort();
      }
      activeAbortController = new AbortController();
      const { signal } = activeAbortController;
      const timeoutId = setTimeout(() => activeAbortController.abort(), 2000);

      try {
        const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=6`;
        const res = await fetch(photonUrl, { signal });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data && data.features && data.features.length > 0) {
            const merged = [...localResults];
            data.features.forEach(f => {
              const p = f.properties || {};
              const coords = f.geometry?.coordinates;
              if (!coords) return;
              const lng = coords[0];
              const lat = coords[1];
              const title = p.name || 'Location';
              const parts = [p.name, p.city, p.district, p.state, p.country].filter(Boolean);
              const label = parts.join(', ');
              const sub = [p.district || p.city, p.state, p.country].filter(Boolean).join(', ');

              const isDuplicate = merged.some(r => 
                getApproxDistanceKm(r.lat, r.lng, lat, lng) < 3 ||
                r.name.toLowerCase() === label.toLowerCase()
              );

              if (!isDuplicate) {
                merged.push({
                  lat,
                  lng,
                  name: label,
                  title,
                  subText: sub,
                  icon: '🌍',
                  badgeText: p.state || p.country || 'Global',
                  badgeClass: 'badge-online'
                });
              }
            });

            showSpinner(false);
            if (isImmediate && merged.length > 0) {
              selectLocation(merged[0].lat, merged[0].lng, merged[0].name);
              return;
            }
            renderSuggestions(merged, q);
            return;
          }
        }
      } catch (err) {
        // Abort or offline - safely ignore
      } finally {
        showSpinner(false);
      }
    }

    showSpinner(false);
    if (localResults.length === 0) {
      renderSuggestions([], q);
    }
  }

  // Open quick menu or suggestions on focus
  input.addEventListener('focus', () => {
    if (input.value.trim().length === 0) {
      renderQuickMenu();
    } else {
      runSearch(input.value.trim(), false);
    }
  });

  // Open quick menu on click if already focused or empty
  input.addEventListener('click', () => {
    if (!suggestionsBox.classList.contains('active')) {
      if (input.value.trim().length === 0) {
        renderQuickMenu();
      } else {
        runSearch(input.value.trim(), false);
      }
    }
  });

  // Input typing listener with instant 0ms local response
  input.addEventListener('input', (e) => {
    updateClearBtn();
    clearTimeout(debounceTimer);
    const query = e.target.value.trim();

    if (!query) {
      renderQuickMenu();
      showSpinner(false);
      return;
    }

    // Instant local gazetteer feedback
    runSearch(query, false);
  });

  // Keyboard navigation & Enter key submission
  input.addEventListener('keydown', (e) => {
    const isBoxOpen = suggestionsBox.classList.contains('active');
    const items = suggestionsBox.querySelectorAll('.suggestion-item');

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isBoxOpen) {
        if (input.value.trim().length === 0) renderQuickMenu();
        else runSearch(input.value.trim(), false);
        return;
      }
      if (items.length > 0) {
        selectedIndex = (selectedIndex + 1) % items.length;
        updateHighlightedItem();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (items.length > 0) {
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        updateHighlightedItem();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      clearTimeout(debounceTimer);

      if (selectedIndex >= 0 && currentResults[selectedIndex]) {
        const item = currentResults[selectedIndex];
        selectLocation(item.lat, item.lng, item.name);
      } else if (currentResults.length > 0) {
        const item = currentResults[0];
        selectLocation(item.lat, item.lng, item.name);
      } else if (input.value.trim().length > 0) {
        runSearch(input.value.trim(), true);
      }
    } else if (e.key === 'Escape') {
      suggestionsBox.classList.remove('active');
      selectedIndex = -1;
    }
  });

  // Search Submit Icon button click
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      clearTimeout(debounceTimer);
      if (input.value.trim().length > 0) {
        runSearch(input.value.trim(), true);
      } else {
        input.focus();
        renderQuickMenu();
      }
    });
  }

  // Clear button click
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      updateClearBtn();
      renderQuickMenu();
      showSpinner(false);
      input.focus();
    });
  }

  // Use mousedown with e.preventDefault() so clicks register before blur
  suggestionsBox.addEventListener('mousedown', (e) => {
    const itemEl = e.target.closest('.suggestion-item');
    if (itemEl) {
      e.preventDefault();
      const lat = parseFloat(itemEl.dataset.lat);
      const lng = parseFloat(itemEl.dataset.lng);
      const name = itemEl.dataset.name;
      if (!isNaN(lat) && !isNaN(lng)) {
        selectLocation(lat, lng, name);
      }
    }
  });

  // Mouse hover updates selected index
  suggestionsBox.addEventListener('mousemove', (e) => {
    const itemEl = e.target.closest('.suggestion-item');
    if (itemEl) {
      const idx = parseInt(itemEl.dataset.index, 10);
      if (!isNaN(idx) && idx !== selectedIndex) {
        selectedIndex = idx;
        const items = suggestionsBox.querySelectorAll('.suggestion-item');
        items.forEach((el, i) => {
          if (i === selectedIndex) el.classList.add('selected');
          else el.classList.remove('selected');
        });
      }
    }
  });

  // Close suggestions when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-box-wrap')) {
      suggestionsBox.classList.remove('active');
      selectedIndex = -1;
    }
  });

  // Global keyboard shortcut '/' or Ctrl+K / Cmd+K to focus search bar
  document.addEventListener('keydown', (e) => {
    if ((e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) && document.activeElement !== input) {
      e.preventDefault();
      input.focus();
      if (input.value.trim().length === 0) renderQuickMenu();
    }
  });
}

// App Initialization
function initApp() {
  renderAppShell();

  // Run initial analysis FIRST so dashboard is always populated and ready
  const initialAnalysis = analyzeGroundwater(state.currentLat, state.currentLng, state.locationLabel);
  updateDashboard(initialAnalysis);

  // Toast Notification Function
  function showToast(title, message, type = 'info', duration = 5000) {
    let container = document.getElementById('h2o-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'h2o-toast-container';
      container.className = 'h2o-toast-container';
      document.body.appendChild(container);
    }

    const icons = {
      info: 'ℹ️',
      success: '📍',
      warning: '⚠️'
    };

    const toast = document.createElement('div');
    toast.className = `h2o-toast toast-${type}`;
    toast.innerHTML = `
      <span class="h2o-toast-icon">${icons[type] || '💧'}</span>
      <div class="h2o-toast-body">
        <div class="h2o-toast-title">${title}</div>
        <div class="h2o-toast-msg">${message}</div>
      </div>
      <button class="h2o-toast-close" aria-label="Close">✕</button>
    `;

    const closeBtn = toast.querySelector('.h2o-toast-close');
    const removeToast = () => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
      setTimeout(() => {
        if (toast.parentElement) toast.parentElement.removeChild(toast);
      }, 250);
    };

    closeBtn.addEventListener('click', removeToast);
    container.appendChild(toast);

    if (duration > 0) {
      setTimeout(removeToast, duration);
    }
  }

  // Automatic reverse-geocoding to resolve real village/town name on map click
  async function reverseGeocode(lat, lng) {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`);
      if (!res.ok) return null;
      const data = await res.json();
      if (data && data.address) {
        const a = data.address;
        const place = a.village || a.town || a.suburb || a.city_district || a.city || a.county || a.taluk || a.hamlet;
        const district = a.state_district || a.district || a.county;
        const st = a.state;
        const parts = [place, district, st].filter(Boolean);
        return parts.length > 0 ? parts.join(', ') : data.display_name.split(',').slice(0, 3).join(', ');
      }
    } catch (e) {}
    return null;
  }

  // Initialize Map safely
  try {
    state.mapManager = new MapManager('map-container', {
      onLocationSelect: (lat, lng, locationLabel) => {
        state.currentLat = lat;
        state.currentLng = lng;
        state.locationLabel = locationLabel || `Site (${lat.toFixed(4)}, ${lng.toFixed(4)})`;

        const analysis = analyzeGroundwater(lat, lng, state.locationLabel);
        updateDashboard(analysis);
        state.mapManager?.renderBorewellMarkers(analysis.nearbyWells, lat, lng);
        state.mapManager?.renderGroundwaterZones(lat, lng, analysis.rechargeData);

        // If no explicit label was provided (e.g. user clicked directly on map), reverse-geocode to village/town
        if (!locationLabel) {
          reverseGeocode(lat, lng).then(resolvedName => {
            if (resolvedName && Math.abs(state.currentLat - lat) < 0.0001 && Math.abs(state.currentLng - lng) < 0.0001) {
              state.locationLabel = resolvedName;
              const refreshedAnalysis = analyzeGroundwater(lat, lng, resolvedName);
              updateDashboard(refreshedAnalysis);
              const searchInput = document.getElementById('location-search');
              if (searchInput) searchInput.value = resolvedName.split(',')[0].trim();
            }
          });
        }

        showToast(
          'Location Marked 📍',
          `Selected: <strong>${state.locationLabel}</strong><br>Strike Potential: <span style="color:#00f2fe;font-weight:700;">${analysis.probability}% (${analysis.category})</span>`,
          'info',
          3200
        );

        // Confetti burst for high potential discovery!
        if (analysis.probability >= 75) {
          confetti({
            particleCount: 35,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#00f2fe', '#38bdf8', '#10b981']
          });
        }
      }
    });

    state.mapManager.init(state.currentLat, state.currentLng, 13);
    setTimeout(() => state.mapManager?.invalidateSize(), 150);
    setTimeout(() => state.mapManager?.invalidateSize(), 450);

    state.mapManager.renderBorewellMarkers(initialAnalysis.nearbyWells, state.currentLat, state.currentLng);
    state.mapManager.renderGroundwaterZones(state.currentLat, state.currentLng, initialAnalysis.rechargeData);
  } catch (mapErr) {
    console.warn('[H2O] Map manager notice:', mapErr);
  }

  // Setup Location Search
  setupSearch();

  // Preset Selector change
  const presetSelector = document.getElementById('preset-selector');
  presetSelector.addEventListener('change', (e) => {
    const pId = e.target.value;
    if (!pId) return;
    const preset = PRESET_LOCATIONS.find(p => p.id === pId);
    if (preset) {
      state.currentLat = preset.lat;
      state.currentLng = preset.lng;
      state.locationLabel = preset.name;
      state.mapManager.flyTo(preset.lat, preset.lng, 14);
      state.mapManager.updateSelection(preset.lat, preset.lng, preset.name, true);
    }
  });

  // Basemap switcher
  const layerButtons = document.querySelectorAll('.layer-btn');
  layerButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      layerButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.mapManager.setTileLayer(btn.dataset.layer);
    });
  });

  // Overlay Toggles
  document.getElementById('toggle-wells').addEventListener('change', (e) => {
    state.mapManager.toggleLayer('wells', e.target.checked);
  });
  document.getElementById('toggle-fractures').addEventListener('change', (e) => {
    state.mapManager.toggleLayer('fractures', e.target.checked);
  });
  document.getElementById('toggle-prospect').addEventListener('change', (e) => {
    state.mapManager.toggleLayer('prospect', e.target.checked);
  });

  // View Mode Switcher (Split / Full Dashboard / Full Map)
  const viewToggle = document.getElementById('view-mode-toggle');
  const mainLayout = document.querySelector('.main-layout');
  if (viewToggle && mainLayout) {
    viewToggle.addEventListener('click', (e) => {
      const btn = e.target.closest('.view-btn');
      if (!btn) return;
      viewToggle.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.dataset.mode;

      mainLayout.classList.remove('mode-dashboard', 'mode-map');
      if (mode === 'dashboard') {
        mainLayout.classList.add('mode-dashboard');
      } else if (mode === 'map') {
        mainLayout.classList.add('mode-map');
      }

      setTimeout(() => {
        state.mapManager?.invalidateSize();
        state.hydrographChart?.resize();
      }, 150);
    });
  }

  // Handle Window Resize to ensure Leaflet never collapses or distorts
  window.addEventListener('resize', () => {
    state.mapManager?.invalidateSize();
  });

  // Unit Toggle (Feet / Meters)
  const unitToggle = document.getElementById('unit-toggle');
  unitToggle.addEventListener('click', (e) => {
    const opt = e.target.closest('.unit-opt');
    if (!opt) return;
    document.querySelectorAll('.unit-opt').forEach(o => o.classList.remove('active'));
    opt.classList.add('active');
    state.unit = opt.dataset.unit;
    if (state.currentData) {
      updateDashboard(state.currentData);
    }
  });

  // Smart GPS & Network Location Finder
  const gpsBtn = document.getElementById('btn-gps');
  if (gpsBtn) {
    const originalText = gpsBtn.innerHTML;

    async function tryNetworkIpFallback(reasonMsg) {
      showToast(
        'Searching Network Location...',
        'GPS signal not available. Detecting approximate region via IP network...',
        'info',
        3500
      );

      try {
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error('IP service 1 error');
        const data = await response.json();
        if (data.latitude && data.longitude) {
          const lat = parseFloat(data.latitude);
          const lng = parseFloat(data.longitude);
          const cityLabel = [data.city, data.region, data.country_name].filter(Boolean).join(', ');
          state.currentLat = lat;
          state.currentLng = lng;
          state.locationLabel = `${cityLabel} (Approx. Network)`;
          state.mapManager?.flyTo(lat, lng, 13);
          state.mapManager?.updateSelection(lat, lng, state.locationLabel, true);
          showToast(
            'Approximate ISP Area (Network IP) ⚠️',
            `Detected your ISP gateway at <strong>${cityLabel}</strong>. Note: IP location routes through your internet provider and may not match your actual town. Please search your village or click directly on the map to mark your exact land!`,
            'warning',
            9000
          );
          return true;
        }
      } catch (e1) {
        try {
          const resp2 = await fetch('https://ipwho.is/');
          const d2 = await resp2.json();
          if (d2.success && d2.latitude && d2.longitude) {
            const lat = parseFloat(d2.latitude);
            const lng = parseFloat(d2.longitude);
            const cityLabel = [d2.city, d2.region, d2.country].filter(Boolean).join(', ');
            state.currentLat = lat;
            state.currentLng = lng;
            state.locationLabel = `${cityLabel} (Approx. Network)`;
            state.mapManager?.flyTo(lat, lng, 13);
            state.mapManager?.updateSelection(lat, lng, state.locationLabel, true);
            showToast(
              'Approximate ISP Area (Network IP) ⚠️',
              `Detected your ISP gateway at <strong>${cityLabel}</strong>. Note: IP location routes through your internet provider and may not match your actual town. Please search your village or click directly on the map to mark your exact land!`,
              'warning',
              9000
            );
            return true;
          }
        } catch (e2) {}
      }

      showToast(
        'GPS Blocked or Unavailable',
        `${reasonMsg}<br>💡 <strong>Tip:</strong> Click anywhere on the satellite map or search your village/town in the top bar to mark your land.`,
        'warning',
        9000
      );
      return false;
    }

    gpsBtn.addEventListener('click', () => {
      if (!navigator.geolocation) {
        tryNetworkIpFallback('Browser does not support HTML5 geolocation.');
        return;
      }

      gpsBtn.innerHTML = '<span>📡 Locating...</span>';

      function onSuccess(pos) {
        gpsBtn.innerHTML = originalText;
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        state.currentLat = lat;
        state.currentLng = lng;
        state.locationLabel = 'Your Current GPS Location';
        state.mapManager?.flyTo(lat, lng, 15);
        state.mapManager?.updateSelection(lat, lng, state.locationLabel, true);
        showToast(
          'Location Pinned! 📍',
          `GPS pinpointed: ${lat.toFixed(5)}° N, ${lng.toFixed(5)}° E (±${Math.round(pos.coords.accuracy || 15)}m). You can drag the target crosshair or click to adjust.`,
          'success',
          5500
        );
      }

      function onError(err) {
        // High accuracy may timeout or fail on Mac desktop/laptops. Fallback to standard accuracy.
        navigator.geolocation.getCurrentPosition(
          onSuccess,
          (err2) => {
            gpsBtn.innerHTML = originalText;
            let reason = 'GPS request timed out.';
            if (err.code === 1 || err2.code === 1) {
              reason = 'Location permission is blocked in your browser settings.';
            }
            tryNetworkIpFallback(reason);
          },
          { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
        );
      }

      navigator.geolocation.getCurrentPosition(
        onSuccess,
        onError,
        { enableHighAccuracy: true, timeout: 6000, maximumAge: 10000 }
      );
    });
  }

  // Cost Estimator Modal
  const costModal = document.getElementById('cost-modal');
  document.getElementById('btn-open-cost').addEventListener('click', () => {
    updateCostModalUI();
    costModal.classList.add('active');
  });
  document.getElementById('close-cost-modal').addEventListener('click', () => {
    costModal.classList.remove('active');
  });

  // Report Modal
  const reportModal = document.getElementById('report-modal');
  document.getElementById('btn-open-report').addEventListener('click', () => {
    updateReportModalUI();
    reportModal.classList.add('active');
  });
  document.getElementById('close-report-modal').addEventListener('click', () => {
    reportModal.classList.remove('active');
  });
  document.getElementById('btn-print-report').addEventListener('click', () => {
    window.print();
  });

  // Close modals on backdrop click
  window.addEventListener('click', (e) => {
    if (e.target === costModal) costModal.classList.remove('active');
    if (e.target === reportModal) reportModal.classList.remove('active');
  });
}

// Start Application
window.addEventListener('DOMContentLoaded', () => {
  initApp();
});
