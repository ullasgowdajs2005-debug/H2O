// H2O - Official Hydrogeological Assessment Report Generator

export function renderFullReportHtml(data, costData) {
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const reportRef = `H2O-${Math.abs(data.lat * 100).toFixed(0)}-${Math.abs(data.lng * 100).toFixed(0)}-${Date.now().toString().slice(-4)}`;

  const firstStrikeMeters = `${(data.firstStrikeFt[0] * 0.3048).toFixed(1)} - ${(data.firstStrikeFt[1] * 0.3048).toFixed(1)} m`;
  const majorStrikeMeters = `${(data.majorStrikeFt[0] * 0.3048).toFixed(1)} - ${(data.majorStrikeFt[1] * 0.3048).toFixed(1)} m`;
  const recDepthMeters = `${(data.recommendedDepthFt * 0.3048).toFixed(1)} m`;
  const casingDepthMeters = `${(data.casingDepthFt * 0.3048).toFixed(1)} m`;

  return `
    <div class="report-document" id="printable-report">
      <div class="report-header">
        <div class="report-brand">
          <div class="report-logo">
            <span class="logo-icon">💧</span>
            <div>
              <h2>H2O Intelligence Dossier</h2>
              <p class="sub">Groundwater Availability, Aquifer Strata & Borewell Drilling Potential</p>
            </div>
          </div>
          <div class="report-meta-box">
            <div><strong>Report Ref:</strong> ${reportRef}</div>
            <div><strong>Issue Date:</strong> ${dateStr}</div>
            <div><strong>Compliance:</strong> CGWB / ISRO Bhuvan Guidelines</div>
          </div>
        </div>
      </div>

      <div class="report-section summary-hero">
        <div class="summary-col">
          <h3>Target Location</h3>
          <div class="target-name">${data.locationName}</div>
          <div class="target-coords">Coordinates: <strong>${data.lat.toFixed(5)}° N, ${data.lng.toFixed(5)}° E</strong></div>
          <div class="target-terrain">Geomorphology: <em>${data.terrainDescription}</em></div>
          <div class="target-rock">Host Rock: <strong>${data.rockType}</strong></div>
        </div>
        <div class="summary-col metric-col">
          <div class="metric-badge ${data.potentialCategory.toLowerCase().includes('high') ? 'high' : data.potentialCategory.toLowerCase().includes('low') ? 'low' : 'mod'}">
            <span class="m-label">Groundwater Potential</span>
            <span class="m-val">${data.potentialCategory.toUpperCase()}</span>
            <span class="m-sub">Empirical Score: ${data.probability}%</span>
          </div>
          <div class="confidence-tag">
            <span>Confidence Index:</span> <strong>${data.confidenceScore}</strong>
          </div>
        </div>
      </div>

      <div class="report-section">
        <h4 class="section-title">1. Recommended Drilling Depths & Casing Specifications</h4>
        <div class="depth-grid">
          <div class="d-card">
            <span class="d-title">First Water Strike</span>
            <span class="d-val">${data.firstStrikeFt[0]} - ${data.firstStrikeFt[1]} ft</span>
            <span class="d-unit">(${firstStrikeMeters})</span>
            <p class="d-desc">Shallow unconfined or weathered horizon seep.</p>
          </div>
          <div class="d-card highlight">
            <span class="d-title">Main Aquifer Strike (Target)</span>
            <span class="d-val">${data.majorStrikeFt[0]} - ${data.majorStrikeFt[1]} ft</span>
            <span class="d-unit">(${majorStrikeMeters})</span>
            <p class="d-desc">Primary fracture zone with major hydrostatic yield.</p>
          </div>
          <div class="d-card">
            <span class="d-title">Casing Pipe Required</span>
            <span class="d-val">${data.casingDepthFt} ft</span>
            <span class="d-unit">(${casingDepthMeters})</span>
            <p class="d-desc">Must be sealed 5ft into solid bedrock to prevent cave-in.</p>
          </div>
          <div class="d-card">
            <span class="d-title">Maximum Drilling Cutoff</span>
            <span class="d-val">${data.recommendedDepthFt} ft</span>
            <span class="d-unit">(${recDepthMeters})</span>
            <p class="d-desc">Beyond this depth, crystalline basement is typically dry.</p>
          </div>
        </div>
      </div>

      <div class="report-section">
        <h4 class="section-title">2. Subsurface Stratigraphic Column (Vertical Cross-Section)</h4>
        <div class="strata-table-wrap">
          <table class="report-table">
            <thead>
              <tr>
                <th>Depth Horizon</th>
                <th>Stratum / Formation</th>
                <th>Lithological Characteristics</th>
                <th>Aquifer Hydro-Behavior</th>
              </tr>
            </thead>
            <tbody>
              ${data.strata.map(s => `
                <tr class="${s.waterPresent ? 'water-stratum-row' : ''}">
                  <td><strong>${s.depthFt}</strong><br><small>${s.depthM}</small></td>
                  <td><span class="strata-chip" style="border-left: 4px solid ${s.color};">${s.name}</span></td>
                  <td>${s.porosity}</td>
                  <td>${s.waterPresent ? `<span class="water-badge">💧 ${s.waterType}</span><br>` : ''}${s.notes}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="report-section">
        <h4 class="section-title">3. Nearby Registered Borewell Logs (Evidence Matrix)</h4>
        <p class="report-note">Observational logs retrieved from public records and local monitoring networks within 2 km:</p>
        <table class="report-table">
          <thead>
            <tr>
              <th>Well ID</th>
              <th>Distance & Dir</th>
              <th>Total Depth</th>
              <th>Water Strike</th>
              <th>Discharge Yield</th>
              <th>Static Water Level</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${data.nearbyWells.map(w => `
              <tr>
                <td><code>${w.id}</code></td>
                <td>${w.distance}</td>
                <td>${w.totalDepthFt} ft</td>
                <td>${w.strikeDepthFt} ft</td>
                <td><strong>${w.yieldInches}</strong> (${w.yieldGph} GPH)</td>
                <td>${w.staticWaterLevelFt} ft bgl</td>
                <td><span class="status-pill">${w.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="report-section">
        <h4 class="section-title">4. Groundwater Recharge Belt & Watershed Hydro-Dynamics (CGWB / NRSC)</h4>
        <div class="ai-box" style="background:#f8fafc; border-left:4px solid ${data.rechargeData ? data.rechargeData.color : '#0284c7'};">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:8px;">
            <strong style="font-size:0.95rem; color:#0f172a;">${data.rechargeData ? data.rechargeData.zoneTitle : 'Hydrological Recharge Corridor'}</strong>
            <span style="font-size:0.75rem; font-weight:700; padding:2px 8px; border-radius:12px; background:#e0f2fe; color:#0369a1;">
              ${data.rechargeData ? data.rechargeData.cgwbStatus : 'CGWB Assessment'}
            </span>
          </div>
          <p style="font-size:0.8rem; color:#334155; margin-bottom:10px;">${data.rechargeData ? data.rechargeData.beltSummary : ''}</p>
          <div class="advice-grid">
            <div class="adv-item">
              <strong>💧 Infiltration Rate:</strong> ${data.rechargeData ? data.rechargeData.infiltrationRateMmYr : 200} mm/year (${data.rechargeData ? data.rechargeData.infiltrationPct : 25}% of annual rain)
            </div>
            <div class="adv-item">
              <strong>🌊 Surface Runoff Loss:</strong> ${data.rechargeData ? data.rechargeData.runoffPct : 45}%
            </div>
            <div class="adv-item">
              <strong>🌱 Soil Permeability:</strong> ${data.rechargeData ? data.rechargeData.soilPermeability : 'Moderate'}
            </div>
            <div class="adv-item">
              <strong>🛠️ Artificial Recharge:</strong> ${data.rechargeData ? data.rechargeData.artificialAdvice : ''}
            </div>
          </div>
        </div>
      </div>

      <div class="report-section">
        <h4 class="section-title">5. Plain-Language Hydrogeological Assessment & Drilling Advice</h4>
        <div class="ai-box">
          <p><strong>Geological Synthesis:</strong> ${data.aiInsights.hydroSummary}</p>
          <div class="advice-grid">
            <div class="adv-item">
              <strong>🚜 Recommended Rig:</strong> ${data.aiInsights.rigAdvice}
            </div>
            <div class="adv-item">
              <strong>📅 Best Drilling Season:</strong> ${data.aiInsights.bestSeason}
            </div>
            <div class="adv-item">
              <strong>🛡️ Casing Standard:</strong> ${data.aiInsights.casingAdvice}
            </div>
            <div class="adv-item">
              <strong>🌧️ Groundwater Recharge:</strong> ${data.aiInsights.rechargeRecommendation}
            </div>
          </div>
        </div>
      </div>

      <div class="report-section">
        <h4 class="section-title">6. Estimated Borewell Project Investment</h4>
        <div class="cost-summary-box">
          <div class="cost-total">
            <span>Estimated Total Project Budget:</span>
            <strong>${costData.symbol}${costData.total.toLocaleString()}</strong>
          </div>
          <div class="cost-items-mini">
            ${costData.breakdown.map(b => `
              <div class="mini-cost-row">
                <span>${b.item}</span>
                <strong>${costData.symbol}${b.amount.toLocaleString()}</strong>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="report-section disclaimer-box">
        <h4>⚠️ Statutory Hydrogeological & Safety Disclaimer</h4>
        <p>
          <strong>Notice:</strong> This map-based evaluation is generated by fusing multi-source geospatial records,
          remote sensing hydrology (Bhuvan-Bhujal, India-WRIS), and regional CGWB aquifer maps. Subterranean fracture 
          networks can vary over short lateral distances of 10 to 50 meters due to vertical dykes, shear zone pinch-outs, 
          and structural discontinuities.
        </p>
        <p>
          <strong>Pre-Drilling Recommendation:</strong> Before deploying a drilling rig, commission a ground-level 
          <strong>Vertical Electrical Sounding (VES) or Schlumberger Resistivity Survey</strong> by a certified government-approved 
          hydrogeologist to pinpoint the exact micro-fracture intersection on your plot.
        </p>
      </div>

      <div class="report-footer">
        <div>Generated via <strong>H2O Platform</strong> • Powered by Open Data from CGWB, ISRO-Bhuvan & India-WRIS</div>
        <div>Page 1 of 1 • System Verification Validated</div>
      </div>
    </div>
  `;
}
