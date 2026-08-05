import { readFileSync, writeFileSync } from 'fs';
import { feature } from 'topojson-client';

const topo = JSON.parse(readFileSync('scripts/states-albers-10m.json', 'utf8'));
const geojson = feature(topo, topo.objects.states);

// The albers-10m is already projected to a ~960x600 coordinate space
// We just need to convert each feature's geometry to SVG path string

const stateNameToCode = {
  'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
  'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
  'District of Columbia': 'DC', 'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI',
  'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS',
  'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
  'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
  'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV',
  'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
  'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK',
  'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
  'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV',
  'Wisconsin': 'WI', 'Wyoming': 'WY',
};

const stateCodeToSlug = {
  AL:'alabama',AK:'alaska',AZ:'arizona',AR:'arkansas',CA:'california',
  CO:'colorado',CT:'connecticut',DE:'delaware',DC:'district-of-columbia',
  FL:'florida',GA:'georgia',HI:'hawaii',ID:'idaho',IL:'illinois',IN:'indiana',
  IA:'iowa',KS:'kansas',KY:'kentucky',LA:'louisiana',ME:'maine',MD:'maryland',
  MA:'massachusetts',MI:'michigan',MN:'minnesota',MS:'mississippi',MO:'missouri',
  MT:'montana',NE:'nebraska',NV:'nevada',NH:'new-hampshire',NJ:'new-jersey',
  NM:'new-mexico',NY:'new-york',NC:'north-carolina',ND:'north-dakota',OH:'ohio',
  OK:'oklahoma',OR:'oregon',PA:'pennsylvania',RI:'rhode-island',SC:'south-carolina',
  SD:'south-dakota',TN:'tennessee',TX:'texas',UT:'utah',VT:'vermont',VA:'virginia',
  WA:'washington',WV:'west-virginia',WI:'wisconsin',WY:'wyoming',
};

function coordsToPath(coords) {
  return coords.map((pt, i) =>
    `${i === 0 ? 'M' : 'L'}${pt[0].toFixed(2)},${pt[1].toFixed(2)}`
  ).join(' ') + ' Z';
}

function geometryToPath(geom) {
  if (geom.type === 'Polygon') {
    return geom.coordinates.map(coordsToPath).join(' ');
  } else if (geom.type === 'MultiPolygon') {
    return geom.coordinates.map(poly => poly.map(coordsToPath).join(' ')).join(' ');
  }
  return '';
}

function centroid(geom) {
  let coords = [];
  if (geom.type === 'Polygon') {
    coords = geom.coordinates[0];
  } else if (geom.type === 'MultiPolygon') {
    // use the polygon with most points (largest)
    let max = 0;
    for (const poly of geom.coordinates) {
      if (poly[0].length > max) { max = poly[0].length; coords = poly[0]; }
    }
  }
  const x = coords.reduce((s, p) => s + p[0], 0) / coords.length;
  const y = coords.reduce((s, p) => s + p[1], 0) / coords.length;
  return [x, y];
}

const result = {};

for (const feat of geojson.features) {
  const name = feat.properties.name;
  const code = stateNameToCode[name];
  if (!code) continue;
  const slug = stateCodeToSlug[code];
  if (!slug) continue;

  const d = geometryToPath(feat.geometry);
  const [cx, cy] = centroid(feat.geometry);

  result[code] = { slug, d, cx: cx.toFixed(1), cy: cy.toFixed(1) };
}

writeFileSync('scripts/state_paths.json', JSON.stringify(result, null, 2));
console.log('Generated paths for', Object.keys(result).length, 'states');
