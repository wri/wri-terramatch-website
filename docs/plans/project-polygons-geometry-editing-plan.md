# Re-enabling geometry editing at project scope — plan

Status: **plan only** (no code yet). Phase 2 of project-level polygon review.
Related: `project-level-polygons-admin.md` (Phase 1 build), `project-polygons-scale-options.md` (§0 — the individual-view path is where geometry/overlap/plant-start fixes live per the PM).

## Goal
Let an admin, from the project-level polygon review screen, open an individual polygon and edit its **geometry** (reshape vertices, fix self-intersections/overlaps) and the per-polygon fields that the PM said are edited individually (**plant start date**), then save — with validations and cross-site overlaps correctly recomputed. Scope is **reshaping existing polygons**, NOT drawing/uploading new ones (a new polygon has no unambiguous site home at project scope — stays out).

## What Phase 1 deliberately gated (what this plan reverses)
Two flags, both set in `ProjectPolygonsWorkspace.tsx` mount effect (lines ~477-481):

1. `registerPolygonGeometryEditable(false)` — read at `PolygonEditContent.tsx:278` in `shouldMapEditPolygon`. Disables the map reshape interaction (MapboxDraw handler, draft geometry) for the individual polygon.
2. `registerPolygonReviewOnly(true)` — read at `PolygonEditDrawer.tsx:79`. Hides the drawer's entire **Edit** tab (which contains geometry + per-polygon attributes + versions + monitoring plots + photos), leaving only System Validation + Comments.

So today the individual drawer at project scope is view-only. Re-enabling geometry = re-showing an editing surface and letting the map handler run.

## Key facts that make this viable (already true)
- **Per-polygon `siteId` correctness.** Geometry read/save resolves the site from the *polygon's own* `siteId`, not the workspace's "virtual site": `resolvedSiteUuid = polygon?.siteId ?? siteData.uuid` (`PolygonEditContent.tsx:281`), and save sends `siteId: polygon.siteId` (`:512`) with a guard that blocks the edit if `siteId` is missing (`:501`). `SitePolygonLightDto` carries `siteId` for every row. So cross-site geometry editing is already correct — this is the hard part and it's done.
- **Fullscreen map on drawer open** already works at project scope (`SitePolygonMapSection` goes fullscreen when `isEditPolygonOpen`).
- **Versions** plumbing exists (`useListPolygonVersions`, refetch) and is entity-agnostic.
- **Backend needs nothing new** — geometry save / clipping / version endpoints are polygon-uuid-keyed, not scope-keyed.

## Decisions to make before building
1. **Full Edit tab vs geometry-focused surface.** Attribute editing is now handled in *bulk* at project scope (`PolygonBulkEditDrawer`). Re-showing the full individual Edit tab reintroduces per-polygon attribute editing (harmless, just redundant) alongside geometry, plant-start, versions, plots, photos. Options:
   - (a) **Re-show the full Edit tab** — simplest, most consistent with the site page; per-polygon attribute edit coexists with bulk. Recommended.
   - (b) **Geometry + plant-start only** — trim the tab to the individual-only fields; more work, diverges from the site component.
   Recommendation: **(a)**, to maximize reuse.
2. **Gate per-polygon, not per-workspace.** Don't just flip the two flags globally for the workspace — some deployments may want review-only. Prefer a workspace prop (e.g. `geometryEditable`, default false) that drives both `registerPolygonGeometryEditable` and `registerPolygonReviewOnly`, so the capability is a deliberate switch, and later can be gated by user permission.
3. **Post-save refresh must be surgical at scale.** THIS IS THE REAL RISK. Today a save triggers the copied validation-run/refresh path which reloads the **entire project** polygon set + all validations + all overlap validations (`refetchPolygons()` + `fetchAllValidationPages(true)` + `fetchOverlapValidations(true)`). On a 10k-polygon project that's ~100 requests + full re-render after every single geometry edit — unacceptable. Re-enabling geometry at project scope **requires** narrowing the post-edit refresh to the edited polygon + its overlap partners, not a full reload. (At site scale this was fine; at project scale it isn't.)

## Tasks (sequenced)
1. **Add a `geometryEditable` prop to `ProjectPolygonsWorkspace`** (default `false`). Drive the mount effect from it: when true, `registerPolygonGeometryEditable(true)` + `registerPolygonReviewOnly(false)`; when false, keep today's gates. (Wire it from the shell/route; keep default off until the refresh work below lands.)
2. **Surgical post-edit refresh** (the load-bearing task): after a geometry save at project scope, refresh only (a) the edited polygon's row/validation and (b) the overlap partners whose relationship changed — via targeted `fetchPolygonValidation(uuid)` + a scoped overlap re-fetch — instead of `fetchAllValidationPages(true)`/`fetchOverlapValidations(true)`. Requires either a partners-of(uuid) lookup client-side (we already build overlap pairs) or a small backend `overlaps for polygon` read. Verify the map tile for the edited polygon re-renders (GeoServer MVT is uuid-filtered; may need a tile cache bust for that uuid).
3. **Cross-site overlap recompute on geometry change.** A reshape can create/resolve a *cross-site* overlap. Confirm the OVERLAPPING validator re-runs project-wide after the edit (it already compares across the project) and that the refreshed overlap set + anomaly stepper pick up the change. This is the project-scope-specific correctness check.
4. **Re-show the Edit tab** (decision 1a): remove/relax the `reviewOnly` hide for the geometry-enabled case; confirm the tab's save/versions/plots/photos all work with the per-polygon `siteId` (they already resolve it).
5. **Confirm no "create/draw new" path leaks in.** `useStartSitePolygonDrawing` / add-polygon entry points must stay absent at project scope (create is explicitly out). Reshape-existing only.
6. **Plant-start individual edit** rides along with the Edit tab (it's an attribute field) — verify it saves per-polygon.
7. **Tests + verification:** unit where possible (gate prop → flags); DB-pass on a real project — reshape a polygon on one site, confirm save, version created, its validation re-runs, a cross-site overlap it creates/resolves updates the stepper, and the rest of the project did NOT fully reload.

## Buildable-now vs needs-services
- Tasks 1, 4, 5 (gating + tab visibility): buildable + tsc/lint now.
- Tasks 2, 3, 6, 7 (refresh scoping, overlap recompute, save correctness): need the running stack + DB to verify; task 2's design can be written now.

## Recommendation
Do **not** ship geometry editing at project scope by simply flipping the two flags — the **full-reload-after-every-save** behavior (task 2) would make it painful on exactly the large projects that need it. Sequence: land the surgical-refresh work first (task 2), then flip the gate behind the `geometryEditable` prop (task 1), verify cross-site overlap recompute (task 3) on the DB. Ship geometry editing off by default until task 2 is proven.
