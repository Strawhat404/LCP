/**
 * Generate SVG avatars for providers (self-hosted, no external dependencies)
 * This script creates simple initial-based avatars with color-coded backgrounds
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read provider data
const providersPath = path.join(__dirname, '../src/data/providers.json');
const data = JSON.parse(fs.readFileSync(providersPath, 'utf8'));
const providers = data.providers;

// Output directory
const outputDir = path.join(__dirname, '../public/avatars');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * Generate color from name (deterministic hue based on name)
 */
function generateColor(name) {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = hash % 360;
  return `hsl(${hue}, 65%, 50%)`;
}

/**
 * Get initials from name
 */
function getInitials(name) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Generate SVG avatar
 */
function generateSVG(name) {
  const initials = getInitials(name);
  const bgColor = generateColor(name);
  
  return `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="${bgColor}"/>
  <text x="100" y="100" font-family="Arial, sans-serif" font-size="80" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${initials}</text>
</svg>`;
}

// Generate avatars for all providers
let count = 0;
providers.forEach(provider => {
  const filename = `${provider.slug}.svg`;
  const filepath = path.join(outputDir, filename);
  const svg = generateSVG(provider.name);
  
  fs.writeFileSync(filepath, svg, 'utf8');
  count++;
});

console.log(`✓ Generated ${count} provider avatars in /public/avatars/`);
