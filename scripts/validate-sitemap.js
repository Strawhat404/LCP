/**
 * Sitemap Validation Script
 * Verifies that all expected pages are included in the generated sitemap
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllStates, getCitiesByState, getProvidersByCity } from '../src/utils/data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if sitemap exists
const sitemapPath = path.join(__dirname, '../dist/sitemap-0.xml');
if (!fs.existsSync(sitemapPath)) {
  console.error('❌ Sitemap not found at dist/sitemap-0.xml');
  console.error('   Run `npm run build` first to generate the sitemap');
  process.exit(1);
}

// Read and parse sitemap
const sitemapXML = fs.readFileSync(sitemapPath, 'utf8');
const urlMatches = sitemapXML.matchAll(/<loc>(.*?)<\/loc>/g);
const sitemapUrls = Array.from(urlMatches).map(match => match[1]);

console.log('📊 Sitemap Validation Report\n');
console.log(`Found ${sitemapUrls.length} URLs in sitemap\n`);

// Calculate expected URLs
let expectedUrls = [];

// Static pages
const staticPages = [
  '/',
  '/physician-life-care-planners/',
  '/what-is-life-care-planning/',
  '/what-is-a-physician-life-care-planner/',
  '/how-much-does-a-life-care-plan-cost/',
  '/physician-vs-nurse-life-care-planner/',
  '/when-should-an-attorney-order-a-life-care-plan/',
  '/who-are-life-care-planners/',
  '/contact/',
  '/privacy-policy/',
  '/terms-of-service/',
  '/accessibility/',
  '/advertising-disclosure/',
  '/do-not-sell/',
  '/data-removal/',
];

staticPages.forEach(page => {
  expectedUrls.push(`https://www.mylifecareplanning.com${page}`);
});

// State pages
const states = getAllStates();
states.forEach(state => {
  expectedUrls.push(`https://www.mylifecareplanning.com/physician-life-care-planners/${state}/`);
  
  // City pages
  const cities = getCitiesByState(state);
  cities.forEach(city => {
    expectedUrls.push(`https://www.mylifecareplanning.com/physician-life-care-planners/${state}/${city}/`);
    
    // Provider pages
    const providers = getProvidersByCity(state, city);
    providers.forEach(provider => {
      expectedUrls.push(`https://www.mylifecareplanning.com/physician-life-care-planners/${state}/${city}/${provider.slug}/`);
    });
  });
});

// Comparison
console.log(`Expected URLs: ${expectedUrls.length}`);
console.log(`Found URLs:    ${sitemapUrls.length}`);

if (expectedUrls.length === sitemapUrls.length) {
  console.log('\n✅ Sitemap validation PASSED - URL count matches!');
  process.exit(0);
} else {
  const diff = expectedUrls.length - sitemapUrls.length;
  console.log(`\n❌ Sitemap validation FAILED`);
  console.log(`   Missing ${Math.abs(diff)} URLs from sitemap`);
  
  // Find missing URLs (sample)
  const missing = expectedUrls.filter(url => !sitemapUrls.includes(url));
  if (missing.length > 0) {
    console.log(`\n   First 10 missing URLs:`);
    missing.slice(0, 10).forEach(url => console.log(`   - ${url}`));
  }
  
  process.exit(1);
}
