// Script to convert US GeoJSON to SVG paths using Albers USA projection
// Run with: node scripts/generate_svg_paths.js

const fs = require('fs');
const path = require('path');

// Albers USA projection parameters
// Standard parallels: 29.5, 45.5; Center: -96, 37.5
const DEG = Math.PI / 180;

function albersUSA(lon, lat) {
  // Continental US: Albers Equal Area
  const phi0 = 37.5 * DEG;
  const phi1 = 29.5 * DEG;
  const phi2 = 45.5 * DEG;
  const lam0 = -96 * DEG;

  const n = (Math.sin(phi1) + Math.sin(phi2)) / 2;
  const c = Math.cos(phi1) * Math.cos(phi1) + 2 * n * Math.sin(phi1);
  const rho0 = Math.sqrt(c - 2 * n * Math.sin(phi0)) / n;

  const phi = lat * DEG;
  const lam = lon * DEG;
  const rho = Math.sqrt(c - 2 * n * Math.sin(phi)) / n;
  const theta = n * (lam - lam0);

  const x = rho * Math.sin(theta);
  const y = rho0 - rho * Math.cos(theta);
  return [x, y];
}

// Scale and translate to SVG viewport 960x600
function project(lon, lat, isAlaska, isHawaii) {
  if (isAlaska) {
    // Alaska: scaled down and positioned bottom-left
    const phi0 = 60 * DEG;
    const phi1 = 55 * DEG;
    const phi2 = 65 * DEG;
    const lam0 = -154 * DEG;
    const n = (Math.sin(phi1) + Math.sin(phi2)) / 2;
    const c = Math.cos(phi1) * Math.cos(phi1) + 2 * n * Math.sin(phi1);
    const rho0 = Math.sqrt(c - 2 * n * Math.sin(phi0)) / n;
    const phi = lat * DEG;
    const lam = lon * DEG;
    const rho = Math.sqrt(c - 2 * n * Math.sin(phi)) / n;
    const theta = n * (lam - lam0);
    const x = rho * Math.sin(theta);
    const y = rho0 - rho * Math.cos(theta);
    // Scale 0.35x, position at bottom-left
    return [x * 0.35 * 1000 + 112, -(y * 0.35 * 1000) + 550];
  }
  if (isHawaii) {
    // Hawaii: positioned bottom-center-left
    const phi0 = 20 * DEG;
    const phi1 = 8 * DEG;
    const phi2 = 18 * DEG;
    const lam0 = -157 * DEG;
    const n = (Math.sin(phi1) + Math.sin(phi2)) / 2;
    const c = Math.cos(phi1) * Math.cos(phi1) + 2 * n * Math.sin(phi1);
    const rho0 = Math.sqrt(c - 2 * n * Math.sin(phi0)) / n;
    const phi = lat * DEG;
    const lam = lon * DEG;
    const rho = Math.sqrt(c - 2 * n * Math.sin(phi)) / n;
    const theta = n * (lam - lam0);
    const x = rho * Math.sin(theta);
    const y = rho0 - rho * Math.cos(theta);
    return [x * 1000 + 220, -(y * 1000) + 570];
  }

  const [x, y] = albersUSA(lon, lat);
  // Scale to 960x600 viewport
  return [x * 1000 + 480, -(y * 1000) + 300];
}

function ringToPath(ring, isAlaska, isHawaii) {
  return ring.map((pt, i) => {
    const [x, y] = project(pt[0], pt[1], isAlaska, isHawaii);
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ') + ' Z';
}

function featureToPath(feature) {
  const name = feature.properties.name;
  const isAlaska = name === 'Alaska';
  const isHawaii = name === 'Hawaii';
  const geom = feature.geometry;

  if (geom.type === 'Polygon') {
    return geom.coordinates.map(ring => ringToPath(ring, isAlaska, isHawaii)).join(' ');
  } else if (geom.type === 'MultiPolygon') {
    return geom.coordinates.map(poly =>
      poly.map(ring => ringToPath(ring, isAlaska, isHawaii)).join(' ')
    ).join(' ');
  }
  return '';
}

// State name to slug and code mapping
const stateMap = {
  'Alabama': { slug: 'alabama', code: 'AL' },
  'Alaska': { slug: 'alaska', code: 'AK' },
  'Arizona': { slug: 'arizona', code: 'AZ' },
  'Arkansas': { slug: 'arkansas', code: 'AR' },
  'California': { slug: 'california', code: 'CA' },
  'Colorado': { slug: 'colorado', code: 'CO' },
  'Connecticut': { slug: 'connecticut', code: 'CT' },
  'Delaware': { slug: 'delaware', code: 'DE' },
  'District of Columbia': { slug: 'district-of-columbia', code: 'DC' },
  'Florida': { slug: 'florida', code: 'FL' },
  'Georgia': { slug: 'georgia', code: 'GA' },
  'Hawaii': { slug: 'hawaii', code: 'HI' },
  'Idaho': { slug: 'idaho', code: 'ID' },
  'Illinois': { slug: 'illinois', code: 'IL' },
  'Indiana': { slug: 'indiana', code: 'IN' },
  'Iowa': { slug: 'iowa', code: 'IA' },
  'Kansas': { slug: 'kansas', code: 'KS' },
  'Kentucky': { slug: 'kentucky', code: 'KY' },
  'Louisiana': { slug: 'louisiana', code: 'LA' },
  'Maine': { slug: 'maine', code: 'ME' },
  'Maryland': { slug: 'maryland', code: 'MD' },
  'Massachusetts': { slug: 'massachusetts', code: 'MA' },
  'Michigan': { slug: 'michigan', code: 'MI' },
  'Minnesota': { slug: 'minnesota', code: 'MN' },
  'Mississippi': { slug: 'mississippi', code: 'MS' },
  'Missouri': { slug: 'missouri', code: 'MO' },
  'Montana': { slug: 'montana', code: 'MT' },
  'Nebraska': { slug: 'nebraska', code: 'NE' },
  'Nevada': { slug: 'nevada', code: 'NV' },
  'New Hampshire': { slug: 'new-hampshire', code: 'NH' },
  'New Jersey': { slug: 'new-jersey', code: 'NJ' },
  'New Mexico': { slug: 'new-mexico', code: 'NM' },
  'New York': { slug: 'new-york', code: 'NY' },
  'North Carolina': { slug: 'north-carolina', code: 'NC' },
  'North Dakota': { slug: 'north-dakota', code: 'ND' },
  'Ohio': { slug: 'ohio', code: 'OH' },
  'Oklahoma': { slug: 'oklahoma', code: 'OK' },
  'Oregon': { slug: 'oregon', code: 'OR' },
  'Pennsylvania': { slug: 'pennsylvania', code: 'PA' },
  'Rhode Island': { slug: 'rhode-island', code: 'RI' },
  'South Carolina': { slug: 'south-carolina', code: 'SC' },
  'South Dakota': { slug: 'south-dakota', code: 'SD' },
  'Tennessee': { slug: 'tennessee', code: 'TN' },
  'Texas': { slug: 'texas', code: 'TX' },
  'Utah': { slug: 'utah', code: 'UT' },
  'Vermont': { slug: 'vermont', code: 'VT' },
  'Virginia': { slug: 'virginia', code: 'VA' },
  'Washington': { slug: 'washington', code: 'WA' },
  'West Virginia': { slug: 'west-virginia', code: 'WV' },
  'Wisconsin': { slug: 'wisconsin', code: 'WI' },
  'Wyoming': { slug: 'wyoming', code: 'WY' },
};

// Load GeoJSON
const geojsonPath = path.join(__dirname, 'us-states.json');
const geojson = JSON.parse(fs.readFileSync(geojsonPath, 'utf8'));

const result = {};

for (const feature of geojson.features) {
  const name = feature.properties.name;
  if (name === 'Puerto Rico') continue;
  const info = stateMap[name];
  if (!info) continue;

  // Calculate centroid for label position
  const geom = feature.geometry;
  let coords = [];
  if (geom.type === 'Polygon') {
    coords = geom.coordinates[0];
  } else if (geom.type === 'MultiPolygon') {
    // Use largest polygon for centroid
    let maxLen = 0;
    for (const poly of geom.coordinates) {
      if (poly[0].length > maxLen) {
        maxLen = poly[0].length;
        coords = poly[0];
      }
    }
  }

  const sumLon = coords.reduce((s, p) => s + p[0], 0) / coords.length;
  const sumLat = coords.reduce((s, p) => s + p[1], 0) / coords.length;
  const isAlaska = name === 'Alaska';
  const isHawaii = name === 'Hawaii';
  const [cx, cy] = project(sumLon, sumLat, isAlaska, isHawaii);

  const d = featureToPath(feature);

  result[info.code] = {
    slug: info.slug,
    path: d,
    labelX: cx.toFixed(1),
    labelY: cy.toFixed(1),
  };
}

// Write output as JSON
fs.writeFileSync(
  path.join(__dirname, 'state_paths.json'),
  JSON.stringify(result, null, 2)
);

console.log('Done! Generated paths for', Object.keys(result).length, 'states.');
