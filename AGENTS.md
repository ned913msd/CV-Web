# AGENTS.md — CV-Web Learnings

## Project Structure

- 12 standalone landing pages under `proyectos/`, each a self-contained HTML+CSS+JS bundle with no shared dependencies. `shared/` directory was dead code (no project referenced it) and has been deleted.
- The CV portfolio (`index.html`) links to all projects as a gallery. `og:image` meta tags in 6 projects still reference local `.webp` files — they serve social previews and are intentionally separate from page `<img src>` values.

## Tooling Quirks

- **`register_preview` with `htmlPath`** only serves the single HTML file. CSS/JS referenced as relative paths (`style.css`, `script.js`) return 404. Use a proper HTTP server (`python3 -m http.server`) for full page testing with JS interactions.
- **Unsplash photo IDs from web search can 404.** Always curl-test URLs before committing. 3/60 failed on first attempt in this project.
- **Git credential mismatch:** `git push` may work via HTTPS with stored credentials while GitHub API calls fail with "must be a collaborator" if the stored credentials belong to a different account than the repo owner.

## Code Patterns

- **sed ordering for overlapping `src` matches:** When multiple `<img>` tags share the same `src` value (e.g. `lumisphere.webp` appearing 14 times), sed with `g` flag replaces ALL before specific-alt-text matches can run. Always do specific matches first, catch-all last.
- **CSS filters on re-used images are design, not workaround.** Original `brightness()`/`sepia()`/`hue-rotate()` filters on LumiSphere experience cards were intentional design choices — removing them when swapping to different photos changes the visual design.
- **`loading="lazy"` images show as unloaded in headless browser tests.** Lazy-loaded images below the fold return `naturalWidth: 0` even when URLs are valid. Verify via curl instead of DOM inspection.

## Architecture Decisions

- Each project uses its own font family (Inter, Playfair Display, Space Grotesk, Orbitron, etc.) and CSS variable set (8-31 vars per project). There is no shared design system.
- Countdown timers, IntersectionObserver scroll-reveal, header-scroll, and mobile-menu toggle are duplicated across 9-12 projects (~800 lines of near-identical JS). The deleted `shared/` directory was meant to solve this but was never wired up.
