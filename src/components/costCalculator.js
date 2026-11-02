// H2O - Borewell Drilling Cost & Rig Calculator

export const CASING_OPTIONS = {
  low_1_6mm: {
    id: 'low_1_6mm',
    name: 'Low quality casing (1.6mm) 39KG',
    shortName: 'Low (1.6mm • 39kg)',
    thickness: '1.6mm',
    weight: '39kg',
    ratePerFt: 300,
    detail: 'Low quality casing (1.6mm) 39KG @ ₹300/ft'
  },
  medium_1_8mm: {
    id: 'medium_1_8mm',
    name: 'Medium quality casing (1.8mm) 45KG',
    shortName: 'Medium (1.8mm • 45kg)',
    thickness: '1.8mm',
    weight: '45kg',
    ratePerFt: 380,
    detail: 'Medium quality casing (1.8mm) 45KG @ ₹380/ft'
  },
  high_2mm: {
    id: 'high_2mm',
    name: 'High quality casing (2mm) 50KG',
    shortName: 'High (2.0mm • 50kg)',
    thickness: '2.0mm',
    weight: '50kg',
    ratePerFt: 480,
    detail: 'High quality casing (2mm) 50KG @ ₹480/ft'
  },
  ga_2mm: {
    id: 'ga_2mm',
    name: 'GA (2mm)',
    shortName: 'GA 2mm',
    thickness: '2.0mm',
    weight: 'Heavy GA/GI',
    ratePerFt: 750,
    detail: 'GA (2mm) galvanized casing @ ₹750/ft'
  }
};

export function getCasingConfig(type) {
  if (CASING_OPTIONS[type]) return CASING_OPTIONS[type];
  if (type === 'pvc') return CASING_OPTIONS.medium_1_8mm;
  if (type === 'ms') return CASING_OPTIONS.high_2mm;
  return CASING_OPTIONS.medium_1_8mm;
}

export function calculateBorewellCost({
  depthFt = 350,
  casingFt = 60,
  casingType = 'medium_1_8mm',
  pumpHp = 3,
  currency = 'INR'
}) {
  // Updated standard drilling rate: 1 feet = ₹110
  const drillingRatePerFt = 110;
  const drillingTotal = Math.max(0, depthFt) * drillingRatePerFt;

  // Casing pipe cost based on quality & gauge
  const selectedCasing = getCasingConfig(casingType);
  const casingTotal = Math.max(0, casingFt) * selectedCasing.ratePerFt;

  // Casing installation, welding & collar charges
  const casingLabour = Math.max(0, casingFt) * 30;

  // Submersible pump set cost based on HP & head rating
  let pumpCost = 25000;
  if (pumpHp >= 7.5) pumpCost = 54000;
  else if (pumpHp >= 5) pumpCost = 42000;
  else if (pumpHp >= 3) pumpCost = 32000;
  else pumpCost = 22000;

  // Submersible 3-core copper cable (length = depthFt - 20)
  const cableLength = Math.max(0, depthFt - 20);
  const cableCost = cableLength * 75;

  // Column / HDPE / UPVC delivery pipe (for suspending pump)
  const columnPipeCost = cableLength * 80;

  // Control panel board, safety rope, well cap, earthing
  const accessoriesCost = 11500;

  // Rig transport, geophysical survey & labour allowance
  const mobilizationCost = 7500;

  const totalInr = drillingTotal + casingTotal + casingLabour + pumpCost + cableCost + columnPipeCost + accessoriesCost + mobilizationCost;

  // Currency conversion rate (approx 1 USD = 86 INR)
  const rateUsd = 86;
  const multiplier = currency === 'USD' ? (1 / rateUsd) : 1;
  const symbol = currency === 'USD' ? '$' : '₹';

  return {
    currency,
    symbol,
    total: Math.round(totalInr * multiplier),
    selectedCasing,
    drillingRatePerFt,
    breakdown: [
      {
        item: `Drilling charges (${depthFt} ft @ ₹${drillingRatePerFt}/ft)`,
        amount: Math.round(drillingTotal * multiplier),
        detail: `Standard rock drilling rate (1 ft = ₹110) for ${depthFt} ft depth`
      },
      {
        item: `Casing Pipe (${casingFt} ft • ${selectedCasing.shortName})`,
        amount: Math.round(casingTotal * multiplier),
        detail: `${selectedCasing.name} @ ₹${selectedCasing.ratePerFt}/ft`
      },
      {
        item: `Submersible Pump (${pumpHp} HP Stage)`,
        amount: Math.round(pumpCost * multiplier),
        detail: `Selected for ~${depthFt} ft total dynamic head`
      },
      {
        item: `Column Pipe & Heavy 3-Core Cable`,
        amount: Math.round((cableCost + columnPipeCost) * multiplier),
        detail: `${cableLength} ft submersible copper cable & high-pressure column pipes`
      },
      {
        item: `Casing Installation, Cap & Starter Panel`,
        amount: Math.round((accessoriesCost + casingLabour) * multiplier),
        detail: 'Pipe socket welding, digital starter box, lightning arrester & MS cover'
      },
      {
        item: `Rig Mobilization & Labour Allowance`,
        amount: Math.round(mobilizationCost * multiplier),
        detail: 'Heavy DTH rig transport, diesel surcharge & setup crew'
      }
    ]
  };
}
