# Linart SEO Punch List — Implemented Technical & Content Foundation

**Implementation date:** September 20, 2026

## Completed in this SEO pass

- Updated homepage title and description around New Jersey custom homes and residential remodeling.
- Added route-specific SEO metadata for all core pages.
- Added seven dedicated, indexable service pages with unique titles, descriptions, H1s, visible copy and internal links:
  - New Custom Home Construction
  - Home Additions
  - Whole-Home Renovations
  - Kitchen Remodeling
  - Bathroom Remodeling
  - Basement Finishing
  - Deck & Patio Construction
- Added route-level `Service`, `WebPage` and `BreadcrumbList` structured data where applicable.
- Upgraded base structured data to a `GeneralContractor` + `WebSite` graph.
- Added a generated sitemap from the same canonical route registry used by React metadata.
- Added stable `lastmod`, `changefreq` and priority values to the route registry.
- Made sitemap generation part of every production build so new SEO routes cannot silently miss the sitemap.
- Updated `llms.txt` automatically from the expanded route registry.
- Replaced the stale homepage hero preload with the actual production hero image.
- Added explicit `index,follow,max-image-preview:large` robots metadata to indexable routes.
- Added a real noindex hard-404 shell.
- Changed Apache routing so unknown URLs return HTTP 404 instead of falling through to the homepage SPA shell.
- Generalized route-shell delivery so nested service URLs receive crawler-visible metadata before JavaScript runs.
- Added stronger internal service linking from the homepage, Services overview and footer.
- Expanded the service-area meta description to name the current core service counties.
- Kept the canonical host at `https://linartinc.com`.

## Intentionally not invented or automated

These items require third-party credentials, verified business data, or source material not present in the repository:

1. Google Search Console ownership / verification and manual indexing requests.
2. Google Business Profile changes.
3. GA4 or other analytics deployment without an approved privacy / measurement decision.
4. Customer testimonials without verified wording and permission.
5. City- or county-specific landing pages without enough unique local proof, project content and business value to avoid thin pages.
6. A street address in structured data when the business has not supplied one for public publication.
7. Paid-search conversion import or CRM integration without the relevant account access.

## Recommended next external actions after deployment

- Submit `https://linartinc.com/sitemap.xml` in Google Search Console.
- Request recrawl of the homepage, Services page and the seven new service URLs.
- Verify the canonical non-www HTTPS property.
- Monitor indexed-page count, search queries and Core Web Vitals.
- Add genuine project/location proof before creating county-specific SEO landing pages.
