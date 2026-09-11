# Project-level polygons — PR split plan

The branch `feat/project-level-polygons-admin` has **21 website commits + 3 microservices commits**. One mega-PR would mix low-risk new files with sensitive edits to shared, live site-page code. But a fine-grained 8-PR stack is overkill for a solo branch — the only boundary worth enforcing is **isolating the 🟥 shared-site edits** (the site polygon review is in production and must stay backward-compatible) from the 🟩 net-new project files.

So: **3 PRs.**

Base branch: the feature branch was cut from `main`, but both repos default to `staging`. Decide the base and rebase before cutting the frontend split.

## Review-risk key
- 🟥 **touches shared site-page code** — must stay backward-compatible (default to prior behavior). Highest scrutiny.
- 🟩 **net-new files** — project-only; low blast radius.

---

### PR-1 — Backend (microservices repo)
All 3 commits: `f212e86e` (`GET /validations/v3/projects/:projectUuid`), `acd3dc65` (`GET /research/v3/sitePolygons/siteReviewRollup?projectId=`), `def809e1` (migration `202609071600-add-criteria-site-overlap-lookup-index` on `criteria_site`).
Separate repo, so it's a PR regardless; ships first (the frontend connections call these). Specs pass.
**Call out:** the `criteria_site (criteria_id, valid, polygon_id)` index likely belongs in prod regardless — the OVERLAPPING validator uses the same lookup; without it the rollup overlap column full-scans ~846k rows/polygon (minutes → ~80ms).

### PR-2 — Shared site-polygon components: project-scope options 🟥
The high-scrutiny frontend PR — every change defaults to site behavior; reviewer confirms the live site page is untouched in practice. Small, self-contained, no project files (can merge independently).
Commits: `572e89390` (additive props across `src/pages/site/[uuid]/components|hooks/*`: `showSiteColumn`, `entityScope`, `entityType/entityModel`, site facet, `searchSiteName`, overlap `overlapValidationsSource`; `src/utils/polygonAnalytics.ts`; analytics bits of `src/context/mapArea.utils.ts`), `009e0a923` (overlap-source param + the `ApprovePolygonConfirmation` prune-on-open correctness fix), the view-only gate touch to `PolygonEditDrawer` + `mapArea.utils` from `5271fcfee`, and the shared-map drill-in touch from `83bbd6f7d` (`SitePolygonMapSection.tsx`, `sitePolygonReview/SitePolygonsWorkspace.tsx`, `PolygonsMap.tsx` — photo-marker suppression at project scope).
Ships with `polygonTableRow.utils.test.ts`. **Focus:** assert each edit is a no-op when not at project scope.

### PR-3 — Project feature (everything net-new) 🟩, stacked on PR-2
The whole project surface: review workspace + admin entry (`4cd7609d4`, `5eb30dc6c`, project-side of `5271fcfee`, Bootstrap allow-list `031986ce9`), validations connection (`4ba551bb3`, `src/connections/Validation.ts`), bulk edit + Phase-1 scale spine (`864e71971`, `6ee8d8bd7`, `c123babdf`, `loadSitePolygonCount` in `SitePolygons.ts`), and the site-rollup + drill-in layer (`a1e9430a5`, `ef23b439d`, project side of `83bbd6f7d`, `b88fb8b7d`, `cd7d747a6`, `447899030`, `5fd884f76`, `9b585ba8c`, `f4950bdbb`) — plus the docs commits (`56febca03`, and the plan docs riding in `864e71971`/`a1e9430a5`/`f4950bdbb`).
Depends on PR-2 (shared props) + PR-1 (endpoints, at runtime). Mostly net-new project files.

---

## Notes / cleanups before opening PRs
- **Base branch:** off `main`; repos default to `staging`. Pick + rebase first.
- **PR-2 is the whole review budget** — it gathers every shared-site touch (props, drawer gate, Bootstrap, map drill-in) so PR-3 is pure project code. Each edit must default to site behavior; call that out explicitly.
- **Generated types:** `getProjectValidation` (PR-3) + the `siteReviewRollup` types are hand-added; run `yarn generate:researchService` to replace them once PR-1 deploys.
- **Known debt to flag in PR-3:** copied validation-run polling in `ProjectPolygonsWorkspace` (vs refactoring the 1264-line site workspace); the "virtual site" cast (`project as unknown as SiteFullDto`); loose filter cast in `loadSitePolygonCount`; drill-in still load-alls a mega-site (within-site scale, follow-up T10).
- **Unverified at runtime** (needs DB pass; blocks merge, not review): approve/request-info write-backs, bulk attribute edit end-to-end, map tiles at scale. Scale spine + rollup gate verified live on the 10,977-polygon Rwanda project (`cd46fa33`).
- **local `_document.tsx`** analytics-off tweak stays uncommitted / out of every PR.
