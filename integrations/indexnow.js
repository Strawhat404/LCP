/**
 * IndexNow Integration for Astro
 * Automatically notifies search engines (Bing, Yandex) when content is updated
 */
export function indexNow() {
  return {
    name: 'indexnow',
    hooks: {
      'astro:build:done': async ({ dir, pages }) => {
        const key = '79d7fba2-21e6-41f4-81f3-9157fb02d980';
        const keyLocation = `https://www.mylifecareplanning.com/${key}.txt`;
        const host = 'www.mylifecareplanning.com';
        
        // Build URL list from pages (limit to 10,000 URLs per request)
        const urls = pages
          .map(page => `https://${host}${page.pathname}`)
          .slice(0, 10000);
        
        console.log(`[IndexNow] Submitting ${urls.length} URLs to search engines...`);
        
        try {
          // Submit to Bing/IndexNow API (auto-syncs to Yandex and other partners)
          const response = await fetch('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
              host: host,
              key: key,
              keyLocation: keyLocation,
              urlList: urls
            })
          });
          
          if (response.ok) {
            console.log('[IndexNow] ✓ Successfully notified search engines');
          } else {
            console.warn(`[IndexNow] Warning: API returned status ${response.status}`);
          }
        } catch (error) {
          console.error('[IndexNow] Error submitting URLs:', error.message);
        }
      }
    }
  };
}
