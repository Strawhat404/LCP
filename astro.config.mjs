import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import { indexNow } from "./integrations/indexnow.js";
import { validateSitemapIntegration } from "./integrations/sitemap-validator.js";

export default defineConfig({
  output: "static",
  site: "https://www.mylifecareplanning.com",
  integrations: [
    tailwind(),
    sitemap({
      lastmod: new Date('2026-08-11'),
    }),
    indexNow(),
    validateSitemapIntegration(),
  ],
});
