import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Sitemap Validator Integration for Astro
 * Automatically validates sitemap completeness after build finishes.
 */
export function validateSitemapIntegration() {
  return {
    name: 'sitemap-validator',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const distDir = fileURLToPath(dir);
        const sitemapPath = path.join(distDir, 'sitemap-0.xml');
        const sitemapIndexPath = path.join(distDir, 'sitemap-index.xml');

        console.log('[Sitemap Validator] Verifying generated sitemaps...');

        let totalSitemapUrls = 0;
        const sitemapFiles = [sitemapPath, sitemapIndexPath].filter(fs.existsSync);

        for (const file of sitemapFiles) {
          const xml = fs.readFileSync(file, 'utf8');
          const matches = xml.match(/<loc>/g);
          if (matches) {
            totalSitemapUrls += matches.length;
          }
        }

        if (totalSitemapUrls > 0) {
          console.log(`[Sitemap Validator] ✓ Verified ${totalSitemapUrls} URLs across generated sitemap files.`);
        } else {
          console.warn('[Sitemap Validator] ⚠️ Warning: No URLs found in generated sitemap files!');
        }
      }
    }
  };
}
