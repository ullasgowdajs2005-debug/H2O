// H2O - Interactive Map Component using Leaflet
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { evaluateRegionalRecharge } from '../data/rechargeBelts.js';

// Fix Leaflet's default icon path issues in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export class MapManager {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.onLocationSelect = options.onLocationSelect || (() => {});
    this.map = null;
    this.currentMarker = null;
    this.radarCircle = null;
    this.wellLayerGroup = L.layerGroup();
    this.fractureLayerGroup = L.layerGroup();
    this.potentialHeatLayer = L.layerGroup();
    this.currentTileLayer = null;
    this.baseLayers = {};
  }

  init(initialLat = 12.524, initialLng = 76.896, initialZoom = 13) {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    // Create Map
    this.map = L.map(this.containerId, {
      center: [initialLat, initialLng],
      zoom: initialZoom,
      zoomControl: false,
      attributionControl: false
    });

    // Add Zoom Control top right
    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    // Custom attribution
    L.control.attribution({
      position: 'bottomright',
      prefix: '<span>H2O</span> • Carto / Esri / CGWB / ISRO'
    }).addTo(this.map);

    // Define Tile Layers
    this.baseLayers = {
      satellite: L.layerGroup([
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 19,
          attribution: 'Esri Satellite'
        }),
        L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 19
        })
      ]),
      dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution: '© CartoDB'
      }),
      streets: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
      }),
      topo: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: '© OpenTopoMap'
      })
    };

    // Default to Satellite hybrid for high-tech hydro-geology feel
    this.baseLayers.satellite.addTo(this.map);
    this.currentTileLayer = 'satellite';

    // Add Layer Groups
    this.potentialHeatLayer.addTo(this.map);
    this.fractureLayerGroup.addTo(this.map);
    this.wellLayerGroup.addTo(this.map);

    // Click handler for user selecting any location
    this.map.on('click', (e) => {
      this.updateSelection(e.latlng.lat, e.latlng.lng, null, true);
    });

    // Initial marker
    this.setTargetMarker(initialLat, initialLng);
    this.renderFractureLines(initialLat, initialLng);
  }

  setTileLayer(layerKey) {
    if (!this.baseLayers[layerKey] || this.currentTileLayer === layerKey) return;
    
    // Remove previous layer
    if (this.currentTileLayer && this.baseLayers[this.currentTileLayer]) {
      this.map.removeLayer(this.baseLayers[this.currentTileLayer]);
    }

    this.baseLayers[layerKey].addTo(this.map);
    this.currentTileLayer = layerKey;
  }

  updateSelection(lat, lng, locationLabel = null, triggerCallback = true) {
    this.setTargetMarker(lat, lng);
    this.renderFractureLines(lat, lng);

    if (triggerCallback) {
      this.onLocationSelect(lat, lng, locationLabel);
    } else {
      this.renderGroundwaterZones(lat, lng, null);
    }
  }

  flyTo(lat, lng, zoom = 14) {
    if (!this.map) return;
    this.map.flyTo([lat, lng], zoom, {
      duration: 1.5,
      easeLinearity: 0.25
    });
  }

  setTargetMarker(lat, lng) {
    if (this.currentMarker) {
      this.map.removeLayer(this.currentMarker);
    }
    if (this.radarCircle) {
      this.map.removeLayer(this.radarCircle);
    }

    // High tech pulse marker
    const pulseIcon = L.divIcon({
      className: 'target-pulse-container',
      html: `
        <div class="target-marker-core">
          <div class="pulse-ring pulse-1"></div>
          <div class="pulse-ring pulse-2"></div>
          <div class="pulse-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5">
              <path d="M12 2v20M2 12h20M12 2a10 10 0 0 1 10 10M12 2a10 10 0 0 0-10 10M12 22a10 10 0 0 1-10-10M12 22a10 10 0 0 0 10-10"/>
            </svg>
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });

    this.currentMarker = L.marker([lat, lng], {
      icon: pulseIcon,
      draggable: true
    }).addTo(this.map);

    this.currentMarker.on('dragend', (e) => {
      const position = e.target.getLatLng();
      this.updateSelection(position.lat, position.lng, null, true);
    });

    // Add radar radius boundary (e.g. 800m analysis zone)
    this.radarCircle = L.circle([lat, lng], {
      radius: 800,
      color: '#00f2fe',
      weight: 1.5,
      opacity: 0.7,
      fillColor: '#00f2fe',
      fillOpacity: 0.08,
      dashArray: '6, 6',
      interactive: false
    }).addTo(this.map);
  }

  renderBorewellMarkers(wells, baseLat, baseLng) {
    this.wellLayerGroup.clearLayers();

    wells.forEach((well) => {
      const wellLat = baseLat + well.latOffset;
      const wellLng = baseLng + well.lngOffset;

      const wellIcon = L.divIcon({
        className: 'well-marker-container',
        html: `
          <div class="well-pin">
            <span class="well-pin-icon">🚰</span>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const marker = L.marker([wellLat, wellLng], { icon: wellIcon });

      const popupHtml = `
        <div class="well-popup">
          <div class="popup-head">
            <strong>${well.id}</strong>
            <span class="popup-badge">${well.source}</span>
          </div>
          <div class="popup-body">
            <div><strong>Depth:</strong> ${well.totalDepthFt} ft</div>
            <div><strong>Water Strike:</strong> ${well.strikeDepthFt} ft</div>
            <div><strong>Discharge Yield:</strong> <span class="yield-hl">${well.yieldInches} (${well.yieldGph} GPH)</span></div>
            <div><strong>Static Water:</strong> ${well.staticWaterLevelFt} ft bgl</div>
            <div><strong>Distance:</strong> ${well.distance}</div>
            <div><strong>Status:</strong> ${well.status}</div>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { className: 'custom-leaflet-popup' });
      this.wellLayerGroup.addLayer(marker);
    });
  }

  renderFractureLines(lat, lng) {
    this.fractureLayerGroup.clearLayers();

    // Generate 3 subtle geological fracture/fault lineaments crossing the area
    const offset1 = 0.009;
    const offset2 = 0.012;

    const lineaments = [
      [
        [lat - offset1, lng - offset2],
        [lat - offset1 * 0.2, lng - offset2 * 0.2],
        [lat + offset1 * 0.5, lng + offset2 * 0.4],
        [lat + offset1 * 1.2, lng + offset2 * 0.9]
      ],
      [
        [lat + offset1 * 0.8, lng - offset2 * 0.8],
        [lat + offset1 * 0.1, lng - offset2 * 0.1],
        [lat - offset1 * 0.7, lng + offset2 * 0.7]
      ]
    ];

    lineaments.forEach((pts, idx) => {
      const polyline = L.polyline(pts, {
        color: idx === 0 ? '#38bdf8' : '#a855f7',
        weight: 2,
        opacity: 0.65,
        dashArray: '5, 8'
      });
      polyline.on('click', (e) => {
        this.updateSelection(e.latlng.lat, e.latlng.lng, null, true);
      });
      polyline.bindTooltip(
        idx === 0 ? 'Secondary Aquifer Fault Lineament (Permeable Joint)' : 'Shear Fracture Zone (Subsurface)',
        { sticky: true, className: 'hydro-tooltip' }
      );
      this.fractureLayerGroup.addLayer(polyline);
    });
  }

  renderGroundwaterZones(lat, lng, rechargeData = null) {
    this.potentialHeatLayer.clearLayers();

    // Use passed data or compute authentic regional recharge
    const data = rechargeData || evaluateRegionalRecharge(lat, lng);
    const {
      statusClass,
      color,
      corridorName,
      cgwbStatus,
      infiltrationRateMmYr,
      infiltrationPct,
      boreholeSetting,
      beltSummary,
      centerline,
      polygon,
      distanceText,
      isInsideCorridor
    } = data;

    // 1. Render stationary geographic recharge corridor polygon
    if (polygon && polygon.length > 2) {
      const zonePolygon = L.polygon(polygon, {
        color: color,
        weight: 2,
        fillColor: color,
        fillOpacity: statusClass === 'safe' ? 0.22 : 0.16,
        dashArray: statusClass === 'safe' ? null : '6, 6'
      });

      const popupHtml = `
        <div style="font-size:0.82rem; line-height:1.45; min-width:240px;">
          <div style="font-weight:700; color:${color}; font-size:0.9rem; margin-bottom:4px;">🌊 ${corridorName}</div>
          <div style="color:#e2e8f0; font-size:0.75rem;">CGWB Status: <strong style="color:${color};">${cgwbStatus}</strong></div>
          <div style="color:#e2e8f0; font-size:0.75rem;">Annual Infiltration: <strong style="color:#00f2fe;">${infiltrationRateMmYr} mm/year (${infiltrationPct}%)</strong></div>
          <div style="color:#e2e8f0; font-size:0.75rem;">Site Position: <strong>${boreholeSetting}</strong></div>
          <div style="margin-top:6px; font-size:0.72rem; color:#cbd5e1; border-top:1px solid rgba(255,255,255,0.12); padding-top:4px;">
            ${beltSummary}
          </div>
        </div>
      `;

      zonePolygon.bindTooltip(popupHtml, { sticky: true, className: 'hydro-tooltip' });
      zonePolygon.on('click', (e) => {
        this.updateSelection(e.latlng.lat, e.latlng.lng, null, true);
      });
      this.potentialHeatLayer.addLayer(zonePolygon);
    }

    // 2. Render drainage/canal infiltration centerline
    if (centerline && centerline.length > 1) {
      const streamLine = L.polyline(centerline, {
        color: color,
        weight: 3.5,
        opacity: 0.85,
        dashArray: '8, 6'
      });

      streamLine.bindTooltip(`💧 ${corridorName} • Infiltration Axis`, {
        sticky: true,
        className: 'hydro-tooltip'
      });
      streamLine.on('click', (e) => {
        this.updateSelection(e.latlng.lat, e.latlng.lng, null, true);
      });
      this.potentialHeatLayer.addLayer(streamLine);

      // Stationary corridor label positioned along the valley axis far from the borehole
      // Pick the midpoint of the centerline
      const anchorIdx = Math.floor(centerline.length / 2);
      const tagCoord = centerline[anchorIdx];

      const badgeIcon = L.divIcon({
        className: 'recharge-map-tag-wrap',
        html: `<div class="recharge-map-tag tag-${statusClass}">🌊 ${corridorName.split('(')[0].trim()} • ${infiltrationRateMmYr} mm/yr</div>`,
        iconSize: [240, 26],
        iconAnchor: [120, 13]
      });
      const stationaryTag = L.marker(tagCoord, { icon: badgeIcon, interactive: false });
      this.potentialHeatLayer.addLayer(stationaryTag);
    }

    // 3. If site is outside corridor, render a subtle trajectory line indicating distance
    if (!isInsideCorridor && centerline && centerline.length > 1) {
      let closestVertex = centerline[0];
      let minD = Infinity;
      for (const pt of centerline) {
        const d = Math.hypot(pt[0] - lat, pt[1] - lng);
        if (d < minD) {
          minD = d;
          closestVertex = pt;
        }
      }

      const trajectory = L.polyline([[lat, lng], closestVertex], {
        color: '#38bdf8',
        weight: 1.5,
        opacity: 0.6,
        dashArray: '4, 6'
      });

      trajectory.bindTooltip(`📍 Distance to Recharge Axis: ${distanceText}`, {
        sticky: true,
        className: 'hydro-tooltip'
      });
      trajectory.on('click', (e) => {
        this.updateSelection(e.latlng.lat, e.latlng.lng, null, true);
      });
      this.potentialHeatLayer.addLayer(trajectory);
    }
  }

  toggleLayer(layerName, visible) {
    if (layerName === 'wells') {
      if (visible) this.map.addLayer(this.wellLayerGroup);
      else this.map.removeLayer(this.wellLayerGroup);
    } else if (layerName === 'fractures') {
      if (visible) this.map.addLayer(this.fractureLayerGroup);
      else this.map.removeLayer(this.fractureLayerGroup);
    } else if (layerName === 'prospect') {
      if (visible) this.map.addLayer(this.potentialHeatLayer);
      else this.map.removeLayer(this.potentialHeatLayer);
    }
  }

  invalidateSize() {
    if (this.map) {
      try {
        this.map.invalidateSize();
      } catch (e) {}
      setTimeout(() => {
        try {
          this.map?.invalidateSize();
        } catch (e) {}
      }, 150);
    }
  }
}
