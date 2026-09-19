# Linart Construction — Ultra-Premium Website Audit

**Audit date:** September 19, 2026

**Scope:** Homepage, About, Services, Service Areas, Contact, shared navigation/footer, brand presentation, responsive behavior, accessibility, search metadata and conversion flow.

**Protected scope:** The Projects page and its galleries were intentionally left unchanged.

## Executive outcome

The site already had a strong editorial foundation: restrained colors, confident typography, generous spacing and real project photography. The largest remaining gap was consistency. The old textured seal did not reproduce clearly at navigation size, several long sections became text-heavy, some site-level metadata still identified the original site generator, and the contact experience described itself as unfinished.

This release turns those gaps into a more coherent premium experience. Photography now appears where it adds proof or pacing, the brand mark and company name operate as one scalable identity, service discovery has direct anchors, the contact form provides a useful copy fallback, and the shared technical foundation is more complete.

## What changed

### 1. Brand identity

- Replaced the small textured 3D seal in the header and footer with a crisp, scalable architectural mark.
- Preserved the recognizable Linart visual idea: the **L**, roofline and window.
- Unified the mark, `LINART` wordmark and `CONSTRUCTION INC.` descriptor into one repeatable lockup.
- Added a refined `NEW JERSEY · EST. 2004` footer signature.
- Created a dedicated SVG favicon so the browser tab now carries the Linart identity instead of the Vite placeholder.

### 2. Photography strategy

The goal was not to fill every empty surface. Images were added where they improve trust, context or visual rhythm.

| Area | Upgrade | Purpose |
|---|---|---|
| Services | Six service-specific project images | Makes each capability tangible and breaks up a long text-only list |
| About | Three-image craftsmanship composition | Shows finish quality and connects company values to visible details |
| Service Areas | Two-image active-project collage | Grounds statewide coverage in real Linart work and branded field presence |
| Contact | Real jobsite image and supporting copy | Adds trust at the moment a visitor is deciding whether to inquire |
| Homepage close | Finished-kitchen photo behind the final call to action | Replaces an empty utility panel with a stronger emotional finish |

One additional progress image was optimized for web use. Existing high-quality assets were reused elsewhere so the visual system feels connected without adding unnecessary download weight.

### 3. Navigation and service discovery

- Linked homepage and footer service labels directly to the matching service section.
- Added reliable hash scrolling with fixed-header spacing.
- Added active-page semantics to desktop and mobile navigation.
- Added Escape-to-close behavior and background scroll locking for the mobile menu.
- Added a keyboard skip link to bypass navigation.
- Added visible focus treatment for keyboard users.

### 4. Contact experience

- Removed internal-sounding copy about a server-side form being added later.
- Clarified exactly what happens when a visitor selects **Email Project Brief**.
- Added **Copy Brief** as a practical fallback when a device does not have a configured email application.
- Added browser autofill hints for name, email, phone and postal code.
- Improved list semantics, status announcements and mobile button layout.

### 5. Search, sharing and site identity

- Replaced the `Hostinger Horizons` fallback title and removed the generator label.
- Added canonical URLs and per-route Open Graph/Twitter metadata.
- Added crawler-visible global social metadata in the base document.
- Added `GeneralContractor` structured data with service area, contact details and service types.
- Added `robots.txt` and `sitemap.xml`.
- Added a branded 404 page with useful recovery paths.

### 6. Performance and resilience

- Kept below-the-fold project imagery lazy-loaded and asynchronously decoded.
- Preloaded only the homepage hero, the primary above-the-fold image.
- Reused optimized WebP assets across editorial placements.
- Added reduced-motion-safe brand interactions.
- Kept the new brand mark vector-based, so it remains sharp without a large image payload.

## Verification performed

- Production build: **passed** (`vite build`, 1,969 modules transformed).
- Targeted ESLint on all changed React files: **passed with zero errors**.
- Projects page source SHA-256 before and after:

  `ec5fc8e8f69b5dc19fa53cf4ab28aea95c8d8741d76ee0e96c0c31b18d275b56`
- New progress image: 1,600 × 1,200 WebP, approximately 156 KB.
- Mobile behavior, route structure, image alternatives, heading order and keyboard affordances were reviewed in source.

## Remaining high-value opportunities

These items require business input, a third-party service or new source material, so they were not invented in this release.

1. **Server-side inquiry delivery.** Connect the contact form to a verified mailbox endpoint with spam protection and delivery logging. The current mailto flow is honest and functional, but a hosted form endpoint would reduce friction further.
2. **Purpose-shot photography.** The next photo shoot should prioritize one finished exterior at golden hour, one wide finished kitchen, one wide finished bathroom, a clean crew portrait and three horizontal detail images. Those five shots would materially raise the ceiling of future campaigns and social sharing.
3. **Verified testimonials.** Add two to four concise homeowner quotes only after names, wording and publication permission are confirmed.
4. **Measurement.** Connect privacy-conscious analytics and Google Search Console after deployment, then track calls, project-brief clicks and service-section engagement.
5. **Claim verification.** Confirm that the existing `80+ combined years` statement remains current and documented before using it in paid campaigns.
6. **Dedicated social card.** A professionally composed 1,200 × 630 Linart share image would improve link previews beyond the current project-photo fallback.

## Editorial standard going forward

- Prefer real Linart work over generic stock photography.
- Use progress images when they demonstrate planning, structure or craft—not merely activity.
- Pair progress imagery with finished work whenever a true before/after sequence is available.
- Keep one dominant image per visual moment; avoid galleries that compete with the Projects page.
- Maintain warm, natural color and honest site conditions rather than over-processing images.
