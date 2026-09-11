# Project polygons — site rollup + in-place drill-in (integration plan)

Branch: `feat/project-level-polygons-admin` (website + microservices). Read-only exploration; no code changed.
Supersedes the "load gate + pick-a-status" large-project view in `ProjectPolygonsWorkspace.tsx`. Builds on `project-polygons-scale-options.md` §0 and `project-level-polygons-admin.md`.

Two product decisions are fixed inputs to this plan (not options):

1. **Drill-in is in place.** Clicking a site switches the project workspace to that site's polygon list + map, with a breadcrumb back (Project → Sites → [Site] → polygons). No deep-link to `/site/[uuid]/polygon-review`.
2. **Threshold is exactly 100 active polygons.** `< 100` → today's flat polygon list + map (unchanged). `>= 100` → site list with per-site rollup stats + a site-level rollup map. This replaces `resolveProjectPolygonLoadGate` (500) and the "pick a status" prompt as the primary large-project view.

All line numbers were read on the current branch head unless a branch is named. Prototype files were read via `git show design/project-data-experience:<path>` (that branch is a strict superset of `design/semantic-zoom-drilldown`; see §1).

---

## 0. Summary

- **Site list**: adapt the Sites view of `src/components/projectData/ProjectDataTable.tsx` (prototype, `design/project-data-experience`, lines 119-207) — port its columns/search/flag-filter onto the design-system `Table` the workspace already uses. The semantic-zoom `LevelCard` child list is too thin for review (name + count only); reference only.
- **Site rollup map**: reuse `src/components/semanticZoom/DrilldownMap.tsx` (prototype) near-verbatim — a self-contained Mapbox instance that draws site centroids labelled "name / N polygons" and fires `onSelectPolygon(uuid, siteId)`. Do **not** reuse how the prototype *computes* those centroids (it downloads every polygon's GeoJSON via `useProjectSitePolygonsGeoJson` — that is a load-all in disguise).
- **Data**: no per-site review rollup endpoint exists on `staging`/`main`. A per-site *indicator* rollup (`GET /research/v3/sitePolygons/indicatorRollup`) exists only on microservices `origin/dev` (8 commits, not on staging, approved-polygons-only basis, no validation buckets, no centroid). Plan: build a sibling **`GET /research/v3/sitePolygons/siteReviewRollup?projectId=`** (one GROUP BY, O(sites)) returning per site: active total, validation-status buckets, polygon-status buckets, overlap count, hectares, centroid lat/long. Interim (zero backend): `useSiteIndex({ projectUuid })` + `loadSitePolygonCount({ entityName: "sites" })` + `useBoundingBox({ siteUuid })` fan-out — N sites × 2 small requests; fine for a demo, not for shipping.
- **Drill-in**: URL state `?site=<uuid>` (port `navigate` from prototype `useSemanticZoom.ts:235-249`), and render the existing **`SitePolygonsWorkspace site={fullSite} variant="adminReview"`** for the drilled-in site — the canonical site review surface, zero duplication. Breadcrumb goes into the shell's `ProjectBanner breadcrumbs`.
- **Gate/tiles**: `projectPolygonLoadGate.ts` (500) is deleted; `useProjectPolygonStatusCounts` survives only as the interim source of the total for the 100 threshold, then is replaced by summing the rollup rows (one request instead of five). `ProjectPolygonSummaryTiles` become a read-only totals strip in rollup mode (derived from rollup sums; the click-to-filter-and-load-project-wide behaviour goes away with the gate).
- **Known limit (unchanged from scale-options §1)**: drilling into a mega-site (10,012 polygons) lands in the site workspace's load-all. The site list solves across-site scale, not within-site scale; a site-level status-filter gate is a follow-up.

---

## 1. Prototype inventory — what to reuse, adapt, or only reference

Branch comparison: `design/semantic-zoom-drilldown` (19 files, +1,697) is contained in `design/project-data-experience` (61 files, +6,220; commits `c47510dd8`…`798da3266`). `project-data-experience` carries the later versions of every semanticZoom file (e.g. `DrilldownMap.tsx` 318 vs 222 lines, `useSemanticZoom.ts` 365 vs 282 — the extra is the loss-timeline overlay) **plus** `entityData/*` and `projectData/*`. Take everything from `design/project-data-experience`.

| Prototype file (design/project-data-experience) | What it does | Verdict for this feature |
|---|---|---|
| `src/components/semanticZoom/DrilldownMap.tsx` (318 lines) | Standalone `mapboxgl.Map` (satellite-streets style, `mapboxToken` from `@/constants/environment:68` — exists on current branch). One GeoJSON source `promoteId: "uuid"`; layers: polygon fill/line, **site centroid circles** (`kind: "site"`, radius 12→22 by zoom, lines 190-207), **labels** "name\nN polygons" (lines 208-222), polygon markers (`kind: "polygonMarker"`). Click on fill/point/marker → `onSelectPolygon(uuid, siteId)` (253-262). `fitBounds` on every feature-collection change (270-278); `ResizeObserver` re-fit (118-122). `lossByUuid` feature-state for the loss timeline (285-299). | **Reuse as-is** (copy to `src/pages/project/[uuid]/projectPolygonReview/SiteRollupMap.tsx` or keep the path). Optional trim: drop the `lossByUuid` prop and `MARKER_LAYER` (not needed at the sites level). Props needed: `featureCollection` of site Point features, `onSelectPolygon`, `loading`. |
| `src/components/semanticZoom/useSemanticZoom.ts` | URL-driven level state (`?site=&polygon=`, `asParam` 364-366, `navigate` shallow push 235-249, `selectFromMap` 255-258), rollup fetch, **centroid computation from full project GeoJSON** (139-182), polygon page fetch, aggregate/claims. | **Reference; port two pieces verbatim**: `navigate` + `asParam` (URL state) and the *shape* of the site-centroid `FeatureCollection` (`properties: { uuid, siteId, kind: "site", name, polygons, polygonsLabel }`, 167-178) which `DrilldownMap` expects. **Do not port** the centroid computation (it needs every polygon's geometry) or the indicator aggregation. |
| `src/components/entityData/useEntityDrilldown.ts` | The de-duplicated project/site version of the above (same centroid code 86-130, same `ChildEntry` mapping 152-167). | Reference only — same caveat. |
| `src/connections/SiteIndicatorRollup.ts` (34 lines) | `v3Resource("siteIndicatorRollups", getSiteIndicatorRollup).index().filter().enabledProp()` + `useSiteIndicatorRollup(projectUuid)`. | **Reuse the shape** for the new `SiteReviewRollup.ts` connection (rename resource/endpoint). The generated types it imports exist only on the prototype branch (`researchServiceComponents.ts` diff: `getSiteIndicatorRollup` → `/research/v3/sitePolygons/indicatorRollup`; `researchServiceSchemas.ts`: `SiteIndicatorRollupDto`; `researchServiceConstants.ts`: `siteIndicatorRollups` resource). Hand-add the equivalents for the new DTO the way B1 did in the Phase 1 plan (§6 there), replace via codegen later. |
| `src/components/projectData/ProjectDataTable.tsx` (211 lines) | Sites \| Polygons toggle (`SegmentedToggle` 30-62); **Sites view**: search + "flagged only" (85-92, 123-138), raw `<table>` with columns Site name / Polygons / Hectares / In review (warning `Pill`) / Anomalies (`AnomaliesCell`) (143-192), row click → `router.push(/site/…)` (94). Data: `useSiteIndicatorRollup` + `useAllSitePolygons` (load-all, for anomaly counts — 74-83). | **Adapt**: port the columns, search and flag filter; render with `redesignComponents/dataDisplay/Table/Table.tsx` (`TableColumn { key, label, sortable, width, cell }` at `:14-21`) instead of the raw table so it matches `SitePolygonTableSection`; row click → in-place drill-in instead of navigation; drop the toggle and the `useAllSitePolygons` dependency. |
| `src/components/entityData/polygonTableCells.tsx` (`Pill`, `AnomaliesCell`, `FlaggedFilterButton`, `orDash`, `StatusPill`, `ValidationPill`) | Small presentational cells. | **Reuse** `Pill`, `AnomaliesCell`, `FlaggedFilterButton`, `orDash` (copy; ~130 lines). |
| `src/components/semanticZoom/LevelCard.tsx` (`ChildEntry { id, name, polygons, inReviewCount }`, child list 94-119) | Indicator panel + a name/count child list. | Reference only — the child list has no review columns. |
| `src/components/semanticZoom/aggregate.ts`, `levelContract.ts`, `IndicatorRow`, `SemanticZoomPanel`, `DeltaStrip`, `LossTimelinePlayer`, `useLossTimeline`, `connections/TreeCoverLossTimeline.ts` | Indicator (tree cover / loss / hectares) semantics. | Not needed for review. Skip. |
| `src/components/entityData/entityLevel.ts` (`childHref` → page navigation), `EntityMap.tsx`, `EntityKpiPanel.tsx`, `EntityDataView.tsx` | Page-navigation drill-down and the Overview layout. | Skip — decision 1 is in-place, and the review workspace has its own layout (`PageContent`/`PageItem`/`ResizeBox`). |
| `src/components/projectData/anomalies/useProjectAnomalies.ts` (prototype) | Anomaly engine over `useSiteIndicatorRollup` + `useAllSitePolygons` (load-all, lines 40-44). | Do not reuse — load-all. The current branch already has its own `useProjectAnomalies.ts` (overlap-pair ordering, no requests) for the flat/drilled-in polygon view. |
| `src/components/entityData/SiteDataTable.tsx`, `PolygonDataTable.tsx`, `projectData/BulkEditBar`, `InlineRowEditor`, `useSitePolygonEditing` | A second polygon table + inline editing. | Skip — the workspace already has `SitePolygonTableSection` + bulk actions; two polygon tables would be exactly the duplication the Phase 1 plan avoided. |

---

## 2. Data and endpoints

### 2.1 What the site list and site map need per site

| Field | Purpose | Source now (staging backend) | Source with the new rollup |
|---|---|---|---|
| `siteUuid`, `siteName`, site `status` | row identity, breadcrumb, drill-in | `useSiteIndex({ filter: { projectUuid } })` — `src/connections/Entity.ts:169-171`; query param `projectUuid` exists (`entityServiceComponents.ts:220`); `SiteLightDto` has `name`, `status`, `plantingStatus`, `treesPlantedCount`, `hectaresToRestoreGoal`, `totalHectaresRestoredSum` (`entityServiceSchemas.ts:1320-1356`) — **no polygon count** | rollup row |
| `activeTotal` (all active polygons) | "Polygons" column; project total = Σ rows → drives the 100 threshold | `loadSitePolygonCount({ entityName: "sites", entityUuid })` (`src/connections/SitePolygons.ts:257-275`, pageSize 1, reads `indexTotal`) — **one request per site** | rollup row |
| validation buckets `passed / partial / failed / notChecked` | per-site "Approvable / Failed / Not started" columns and the project totals strip | `loadSitePolygonCount` with `validationStatus[]` — **4 more requests per site** (do not do this in the interim; show total only) | rollup row (`site_polygon.validation_status`, entity `site-polygon.entity.ts:200`) |
| polygon-status buckets (`approved / pending-approval / draft / information-required`) | "In review" column (prototype's `inReviewCount`) | same fan-out problem | rollup row |
| `overlapCount` | "Overlaps" / flagged column | none cheap (would be `hasOverlap=true` count per site: +1 request each) | rollup row — reuse the EXISTS clause from `site-polygon-query.builder.ts:278-290` (`criteria_site.polygon_id = poly_id AND criteria_id = OVERLAPPING AND valid = 0`) |
| `hectares` (Σ `calc_area`, active) | column | `SiteLightDto.totalHectaresRestoredSum` (approved basis — state it in the UI) | rollup row |
| centroid `lat`, `long` | site marker on the map | `useBoundingBox({ siteUuid })` (`src/connections/BoundingBox.ts:43-47`; backend `bounding-box-query.dto.ts:28`) — **one request per site**, take bbox centre | rollup row: `AVG(sp.lat), AVG(sp.long)` (`site_polygon.lat/long`, entity lines 175-179) — or `ST_Centroid(ST_Collect(geom))` via the `polygon_geometry` join if lat/long are sparse |

**The tension, stated plainly:** everything above is trivially available client-side *if* we load all polygons (`SitePolygonLightDto` carries `siteId`, `siteName`, `status`, `validationStatus`, `calcArea`, `lat`, `long`). But for `>= 100` polygons we deliberately do not load rows, so the site rollup **must** be server-side (one request, O(sites)) or an interim per-site count fan-out (O(sites) requests, each tiny). The prototype's rollup (`indicatorRollup`, below) proves the pattern; the prototype's *centroids* and *anomaly counts* both silently fell back to load-all (`useProjectSitePolygonsGeoJson`, `useAllSitePolygons`) and must not be copied.

### 2.2 What exists in the backend today

Microservices repo `/Users/trevorhinkle/code/terramatch/terramatch-microservices`:

- **Current branch / `main` / `staging`: no rollup or aggregate endpoint.** `site-polygons.controller.ts` routes: `POST /`, `GET geojson`, `GET /` (index), `PATCH attributes`, `PATCH status/:status`, `PATCH /`, `DELETE /`, versions, uploads (lines 100-1011). The index forbids `siteId` together with `projectId` (`:286-298`) and has no group-by.
- **`origin/dev` only** (merge `d8858377`; `staging` is *not* an ancestor of `dev`, and `dev` is 8 commits ahead of / 127 behind staging): `GET /research/v3/sitePolygons/indicatorRollup?projectId=` (branch `feat/site-indicator-rollup`, files: `apps/research-service/src/site-polygons/site-polygons.controller.ts` `@Get("indicatorRollup")` lines 219-251; `site-polygons.service.ts` `getIndicatorRollup` line 783 — one raw SQL `GROUP BY s.uuid, s.name` over `v2_projects → v2_sites (status='approved', deleted_at IS NULL) → site_polygon (is_active=1, deleted_at IS NULL)`; `dto/site-indicator-rollup.dto.ts`, `dto/site-indicator-rollup-query.dto.ts`; also `uuid[]` index filter `e339138b` and `treeCoverLossTimeline`). Response is JSON:API with `addIndex({ requestPath, total, pageNumber: 1 })` — needed so the FE index connection resolves "loaded" (controller comment at 244-246).
  - Basis: **approved sites, approved polygons only**; `inReviewCount` = non-approved. No validation buckets, no overlap count, no centroid. Wrong basis for review (a review UI needs every active polygon on every active site), so extend or add a sibling rather than consume as-is.
- Bounding box by `siteUuid`/`projectUuid`/`polygonUuids` exists (`bounding-box.controller.ts:13-16`).

### 2.3 Recommendation: build `GET /research/v3/sitePolygons/siteReviewRollup?projectId=`

Follow the `indicatorRollup` shape exactly (copy the controller method, query DTO, `buildJsonApi` + `addIndex`, `policyService.authorize("read", SitePolygon)`), with this SQL core (per site, active polygons, non-deleted):

```
SELECT s.uuid AS siteUuid, s.name AS siteName, s.status AS siteStatus,
  COUNT(*)                                                  AS activeTotal,
  SUM(sp.validation_status = 'passed')                      AS passed,
  SUM(sp.validation_status = 'partial')                     AS partial,
  SUM(sp.validation_status = 'failed')                      AS failed,
  SUM(sp.validation_status IS NULL OR sp.validation_status = 'not_checked') AS notChecked,
  SUM(sp.status = 'approved')                               AS approved,
  SUM(sp.status = 'submitted' /* pending-approval value as stored */) AS pendingApproval,
  SUM(sp.status = 'draft')                                  AS draft,
  SUM(sp.status = 'needs-more-information')                 AS informationRequired,
  SUM(EXISTS (SELECT 1 FROM criteria_site cs WHERE cs.polygon_id = sp.poly_id AND cs.criteria_id = 3 AND cs.valid = 0)) AS overlapCount,
  SUM(sp.calc_area)                                         AS hectares,
  AVG(sp.lat) AS centroidLat, AVG(sp.long) AS centroidLong
FROM v2_projects p
JOIN v2_sites s ON s.project_id = p.id AND s.deleted_at IS NULL
JOIN site_polygon sp ON sp.site_id = s.uuid AND sp.is_active = 1 AND sp.deleted_at IS NULL
WHERE p.uuid = :projectUuid AND p.deleted_at IS NULL
GROUP BY s.uuid, s.name, s.status ORDER BY s.name
```

(Status literals must be checked against `libs/database` constants before writing — the FE maps them in `src/constants/polygonStatuses.ts`; `validation_status` values match `PolygonValidationStatus` in `polygonFilter.constants.ts:27`.) Sites with zero active polygons: include via `LEFT JOIN` so the list is complete (prototype DTO rationale, `site-indicator-rollup.dto.ts` comment: "omitting the row would assert the site does not exist").

Do **not** cherry-pick `feat/site-indicator-rollup` as a dependency (it targets `dev`, not staging; it carries loss-timeline work); copy its pattern.

FE: `src/connections/SiteReviewRollup.ts` cloned from the prototype `SiteIndicatorRollup.ts`; hand-added `getSiteReviewRollup` + `SiteReviewRollupDto` + `siteReviewRollups` resource in `src/generated/v3/researchService/*` (same B1 procedure), later replaced by `yarn generate:researchService`.

### 2.4 Interim (buildable now, zero backend) behind the same hook signature

`useProjectSiteRollup(projectUuid)` returns `{ loaded, rows: SiteReviewRollupRow[], total }`. Interim implementation: `useSiteIndex({ filter: { projectUuid }, pageSize: 100 })` → for each site `Promise.all` of `loadSitePolygonCount({ entityName: "sites", entityUuid })` and `loadBoundingBox`/`useBoundingBox({ siteUuid })` (centre of bbox as the marker). Validation/status buckets are `null` (columns render "—"). Cost: 2N requests, N = sites (GBM PPC: 21 sites → 42 tiny requests; Rwanda: 3). Acceptable to demo and to unblock the FE; swap the body for the single endpoint call when 2.3 lands. Keep the row type identical so nothing above the hook changes.

---

## 3. Grafting into `ProjectPolygonsWorkspace`

### 3.1 Mode resolution (replaces the load gate)

New pure helper `src/pages/project/[uuid]/projectPolygonReview/projectPolygonViewMode.ts` (+ tests), replacing `projectPolygonLoadGate.ts` / `.test.ts`:

```
export const PROJECT_SITE_ROLLUP_THRESHOLD = 100; // active polygons; >= → site rollup
type Mode = "loading" | "flat" | "rollup";
resolveProjectPolygonViewMode({ isLoadingTotal, totalError, total }) →
  loading            while the total is unknown and no error
  flat               total <  100
  rollup             total >= 100, OR totalError (fail-safe: never fall through to load-all when size is unknown — keep the gate's rationale, projectPolygonLoadGate.ts:24-27)
```

Source of `total`: today `useProjectPolygonStatusCounts(project.uuid).counts.total` (`useProjectPolygonStatusCounts.ts:36-84`, 5 parallel count requests). Once the rollup endpoint exists, use `Σ rows.activeTotal` from `useProjectSiteRollup` and drop the 5-request hook (the rollup is one request and also yields the buckets). Order of operations: fire the rollup first, always — it is cheap (O(sites)) and decides the mode; only in `flat` mode does `useAllSitePolygons({ entityName: "projects" })` fire.

### 3.2 Component split

`ProjectPolygonsWorkspace.tsx` (1,184 lines) currently mixes mode-independent chrome with the flat polygon view. Split:

```
ProjectPolygonsWorkspace            (providers: AnrMapOverlayProvider, PolygonEditDrawerProvider — unchanged, :1175-1181)
└─ ProjectPolygonsWorkspaceContent  → becomes a thin switch:
     mode === "flat"    → <ProjectFlatPolygonsView project />          (today's content, lines 100-1173, verbatim minus gate/tiles)
     mode === "rollup"  → drilledSiteUuid == null
                            ? <ProjectSiteRollupView project rows onSelectSite />   (NEW: totals strip + SiteRollupMap + ProjectSiteRollupTable)
                            : <ProjectSiteDrilldownView project siteUuid onBack />   (NEW wrapper: useFullSite → <SitePolygonsWorkspace site variant="adminReview" />)
```

- `ProjectFlatPolygonsView` = the current content with these removals: `resolveProjectPolygonLoadGate` + `hasRowReducingFilter` (lines 174-191), `isAwaitingStatusFilter` branch (1069-1094), `shouldLoadPolygons` gating on `useAllSitePolygons` `enabled` (210), on `projectOverlapValidations` (261-267) and on the validations fetch effect (507-515) — all become unconditional again, because in flat mode the project is known to be `< 100`. `ProjectPolygonSummaryTiles` (1063-1068) can stay in flat mode as the click-to-filter strip (harmless: the set is small) or be dropped for symmetry — recommend keep (it is already wired to `applyValidationStatuses`, 193-198).
- `ProjectSiteRollupView`: header (`PageItem title="Sites"` + Download All, reuse `downloadProjectSitePolygonsGeoJson` block 726-737), **totals strip** = `ProjectPolygonSummaryTiles` fed from `Σ rows` with `onApplyStatuses` removed/no-op (read-only; see §3.4), `SiteRollupMap` inside the same `ResizeBox` sizing as `SitePolygonMapSection` (`SITE_POLYGON_MAP_INITIAL_HEIGHT_UNITS`, max 600 — `SitePolygonMapSection.tsx:61-65`), `ProjectSiteRollupTable`. No `PolygonEditDrawerDataSync`, no `MapAreaProvider` interaction, no polygons loaded.
- `ProjectSiteDrilldownView`: `useFullSite({ id: siteUuid })` (`Entity.ts:167`) → `<SitePolygonsWorkspace site={site} variant="adminReview" />` (`SitePolygonsWorkspace.tsx:89-92`). This is the same component the admin site review page renders (`AdminSitePolygonReviewShell.tsx:32`), so drill-in *is* the site review, in place. It sets its own `siteData`, registers its own popup mode, handles `?editPolygon=` (`SitePolygonsWorkspace.tsx:319-354`), and calls `resetSiteMapInteractionState` on unmount — switching back to the rollup view is clean.

Why render `SitePolygonsWorkspace` rather than re-scoping the project content to `entityName: "sites"`: it needs no new code, and the site-scoped hooks (`useAllSiteValidations`, `useSitePolygonOverlap` site path, `useSitePolygonBulkActions` default `entityScope`) are already the tested path. Cost: the site-level affordances (Add / Draw / Upload, drawer Edit tab) appear inside the project workspace, exactly as they do on `/site/[uuid]/polygon-review` today — consistent with "drilled-in = the site's review page". If product wants the Phase 1 view-only gates to hold inside the drill-in, the `registerPolygonGeometryEditable(false)` / `registerPolygonReviewOnly(true)` calls (`ProjectPolygonsWorkspace.tsx:531-538`) can be issued by the wrapper, and the Add/Upload buttons need a `hideCreateActions` prop on `SitePolygonsWorkspace` (small).

### 3.3 Drill-in state and breadcrumb

- State lives in the URL: `?site=<uuid>` via shallow `router.push` — port `navigate`/`asParam` from prototype `useSemanticZoom.ts:235-249, 364-366` into `useProjectSiteDrilldown()` returning `{ siteUuid, drillInto(siteUuid), backToSites() }`. Linkable, back button works, and it composes with the shell's existing `?tab=` shallow push (`AdminProjectPolygonReviewShell.tsx:65-67`).
- Map click → `DrilldownMap.onSelectPolygon(uuid, siteId)`; at the sites level `uuid === siteId` (prototype feature shape) → `drillInto(siteId)`. Table row click → same.
- Breadcrumb: `AdminProjectPolygonReviewShell` already owns `ProjectBanner breadcrumbs` (lines 43-50: Projects › {project}). Lift `siteUuid`/site name to the shell (or read the query there) and append `{ label: "Sites", link: /project/{uuid}/polygon-review }` and `{ label: site.name }` when drilled in. Also render a small in-body "← All sites" `Button variant="borderless"` above the drilled-in workspace for discoverability.
- One-site projects (Scaling up Community Capacity: 1 site, 4,351 polygons): the rollup list would be a single row. Recommend auto-drilling when `rows.length === 1` (still under the rollup mode, so no load-all at project scope happens first). Flag for PM; trivial either way.

### 3.4 What happens to the gate, counts and tiles

| Piece | Fate |
|---|---|
| `projectPolygonLoadGate.ts` (+ test), `LARGE_PROJECT_POLYGON_THRESHOLD = 500` | **Delete.** Replaced by `projectPolygonViewMode.ts` with `PROJECT_SITE_ROLLUP_THRESHOLD = 100`. Keep its fail-safe idea (unknown size → rollup). |
| "This project has N polygons… pick a status" prompt (`ProjectPolygonsWorkspace.tsx:1069-1094`) | **Delete.** |
| `useProjectPolygonStatusCounts.ts` (5 count requests) | **Keep in the interim** as the source of `total`; **retire** once the rollup endpoint ships (Σ rows gives total + buckets in one request). Note: `Download All` disabled-state also reads `statusCounts.total` (`:943`) — switch it to the rollup total. |
| `ProjectPolygonSummaryTiles.tsx` | **Keep, two roles.** Flat mode: unchanged click-to-filter. Rollup mode: read-only project totals strip (All / Approvable / Failed / Not started) computed from Σ rollup rows; `onApplyStatuses` no-op (or prop `interactive={false}`). The per-site breakdown moves into the site table columns. What is lost: "click Failed → load every failed polygon across all sites" — that was the gate's escape hatch. If reviewers ask for a cross-site status queue later, it is re-addable as a secondary "All polygons (filtered)" mode reusing `ProjectFlatPolygonsView` with `hasRowReducingFilter` required; not in this scope. |
| Site facet filter (F6, client-side `siteId[]`) | Irrelevant in rollup mode (the site list *is* the facet); still works in flat mode. |
| Cross-site overlap count / anomaly stepper (F7) | Flat mode: unchanged. Rollup mode: per-site `overlapCount` column from the rollup (same-site + cross-site, undifferentiated — separating cross-site needs `extra_info` parsing in SQL; defer). Drilled-in site: `SitePolygonsWorkspace` shows overlap markers and the "other site" tooltip (`useSitePolygonOverlap.ts:69-85`), so a cross-site pair is still visible from either side. The project-wide stepper is not available in rollup mode — accepted trade-off, documented. |

---

## 4. Drill-in — decision applied, and the alternative for the record

**Decision: in place** (rendering `SitePolygonsWorkspace` under `?site=`; §3.2-3.3).

For the record, the deep-link alternative (`/site/{uuid}/polygon-review`, already built and admin-gated: `src/pages/site/[uuid]/polygon-review.page.tsx:10-31`) would have been zero UI work, but loses the project context (breadcrumb back to *this* project's site list, the totals strip, the `?site=` URL that keeps the project workspace as the one place a reviewer works). The in-place choice costs one wrapper component and a breadcrumb; the component underneath is identical in both cases, which is why the cost is small.

Known limit either way: a drilled-in mega-site (10,012 polygons) runs the site workspace's `useAllSitePolygons` load-all (~100 requests) and a 10k-row table — exactly scale-options §1's "within-site scale" problem, which the site list does not address. Follow-up (§5, T9): port the status-filter-required gate into `SitePolygonsWorkspace` behind a threshold so mega-sites require a filter before loading rows; the pieces (`loadSitePolygonCount` with `entityName: "sites"`, `useSitePolygonFilters`) already work at site scope.

---

## 5. Sequenced tasks

Frontend (website) unless marked BE. "now" = buildable + verifiable without DB/services (tsc, lint, jest); "later" = needs the prod snapshot + running services.

| # | Task | Reuses | Status |
|---|---|---|---|
| T1 | `projectPolygonViewMode.ts` + tests (`PROJECT_SITE_ROLLUP_THRESHOLD = 100`, fail-safe); delete `projectPolygonLoadGate.ts` + test | gate's fail-safe rationale | now |
| T2 | `useProjectSiteRollup(projectUuid)` with the **interim** body (`useSiteIndex` by `projectUuid` + `loadSitePolygonCount` sites + `useBoundingBox` centre per site); row type = the final DTO shape (§2.3) | `Entity.ts:169-171`, `SitePolygons.ts:257-275`, `BoundingBox.ts:43-47` | now (DB-verify later) |
| T3 | `ProjectSiteRollupTable.tsx` on `redesignComponents/dataDisplay/Table` (columns: Site, Polygons, Approvable, Failed, Not started, In review, Overlaps, Hectares); search + "flagged only"; row click → `drillInto` | prototype `ProjectDataTable.tsx:85-92, 119-207` (columns/filters), `polygonTableCells.tsx` (`Pill`, `AnomaliesCell`, `FlaggedFilterButton`, `orDash`), `Table.tsx:14-52` | now |
| T4 | `SiteRollupMap.tsx` = copy of prototype `DrilldownMap.tsx` (drop `lossByUuid`/marker layer); `buildSiteCentroidFeatureCollection(rows)` pure util (+ test) producing the `kind: "site"` Point features from rollup `centroidLat/Long`, labelled `"{n} polygons"` | `DrilldownMap.tsx` 1-318; feature shape from `useSemanticZoom.ts:167-178` | now |
| T5 | `useProjectSiteDrilldown()` URL state (`?site=`), shell breadcrumb extension, "← All sites" button; wire map click + row click | `useSemanticZoom.ts:235-249, 364-366`; `AdminProjectPolygonReviewShell.tsx:43-50` | now |
| T6 | Split `ProjectPolygonsWorkspace` per §3.2: `ProjectFlatPolygonsView` (current content, gate removed), `ProjectSiteRollupView`, `ProjectSiteDrilldownView` (`useFullSite` → `SitePolygonsWorkspace variant="adminReview"`); totals strip from Σ rows; `Download All` reads the rollup total; optionally hold the Phase 1 view-only gates inside the drill-in (`registerPolygonReviewOnly`) | everything existing | now (UI verify later) |
| T7 | **BE** `GET /research/v3/sitePolygons/siteReviewRollup?projectId=` (controller + service raw SQL + DTO + query DTO + specs), modelled on `feat/site-indicator-rollup` (`site-polygons.controller.ts:219-251`, `service.ts:783`, `dto/site-indicator-rollup*.ts`); FE `connections/SiteReviewRollup.ts` + hand-added generated types; swap T2's body; retire `useProjectPolygonStatusCounts` | prototype rollup pattern, `filterHasOverlap` SQL | now (DB-verify later; codegen later) |
| T8 | `tsc --noEmit`, `yarn lint`, jest (T1 mode, T4 centroid util, table rendering), nx test for research-service | — | now |
| T9 | **DB pass**: GBM PPC (21 sites) and Rwanda (3 sites / 10,977) — rollup rows vs `SELECT site_id, COUNT(*) … GROUP BY`, centroid sanity on the map, drill-in into the 10k site (measure), back-nav/URL, one-site auto-drill | — | later |
| T10 | Follow-ups (not this scope): site-level status-filter gate inside `SitePolygonsWorkspace` for mega-sites; cross-site-only overlap count per site (needs `extra_info` parsing in SQL or the optional `…/projects/:uuid/overlaps` endpoint from the Phase 1 plan §6 B2); "All polygons (filtered)" secondary mode if reviewers want a cross-site status queue; GeoServer project-level tiles behind the site markers on the rollup map (nice-to-have; `polygonLayers.ts` filters MVT by uuid list, so it would need a `site_id`/project attribute filter in the tile layer) | — | later |

---

## 6. Risks

1. **Mega-site drill-in is still load-all** (§4). The 16 projects with 2,000+ polygons concentrated in 1-3 sites get a nicer landing page, not a faster review. T10's site-level gate is the real fix; say so in the PR.
2. **Interim fan-out** (T2) is O(sites) requests. Fine for ≤ ~30 sites; a 100-site project would fire 200 tiny requests. Ship T7 before enabling for all admins, or cap the interim at N sites and show the flat "pick a status" fallback above it.
3. **Two Mapbox instances**: `SiteRollupMap` (standalone `mapboxgl.Map`) at the sites level, `PolygonsMap` (shared `MapAreaProvider` map) inside the drill-in. They never mount together, so no shared-context conflict, but the rollup map does not get the app's style switcher / fullscreen / legend controls. Acceptable for a read-only overview; if parity is wanted later, `Map.tsx` has an unused `polygonsCentroids?: PolygonCentroid[]` prop (`Map.tsx:131, 239, 415`; `Map.d.ts:34-38` `{ uuid, lat, long }`) whose rendering path is unverified — investigate before relying on it.
4. **Centroid honesty**: `AVG(lat/long)` over a site's polygons can land off-shore for a site split across two areas; the prototype accepted the same (mean of coordinates). Label it as "site marker", not a boundary (the prototype's rationale at `DrilldownMap.tsx:188-189`).
5. **Rollup basis must be stated**: the review rollup counts *all active* polygons; `SiteLightDto.totalHectaresRestoredSum` and the dev-branch `indicatorRollup` count *approved* only. Don't mix them in one row without a label.
6. **Status literals** in the rollup SQL (`site_polygon.status`, `validation_status`) must be taken from the DB constants, not the FE names; verify with T9.
7. **Fail-safe on count/rollup error → rollup mode** means an API blip shows the site list instead of the flat view for a 20-polygon project. Same trade the gate made; add a Retry (`InlineMessage`, as at `ProjectPolygonsWorkspace.tsx:1071-1081`).
8. **`SitePolygonsWorkspace` inside the project workspace** exposes site-level create/geometry actions. Decide with product whether to gate them via the wrapper (§3.2); it is a small prop either way.
