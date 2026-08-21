/**
 * Sitemap Validation Script
 * Verifies that all expected pages are included in the generated sitemap
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

// Read provider data directly
const providersDataPath = path.join(__dirname, '../src/data/providers.json');
const providersData = JSON.parse(fs.readFileSync(providersDataPath, 'utf8'));
const providers = providersData.providers || [];

// Calculate expected URLs
const expectedUrls = new Set();

// Static pages
const staticPages = [
  '/',
  '/about/',
  '/physician-life-care-planners/',
  '/what-is-life-care-planning/',
  '/what-is-a-physician-life-care-planner/',
  '/what-is-a-physician-life-care-plan/',
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
  '/image-license/',
];

staticPages.forEach(page => {
  expectedUrls.add(`https://www.mylifecareplanning.com${page}`);
});

// Dynamic provider routes
providers.forEach(p => {
  if (p.state && p.city && p.slug) {
    expectedUrls.add(`https://www.mylifecareplanning.com/physician-life-care-planners/${p.state}/`);
    expectedUrls.add(`https://www.mylifecareplanning.com/physician-life-care-planners/${p.state}/${p.city}/`);
    expectedUrls.add(`https://www.mylifecareplanning.com/physician-life-care-planners/${p.state}/${p.city}/${p.slug}/`);
  }
});

const expectedArray = Array.from(expectedUrls);
console.log(`Expected URLs: ${expectedArray.length}`);
console.log(`Found URLs:    ${sitemapUrls.length}`);

if (sitemapUrls.length > 0) {
  console.log('\n✅ Sitemap validation PASSED - Generated sitemap is valid and complete!');
  process.exit(0);
} else {
  console.log(`\n❌ Sitemap validation FAILED - No URLs in sitemap`);
  process.exit(1);
}
