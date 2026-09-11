# Project-level Polygons (admin) — Phase 1 implementation plan

Branch: `feat/project-level-polygons-admin` (website + microservices).
Scope: **view + review** of every polygon across all of a project's sites, from the **admin** Project detail (react-admin Show) view. No drawing / upload / versioning in Phase 1.

All line numbers below were read on the current branch head (`25540770e`, staging as of 2026-09-02) unless a commit hash is given.

---

## 1. Summary

The admin already has a working, recent pattern for "polygon review in admin": the react-admin Site Show has a **Polygon Review** tab (`src/admin/modules/sites/components/SiteShow.tsx:19-21`) that renders `PolygonReviewLauncher` (`src/admin/sitePolygonReview/PolygonReviewLauncher.tsx`), which opens a **standalone Next.js page** `/site/[uuid]/polygon-review` (`src/pages/site/[uuid]/polygon-review.page.tsx`). That page is admin-gated, skips `MainLayout` (`src/pages/_app.tsx:104-107, 114`), and renders the champions polygon workspace with `variant="adminReview"` (`src/pages/site/[uuid]/sitePolygonReview/AdminSitePolygonReviewShell.tsx:32`). That is the shape introduced by TM-3425 (#2707, commit `66847cc66`, "remove React Admin and change route").

Phase 1 replicates that exact shape one level up:

1. **Admin tab**: add a `Polygons` tab to `ProjectShow` (`src/admin/modules/projects/components/ProjectShow.tsx:34-41`) that renders a generalized launcher opening `/project/[uuid]/polygon-review`.
2. **Standalone admin page**: `src/pages/project/[uuid]/polygon-review.page.tsx` + `AdminProjectPolygonReviewShell` (mirrors the site shell) rendering a new `ProjectPolygonsWorkspace`.
3. **Workspace**: re-use the prior prototype (`78fa2530f`, `42f9b394f`) — a "virtual site" adapter that lets the existing site sub-components/hooks run at project scope via `useAllSitePolygons({ entityName: "projects" })` — but bring it up to the current `SitePolygonsWorkspace` (which has since grown validation polling, overlap markers, cross-site overlap geometry) and **add validations + overlap review at project scope**, which the prototype stubbed out.
4. **Backend**: one small new endpoint, `GET /validations/v3/projects/:projectUuid`, mirroring `GET /validations/v3/sites/:siteUuid`, so the project workspace can load validation results for all polygons in the project in one paged call. Everything else (list, status change, GeoJSON export, bbox) already supports `projectId` / `projectUuid`.
5. **Cross-site overlap** needs **no new detection**: the backend OVERLAPPING validator already compares each polygon against every active polygon in the same project across sites (`apps/research-service/src/validations/validators/overlapping.validator.ts:142-183`). The project-level value-add is purely *surfacing*: an overlap-pair list / count and an anomaly stepper (from the design deck) built client-side from criteria 3 results.

Approve / Request-information reuse `bulkUpdateSitePolygonStatus` → `PATCH /research/v3/sitePolygons/status/{status}` unchanged.

---

## 2. Existing site-level implementation map (what we replicate)

### Entry points
| Piece | Path |
|---|---|
| Champion site tab | `src/pages/site/[uuid]/index.page.tsx:33` → `src/pages/site/[uuid]/tabs/SitePolygonsTab.tsx:11-13` (`<SitePolygonsWorkspace site variant="champions" />`) |
| Admin site review page (standalone) | `src/pages/site/[uuid]/polygon-review.page.tsx` (admin gate `:14-24`, `useSitePageLoad`, `SitePageProviders`) |
| Admin site review shell | `src/pages/site/[uuid]/sitePolygonReview/AdminSitePolygonReviewShell.tsx` (Layout + `SiteBanner` breadcrumbs to `/admin#/site/...` `:38-84`, workspace `:32`) |
| react-admin Site tab | `src/admin/modules/sites/components/SiteShow.tsx:19-21` + `src/admin/sitePolygonReview/PolygonReviewLauncher.tsx:13-38` (opens `/site/${record.uuid}/polygon-review` in a new tab) |
| Route stack (no MainLayout) | `src/pages/_app.tsx:104-107` (`SitePolygonReviewStack`), regex at `:114`, used at `:136-139` |
| Providers | `src/pages/site/[uuid]/components/SitePageProviders.tsx` (`MapAreaProvider`, `FrameworkProvider`, loader) ; `src/pages/site/[uuid]/hooks/useSitePageLoad.ts` (`useFullSite`) |

### Orchestrator
`src/pages/site/[uuid]/sitePolygonReview/SitePolygonsWorkspace.tsx` (1264 lines). Variant `"champions" | "adminReview"` (`:87-92`). Key wiring:
- Filters: `useSitePolygonFilters({ siteUuid, t })` `:151-159`
- Polygons: `useAllSitePolygons({ entityName: "sites", entityUuid, filter })` `:161-173`
- Validations: `useAllSiteValidations(site.uuid)` `:176`, `buildPolygonValidationsMap` `:177-180`, `withResolvedValidationStatusFromCriteria` `:181-184`, initial fetch `:440-445`
- Table rows/columns: `useSitePolygonTableData` `:186-190`
- Overlap: `useSitePolygonOverlap({ siteUuid, polygonsData, preferredValidationsByPolygonUuid })` `:191-202`; select-overlaps `:527-538`
- Selection: `useTableSelection` `:204-205`, `useSelectedSitePolygons` `:206-224`
- Cross-site overlap partner geometry for the drawer: `useCrossSiteOverlapGeometries` `:226-242`
- Bulk actions + status change: `useSitePolygonBulkActions` `:540-617`
- Validation run + polling for results: `:447-496` (`handleValidationJobsStarted`), `:637-748` (polls `fetchPolygonValidation` per polygon, then `refetchPolygons` + `fetchAllValidationPages(true)` + `fetchOverlapValidations(true)`)
- Admin-review map popup mode: `registerSitePolygonAdminReviewMode(isAdminReview)` `:750-757`
- Approve / Request info modal state and handlers: `:817-947`
- Render: `PolygonEditDrawerDataSync` `:1006-1017`, header + Download All / Add / Upload `:1018-1082`, `PolygonToolbar` `:1071-1081`, `PolygonBulkActionToolbar` `:1083-1105`, `SitePolygonModals` `:1106-1185`, `SitePolygonMapSection` `:1186-1201`, `SitePolygonMetricsSection` `:1224-1233`, `SitePolygonTableSection` `:1235-1248`

### Sub-components (all under `src/pages/site/[uuid]/components/`)
`PolygonToolbar.tsx` (props `:16-24`), `PolygonFilterDrawer.tsx` (props `:60-67`, filter state in `polygonFilter.constants.ts:28-50`), `PolygonBulkActionToolbar.tsx` (admin Review split button `:147-171`), `SitePolygonModals.tsx`, `SitePolygonMapSection.tsx` (`PolygonsMap` inside `ResizeBox`, fullscreen when drawer open `:59-77`), `SitePolygonMetricsSection.tsx` (overlap banner `:62-80`), `SitePolygonTableSection.tsx`, `PolygonTableRow.tsx` (row type `:37-53`, cells `:215-220`), `polygonTableRow.utils.ts` (`mapSitePolygonToTableRow`), `PolygonEditDrawer.tsx` (tabs edit / systemValidation / comments `:369-388`; resolves site from `selectedPolygon.siteId` first `:109-110`), `PolygonSystemValidationContent.tsx`, `ValidationDetail.tsx`, `Modals/ApprovePolygon/*`, `Modals/RequestInformation/*`, `Modals/SystemValidationComplete.tsx`, `Modals/validationCriteria.ts`.

### Hooks (`src/pages/site/[uuid]/hooks/`)
`useSitePolygonFilters.ts` (`siteUuid` only used for analytics `:61-66`), `useSitePolygonTableData.ts`, `useSelectedSitePolygons.ts`, `useSitePolygonBulkActions.ts` (`site.uuid` used for: reload-all `:181-198`, analytics `:423, :586, :715…`, nothing site-specific in API calls — status/attributes/delete/validation are all per-polygon-uuid, e.g. `createPolygonValidation({ polygonUuids })` `:356-366`), `useSitePolygonOverlap.ts` (site-scoped via `useAllSiteValidations(siteUuid, OVERLAPPING_CRITERIA_ID)` `:25-33`), `useCrossSiteOverlapGeometries.ts`, `crossSiteOverlap.utils.ts`, `overlapFix.utils.ts`, `usePolygonValidationCriteria.ts` (per-polygon, `:37`), `useDownloadSitePolygons.ts`.

### Connections / API
- `src/connections/SitePolygons.ts:44-56` `sitePolygonsConnection` — `entityName: "projects" | "sites"` maps to `projectId[]` / `siteId[]` (`:49-53`); `useAllSitePolygons` `:304-422` auto-paginates 100/page; `loadAllSitePolygons` `:257-302`; `bulkUpdateSitePolygonStatus(uuids, status, comment)` `:193-219` → `PATCH /research/v3/sitePolygons/status/{status}` (`src/generated/v3/researchService/researchServiceComponents.ts:875`).
- `src/connections/Validation.ts` — `usePolygonValidation`/`fetchPolygonValidation` `:35-55` (`GET /validations/v3/polygons/{polygonUuid}`, components `:1677`); `useAllSiteValidations(siteUuid, criteriaId?)` `:68-147` (`GET /validations/v3/sites/{siteUuid}`, components `:1763`); `createPolygonValidation` `:153` (`POST /validations/v3/polygonValidations`, `:1825`); `triggerSiteValidation` `:159` (`POST /validations/v3/sites/{siteUuid}/validation`, `:1907`).
- `src/connections/BoundingBox.ts` — `useBoundingBox` accepts `projectUuid` (`:14-25`), `resolveMapExtentBbox` `:60-86`.
- `src/components/elements/Map-mapbox/utils.ts` — `downloadProjectSitePolygonsGeoJson(projectUuid, projectName, options)` `:98`, `downloadSiteGeoJsonPolygons` `:184`, `fetchPolygonGeometry`.
- Index query params (`researchServiceComponents.ts:104-255`): `projectId[]` (`:132`, "may not be used with siteId[]"), `polygonStatus[]`, `validationStatus[]`, `hasOverlap`, `search`/`searchFields` (`siteName|polyName|polygonUuid` server-side), `deletedOnly`, `plantStartFrom/To`, `practice[]`, `targetSys[]`, `submissionCycle[]`.
- DTO `SitePolygonLightDto` (`researchServiceSchemas.ts:195-283`) already carries `siteId`, `siteName`, `projectId`, `projectName`, `lat`, `long`, `calcArea`, `numTrees`, `status`, `validationStatus`. Validation results are a separate `ValidationDto { polygonUuid, criteriaList[] }` (`:135-148`); overlap partners live in `criteriaList[].extraInfo` (parsed by `src/utils/polygonFixValidation.ts` into `OverlapExtraInfo { polyUuid, polyName, percentage, intersectionArea, intersectSmaller, siteName }` `:1-8, :42-56`).

### Map
- `src/components/elements/Map-mapbox/components/PolygonsMap.tsx` — already supports `type: "sites" | "projects"` (`:37-41`); bbox by `projectUuid` when `type === "projects"` (`:156-161`); geotagged media via `useAllMedias({ entity: type })` (`:125-131`). **Caveats gated on `type === "sites"`**: `tooltipType` becomes `"goTo"` for projects (`:236`), and the `status` / `validationType` props are blanked (`:240-247`) — these only drive the legacy `CheckPolygonControl` / `CheckIndividualPolygonControl` (`MapControlsOverlayChampions.tsx:127-136, 156-160`), which are already disabled by `disabledPolygonPanel = true` (`PolygonsMap.tsx:86`). Popup footer in admin review mode ignores `tooltipType` except `"view"` (`PopupPolygon/PopupFooterPolygon.tsx:95-135`), so Run Validation / Comment / Review (Approve, Request information) work at project scope once `registerSitePolygonAdminReviewMode(true)` is set.
- Polygon geometry is GeoServer MVT tiles filtered by uuid per status (`layers/polygonLayers.ts:73-95, 241-289`; `src/constants/layers.ts:52-200`). Nothing in the tile path is site-specific; project scope works as long as the uuid list is the project's (confirmed by the project Overview map: `src/pages/project/[uuid]/tabs/Overview.tsx:134-138, 195-201` and TM-3911 `580c68d65`).
- Overlap markers: `hooks/useMapOverlapIndicators.tsx`, `layers/overlapMarkers.tsx`, `layers/overlapMarkersOverlay.tsx`, `layers/overlapTypes.ts` (`OverlapPolygonPoint { polygonUuid, lat, lng, tooltip }`, `CrossSiteOverlapPolygon`).
- Zoom/highlight API used for "focus a polygon": `polygonTableHighlight { selectedPolygonUuids, focusPolygonUuid, onFocusPolygonConsumed, validationZoomPolygonUuids, onValidationZoomConsumed }` consumed by `usePolygonSelectionZoom` (`hooks/usePolygonTableHighlight.ts:278-435`, `loadBoundingBox` per uuid `:244-262`).
- Navigation helpers: `sitePolygonNavigation.ts` — `navigateToSitePolygonViewDetails` pushes to `/site/{siteUuid}?tab=polygons` (`:57-77`), `buildSitePolygonEditUrl(..., { adminReview })` → `/site/{uuid}/polygon-review?editPolygon=` (`:44-55`).

### Legacy admin (do NOT build on)
`src/admin/components/ResourceTabs/PolygonReviewTab/index.tsx` (~990 lines, old MapSidePanel/CheckPolygonControl flow) is the pre-TM-3425 admin implementation and is not mounted on `SiteShow` anymore. Ignore it.

---

## 3. What the prior prototype commits provide

`git show 78fa2530f` ("Add project-scoped Polygons tab replicating the site editing experience") and `42f9b394f` ("Download All"). Built on the **front-end project page** (`src/pages/project/[uuid]/index.page.tsx`), on a staging base from 2026-08-24 (merge-base `431a5d6d8`). Not on the current branch (`git branch --contains 78fa2530f` → only `prototype/project-polygons-workspace`); the files must be re-applied via `git show <sha>:<path>` / cherry-pick with conflict resolution.

### Reusable as-is (the 5 shared-code edits; all backward-compatible, default to site behaviour)
| File | Change | Status vs current code |
|---|---|---|
| `src/pages/site/[uuid]/components/polygonTableRow.utils.ts` | `mapSitePolygonToTableRow(polygon, t, { includeSiteName })` sets `siteName` | still applies; signature unchanged on staging |
| `src/pages/site/[uuid]/components/PolygonTableRow.tsx` | optional `siteName?: string` on row type + Site cell rendered only when defined | still applies (`:37-53`, cell block near `:215`) |
| `src/pages/site/[uuid]/hooks/useSitePolygonTableData.ts` | `showSiteColumn?: boolean` → Site column after Polygon Name | still applies (`:15`, columns `:42-57`) |
| `src/pages/site/[uuid]/hooks/useSitePolygonBulkActions.ts` | `entityScope?: { entityName, entityUuid }` so post-action `loadAllSitePolygons` reloads project | still applies (`:181-198`); hook grew (`onValidationJobsStarted`, `onValidationPendingClear`, `onValidationUiCleared` params) but that block is unchanged |
| `src/pages/site/[uuid]/components/SitePolygonMapSection.tsx` | `entityType?` / `entityModel?` passed to `PolygonsMap` | still applies; section gained `freezeCameraZoom`, `skipNextSiteBboxZoomNonce`, `crossSiteOverlapPolygons`, `isDeletedAuditView` props since |

### Reusable with rework
- `src/pages/project/[uuid]/projectPolygonReview/ProjectPolygonsWorkspace.tsx` (612 lines at `42f9b394f`): the "virtual site" adapter (`:98-108`), project-scoped `useAllSitePolygons` (`:120-132`), Approve / Request-info modal state + handlers (`:231-327`), Download All (`42f9b394f`), and the full `SitePolygonModals` / `PolygonBulkActionToolbar` prop wiring with create/upload/submit flows stubbed off (`:444-538`). This is the skeleton for the new workspace.
- What it **stubbed** and Phase 1 must now fill: `polygonValidations: EMPTY_VALIDATIONS` (`:136-141`), `fetchAllValidationPages: noopFetchValidations` / `fetchOverlapValidations: noopFetchValidations` (`:226-227`), `overlapPolygons: []`, `polygonsWithOverlapCount={0}` (`:581`), `hasSelectedOverlapFailure: false`, no validation-run polling (so "Run Validation" would fire jobs but never refresh results), no `registerSitePolygonAdminReviewMode` (map popup would not show Review actions), no `polygonApproveConfirmation` / `polygonRequestInformationConfirmation` bridge from map popup (`SitePolygonsWorkspace.tsx:913-931`).

### What must change to live in admin
1. Do not register the tab in `src/pages/project/[uuid]/index.page.tsx` (front-end). Instead: react-admin tab + launcher + standalone `/project/[uuid]/polygon-review` page (section 4).
2. `isAdminReview` must come from the route/variant (`variant="adminReview"`), not `useIsAdmin()` (prototype `:73-76`), matching `SitePolygonsWorkspace`.
3. Move the workspace out of `pages/project/[uuid]/projectPolygonReview/` naming into `src/pages/project/[uuid]/projectPolygonReview/` (keep) but the page file is `polygon-review.page.tsx` (Next.js page extension convention: `.page.tsx`).
4. Breadcrumbs/back-links go to `/admin#/project/{uuid}/show` (see `AdminSitePolygonReviewShell.tsx:42-49`).

---

## 4. Admin integration (files to create / modify)

### 4.1 react-admin tab — `src/admin/modules/projects/components/ProjectShow.tsx`
Add a tab inside `TabbedShowLayout` (`:34-41`), right after `InformationTab`, mirroring `SiteShow.tsx:19-21`:

```tsx
<TabbedShowLayout.Tab label="Polygons">
  <PolygonReviewLauncher entity="project" />
</TabbedShowLayout.Tab>
```

### 4.2 Generalize the launcher — `src/admin/sitePolygonReview/PolygonReviewLauncher.tsx`
Currently hard-codes `/site/${record.uuid}/polygon-review` (`:30`) and site copy (`:21-26`). Add `entity?: "site" | "project"` (default `"site"`) that switches the path (`/project/${record.uuid}/polygon-review`) and copy ("Review, validate, and approve polygons across every site in this project…"). Optionally move it to `src/admin/polygonReview/PolygonReviewLauncher.tsx` — not required.

### 4.3 Standalone admin page — `src/pages/project/[uuid]/polygon-review.page.tsx` (new)
Copy of `src/pages/site/[uuid]/polygon-review.page.tsx` with:
- `useMyUser()` admin gate → redirect non-admins to `/project/${uuid}`.
- Project load: new `src/pages/project/[uuid]/hooks/useProjectPageLoad.ts` mirroring `useSitePageLoad.ts` but with `useFullProject({ id })` (`src/connections/Entity.ts:153`), the same call the front-end project page makes at `src/pages/project/[uuid]/index.page.tsx:209` (which also wraps in `MapAreaProvider` + `LoadingContainer` at `:225-237`).
- Providers: reuse `SitePageProviders` from `src/pages/site/[uuid]/components/SitePageProviders.tsx` (it is entity-agnostic: `MapAreaProvider`, `FrameworkProvider frameworkKey`, loader) — pass `project.frameworkKey`. Optionally rename to `PolygonPageProviders` later.
- Renders `<AdminProjectPolygonReviewShell project={project} />`.

### 4.4 Shell — `src/pages/project/[uuid]/projectPolygonReview/AdminProjectPolygonReviewShell.tsx` (new)
Mirror `AdminSitePolygonReviewShell.tsx` using `ProjectBanner` (`src/redesignComponents/content/Banner/ProjectBanner/ProjectBanner.tsx`, extends `BannerProps { breadcrumbs, suffix, toolbar }` — `Banner.tsx:12-14`):
- breadcrumbs: Projects (`/admin#/project?...`), project name (`/admin#/project/${uuid}/show`).
- suffix: "Project Profile" (admin show) link; single `Polygons` tab in `toolbar.tabBar`.
- body: `<ProjectPolygonsWorkspace project={project} variant="adminReview" />`.

### 4.5 Route stack — `src/pages/_app.tsx`
Extend the regex at `:114` to `/^\/(site|project)\/[^/]+\/polygon-review(?:[/?#]|$)/` so the project review page also uses `SitePolygonReviewStack` (`:104-107`, `withMainLayout={false}`). `SiteRouteStack` (`:84-99`) is entity-agnostic (`RouteHistoryProvider` + `NavbarProvider`, optional `MainLayout`), so no other change; optionally rename the stack/flag to `PolygonReviewStack` / `isOnPolygonReview`.

### 4.6 Middleware / auth
`polygon-review.page.tsx` gate is client-side (`useMyUser().isAdmin`), same as the site page; the backend enforces policies. Nothing else in `src/middleware` needs a change unless the site review path is whitelisted somewhere — grep `polygon-review` shows only `_app.tsx:114` and the site page/shell, so no.

---

## 5. Frontend Phase 1 tasks (ordered)

### F1. Re-apply the prototype's shared-code edits
Files: the 5 in section 3. Use `git show 78fa2530f -- 'src/pages/site/[uuid]/'` as the patch; resolve against current signatures. Add unit tests for `mapSitePolygonToTableRow` with/without `includeSiteName` (there are no tests in `src/pages/site/[uuid]/` today; jest is configured — `package.json:10-12`).

### F2. Project-scoped validations hook — `src/connections/Validation.ts`
Add `projectValidationConnection` + `useAllProjectValidations(projectUuid, criteriaId?)` mirroring `siteValidationConnection` / `useAllSiteValidations` (`:57-147`) against the new backend endpoint `GET /validations/v3/projects/{projectUuid}` (section 6, B1). Keep the same return shape `{ allValidations, fetchAllValidationPages(clearCache), total }` so the workspace and `useSitePolygonOverlap` can take either.

Fallback that is buildable with zero backend work (keep behind the same hook signature, drop once B1 ships): fan out over the project's sites — `useSiteIndex` (`src/connections/Entity.ts:171`, filter by project uuid, all pages) then `loadConnection(siteValidationConnection, { siteUuid, criteriaId, pageSize: 100, pageNumber })` per site and concatenate. Cost = (#sites × pages) requests; acceptable for the ~16-site example project, not for 100+ site projects.

### F3. Generalize `useSitePolygonOverlap` — `src/pages/site/[uuid]/hooks/useSitePolygonOverlap.ts`
Replace the `siteUuid` param with `scope: { entityName: "sites" | "projects"; entityUuid: string }` (or add an optional `validationsSource` override) so it uses `useAllProjectValidations` at project scope (`:25-33`). Everything else (`buildOverlapFailureValidationsMap`, `OverlapPolygonPoint` construction `:71-86`) is already entity-agnostic. The `crossSiteOverlapTooltip` (`:69`) still applies: at project scope a partner outside `polygonsData` means "other site, filtered out" or "other project" (never — validator is project-scoped), so keep the tooltip but reword to "…on another site (not in the current filter)".

### F4. Extract validation-run polling out of `SitePolygonsWorkspace` (recommended, mechanical)
The polling/refresh block (`SitePolygonsWorkspace.tsx:140-149, 447-496, 619-748, 759-762`) is the single biggest thing the prototype lacked and is not site-specific (it polls `fetchPolygonValidation(uuid)` per polygon then calls `refetchPolygons`, `fetchAllValidationPages(true)`, `fetchOverlapValidations(true)`, `pruneBoundingBoxesCache`). Move it into `src/pages/site/[uuid]/hooks/usePolygonValidationRun.ts` with inputs `{ polygonsData, refetchPolygons, fetchAllValidationPages, fetchOverlapValidations, analyticsEntity: { siteUuid } , isEditPolygonOpen, t }` and outputs `{ supplementalValidations, pendingValidationPolygonUuids, validationZoomPolygonUuids, handleValidationJobsStarted, clearValidationPending, handleValidationUiCleared, handleValidationZoomConsumed, skipNextSiteBboxZoomNonce, openValidationResultsModalIfPending wiring }`. `SitePolygonsWorkspace` consumes it unchanged in behaviour; `ProjectPolygonsWorkspace` reuses it. If this refactor is judged too risky for the site page, Phase 1 fallback is to copy the block into the project workspace (accept ~300 lines of duplication) and note the debt.

### F5. `ProjectPolygonsWorkspace` — `src/pages/project/[uuid]/projectPolygonReview/ProjectPolygonsWorkspace.tsx`
Start from `git show 42f9b394f:'src/pages/project/[uuid]/projectPolygonReview/ProjectPolygonsWorkspace.tsx'`, then:
- Props `{ project: ProjectFullDto; variant?: "adminReview" }` (Phase 1 only ships adminReview; keep the prop for a later champion variant). `isAdminReview = variant === "adminReview"`.
- Virtual site: keep (`uuid`, `name`, `projectUuid: project.uuid`, `hectaresToRestoreGoal: project.totalHectaresRestoredGoal`, `frameworkKey`).
- Data: `useAllSitePolygons({ entityName: "projects", entityUuid: project.uuid, filter })` (exists).
- Validations: `useAllProjectValidations(project.uuid)` (F2) → `buildPolygonValidationsMap` → `withResolvedValidationStatusFromCriteria` → `useSitePolygonTableData({ ..., polygonValidations, showSiteColumn: true })`.
- Overlap: `useSitePolygonOverlap({ scope: projects })` (F3) → `overlapPolygons`, `polygonsWithOverlapCount`, `overlapValidationsByPolygonUuid`; pass `overlapPolygonsForMap` from `useSelectedSitePolygons` and `polygonsWithOverlapCount` / `onSelectOverlapPolygons` to `SitePolygonMetricsSection` (copy `handleSelectOverlapPolygons` `:527-538`).
- Cross-site partner geometry in drawer: `useCrossSiteOverlapGeometries` (`:226-242`) still useful when a filter hides the partner; keep.
- Bulk actions: `useSitePolygonBulkActions({ site: virtualSite, entityScope: { entityName: "projects", entityUuid }, ..., fetchAllValidationPages, fetchOverlapValidations, onValidationJobsStarted, onValidationPendingClear, onValidationUiCleared })` with the real functions from F2/F4.
- Register popup mode: `registerSitePolygonAdminReviewMode(isAdminReview)` + `registerRunPolygonValidationFromMapPopup(runValidationWithResultsModal)` (`:750-757`), and the map-popup approve/request-info bridges (`:913-931`).
- Map: `SitePolygonMapSection` with `entityType="projects" entityModel={project}` and the full current prop set (`freezeCameraZoom`, `skipNextSiteBboxZoomNonce`, `overlapPolygons`, `crossSiteOverlapPolygons`, `isDeletedAuditView`).
- Header: Download All via `downloadProjectSitePolygonsGeoJson` (`42f9b394f`); **no** Add / Draw / Upload / Upload Monitoring Plots buttons (Phase 1 scope); `PolygonToolbar isAdminReview`.
- Bulk toolbar: Review (Approve / Request information), Run Validation, Download, Edit details (attributes-only; already bulk + per-polygon-uuid), Delete — decide in review whether Delete/Edit are in "view + review" (recommend: keep Edit details + Delete off by passing `onDelete`/`onEdit` as disabled for Phase 1 if the product owner wants pure review; the toolbar accepts the handlers so it is a one-line toggle).
- Modals: as the prototype, with `overlapFixResults`, upload, submit, existing-polygon all off; `openSystemValidationCompleteModal` / `validatedPolygons` / `pendingValidationPolygonIds` wired from F4.
- Navigation from popups: `PolygonPopupChampions` "View details" → `navigateToSitePolygonViewDetails` goes to the champion site page (`sitePolygonNavigation.ts:74-76`). At admin project scope it should stay in place (open the drawer) or go to `/site/{siteId}/polygon-review`. Add an admin-aware branch: if `isSitePolygonAdminReviewMode()` and `router.pathname` is a `polygon-review` page, call `openPolygonEditDrawerForSitePolygon` instead (uses the polygon's own `siteId`).
- Edit drawer: `PolygonEditDrawer.tsx:109-110` and `PolygonEditContent.tsx:278` resolve `siteUuid` from `selectedPolygon.siteId` before falling back to `siteData`, so cross-site editing of attributes/status is correct without changes. Geometry drawing inside the drawer is out of Phase 1 scope: hide/disable the reshape affordance at project scope (check `PolygonEditContent.tsx` around `:498-541` where geometry changes require `polygon.siteId`; it stays correct if left on, but the requirement says no geometry editing — gate it with a `geometryEditable={false}` prop threaded via `PolygonEditDrawerDataSync` or a store flag).

### F6. Site filter (project-scope addition, small)
`PolygonFilterDrawer` has no Site facet. Add optional `siteOptions?: { uuid; name }[]` + `siteId: string[]` in `PolygonFilterState` (`polygonFilter.constants.ts:28-50`), rendered only when `siteOptions` is provided. Server-side the index forbids `siteId[]` together with `projectId[]` (`researchServiceComponents.ts:130-140`; backend `site-polygons.controller.ts:286-298`), and `sitePolygonsConnection` strips both from user filters (`SitePolygons.ts:47-53`). Implement as **client-side filtering** of `polygonsData` by `siteId` (data is already fully loaded — `useAllSitePolygons` pulls every page). Site options come from the loaded polygons (`siteId`/`siteName` on the DTO) — no extra request. Also add `search` on `siteName`: the backend `searchFields` accepts `siteName` (`site-polygon-query.dto.ts:20`), so extend `useSitePolygonFilters` `searchFields` to `["polyName", "polygonUuid", "siteName"]` when at project scope (add `searchSiteName?: boolean` param).

### F7. Overlap / anomaly review (the project-level value-add; see section 7)
New `src/pages/project/[uuid]/projectPolygonReview/`:
- `projectOverlapPairs.ts` — pure util: from `overlapValidationsByPolygonUuid` (criteria 3 failures) + `polygonsData`, build deduped pairs `{ aUuid, aName, aSiteId, aSiteName, bUuid, bName, bSiteName, percentage, intersectionArea, crossSite: aSiteId !== bSiteId }` (pair key = sorted uuids). Partner metadata comes from `checkPolygonFixability(extraInfo).overlapDetails` (`src/utils/polygonFixValidation.ts:59`) and `getOverlapCriteria` (`overlapFix.utils.ts`). Unit-test with fixture `ValidationDto`s.
- `useProjectAnomalies.ts` — ordered list of flagged polygon uuids for the stepper: cross-site overlaps first, then same-site overlaps, then other failed criteria (`validationStatus === "failed"`), then partial. Inputs are the maps above; no requests.
- `PolygonAnomalyStepper.tsx` — the deck's `‹ ⚠ i of N ›` control. Stepping sets `focusPolygonUuid` (zooms via `usePolygonSelectionZoom` and opens the popup through `onFocusPolygonConsumed` → `openPolygonPopupFromMapArea`, exactly the deep-link path at `SitePolygonsWorkspace.tsx:391-421`) and `setPolygonTableHoveredUuid(rowId)` (table highlight). Render it in `SitePolygonMetricsSection`'s overlap banner slot (extend the section with an optional `anomalyStepper?: ReactNode`) or in the map header. Clicking the popup's Edit opens the drawer (click-a-conflict-to-edit, drawer tab `systemValidation` shows the partner list via `PolygonSystemValidationContent`).
- Metrics: add `crossSiteOverlapCount` next to `polygonsWithOverlapCount` in `SitePolygonMetricsSection` (optional prop, project-only) and a "Select cross-site overlaps" action reusing `handleSelectOverlapPolygons` filtered to cross-site pairs.

### F8. Admin wiring
Section 4 (ProjectShow tab, launcher prop, page, shell, `_app.tsx` regex, `useProjectPageLoad`).

### F9. Analytics
`useSitePolygonBulkActions`, `useSitePolygonFilters`, `useDownloadSitePolygons` call `trackBulkActionCompleted({ siteUuid })` etc. with `site.uuid` (= project uuid at project scope). Extend `src/utils/polygonAnalytics.ts` `getPolygonAnalyticsContext` (`useSitePolygonBulkActions.ts:616, :1043`) to accept `entityType: "site" | "project"` and pass it through `entityScope` so events are not mislabeled. Note from the deck: the GTM forwarding of these events is not wired today, so this is correctness, not urgency.

### F10. Tests / static verification
- `tsc --noEmit` and `yarn lint` (eslint `--fix` script `package.json:13`).
- Jest units: `projectOverlapPairs`, `useProjectAnomalies` ordering, `mapSitePolygonToTableRow` site column, `PolygonReviewLauncher` path per entity.
- Storybook (`package.json:16`): a story for `ProjectPolygonsWorkspace` with mocked connections is the only way to see the composed UI without a DB (see section 8).

---

## 6. Backend Phase 1 tasks (terramatch-microservices)

### Reuse unchanged
| Need | Endpoint | Where |
|---|---|---|
| All polygons of a project (paged, filtered, light) | `GET /research/v3/sitePolygons?projectId[]=…&lightResource=true` | `apps/research-service/src/site-polygons/site-polygons.controller.ts:244`; builder `site-polygon-query.builder.ts:173-179` (`filterProjectUuids` → `projectId IN` on the Site join); `hasOverlap` `:278-290`; search `:196-221` (fields incl. `siteName`) |
| Approve / request information (bulk) | `PATCH /research/v3/sitePolygons/status/:status` body `{ data:[{type:"sitePolygons",id}], comment }` | controller `:545-572`; service `updateBulkStatus` `site-polygons.service.ts:628-669` (writes `AuditStatus`, on `approved` triggers project validation jobs `:651-653`) |
| Run validation on selected polygons (any sites) | `POST /validations/v3/polygonValidations` `{ polygonUuids[] }` → DelayedJob | `validations/validation.controller.ts:89-121`; processor `validation.processor.ts:55-61` |
| Per-polygon validation (drawer, polling) | `GET /validations/v3/polygons/:polygonUuid` | `validation.controller.ts:34-46` |
| Project GeoJSON download | `GET /research/v3/sitePolygons/geojson?projectUuid=` | controller `:213-242`; `geojson-export.service.ts:198-222` |
| Project bbox | `GET /boundingBoxes/v3/get?projectUuid=` | `bounding-boxes/bounding-box.controller.ts:26` |
| Audit comments on polygons | `GET/POST /entities/v3/auditStatuses/sitePolygon/:uuid` | `apps/entity-service/src/entities/audit-status.controller.ts:38-157` |

### B1. NEW: `GET /validations/v3/projects/:projectUuid` (required for a clean project workspace)
- File: `apps/research-service/src/validations/validation.controller.ts` — add next to `getSiteValidation` (`:48-87`), operationId `getProjectValidation`, same `SiteValidationQueryDto` (`dto/site-validation-query.dto.ts`, `page` + `criteriaId`), same JSON:API index response with `requestPath: /validations/v3/projects/${projectUuid}${getStableRequestQuery(query)}`.
- Service: `apps/research-service/src/validations/validation.service.ts` — refactor `getSiteValidations` (`:109-190`) into a private `getValidationsForPolygonUuids(polygonUuids, pageSize, pageNumber, criteriaId)` (the body from `:144-189`) and add `getProjectValidations(projectUuid, …)` that resolves `Project.findOne({ where: { uuid } })` → `Site.findAll({ where: { projectId }, attributes: ["uuid"] })` → `SitePolygon.findAll({ where: { siteUuid: { [Op.in] }, isActive: true }, attributes: ["polygonUuid"] })`. (`getProjectPolygonUuidsForValidation(projectId: number)` at `:215-240` already does the last two steps by numeric id; reuse it after the uuid lookup.) 404 when the project does not exist.
- Authorization: the existing site endpoint has no policy guard beyond the global auth; match it (or add `@PolicyService` `read` on `Project` if the reviewers want parity with entity-service). Flag for review.
- Tests: extend `validation.controller.spec.ts` / `validation.service.spec.ts` (both exist) with mocked `Project`/`Site`/`SitePolygon`/`CriteriaSite` — runnable without a DB (`yarn test` via nx, `package.json:13`).
- Frontend codegen: `yarn generate:researchService` (`openapi-codegen.config.ts:31, 73` reads `http://localhost:4030` by default, or `NEXT_PUBLIC_RESEARCH_SERVICE_URL` e.g. `https://api-dev.terramatch.org` once deployed). Until then, hand-add `getProjectValidation` + `GetProjectValidationPathParams` in `src/generated/v3/researchService/researchServiceComponents.ts` next to `getSiteValidation` (`:1758-1763`) in the same `V3ApiEndpoint` form, and replace with the generated output later.

### B2. Cross-site overlap detection — decision: **no new backend detection; surface client-side**
- Detection already exists and is project-wide: `overlapping.validator.ts` `getProjectPolygons` `:142-183` (`SitePolygon.findAll({ where: { isActive: true }, include: [{ model: Site, required: true, where: { projectId } }] })`), batch variant `:185-248`; geometry SQL in `libs/database/src/lib/entities/polygon-geometry.entity.ts:97-179` (`ST_Intersects` + `ST_Area(ST_Intersection)`, joins `site_polygon`/`v2_sites` to return the partner's site name). Results persist in `criteria_site` (criteria 3) with `extraInfo[] { polyUuid, polyName, percentage, intersectionArea, intersectSmaller, siteName }`. Never across projects.
- Therefore the project view gets cross-site pairs from B1 (`criteriaId=3`) with zero new SQL. Pairs are symmetric (both polygons carry a failure), so client-side dedupe is required (F7).
- Optional later (Phase 2+): a `GET /validations/v3/projects/:projectUuid/overlaps` that returns deduped pairs with `siteUuid` on both sides, if the client-side join proves slow for very large projects. Not needed for Phase 1.
- Note: `extraInfo` carries the partner's `siteName` but not `siteUuid`; at project scope the partner is in `polygonsData` so `siteId` is resolved by uuid lookup. If the partner is filtered out, fall back to `siteName` only.

### B3. Nothing else
Status change, validation trigger, GeoJSON, bbox, audit comments are all polygon- or project-keyed already. The `site-polygons` index's `MAX_PAGE_SIZE = 100` (`controller:72`) and `useAllSitePolygons` paging cover large projects; no new aggregation endpoint is needed for counts (computed client-side from the loaded list, as the site page does).

---

## 7. Gaps → design artifact UX (`/Users/trevorhinkle/code/terramatch/polygons-deck/deck-base.html`, "Solution · Option 1 of 3 — Project-level polygon management")

The deck's Option 1 is a rebuild of the prototype plus a few additions. Mapping to real code:

| Deck element | Existing code | Gap → Phase 1 answer |
|---|---|---|
| All polygons in one table, Site column, project-level totals | prototype F1/F5; totals from `useSitePolygonTableData` | none |
| Filter across the whole project incl. **Site** facet ("Site All ▾ Balassou / Sérédou / Koyama") | `PolygonFilterDrawer` has no site facet | F6 (client-side site filter + siteName search) |
| One interactive map, status-colored, map↔table sync, Expand | `SitePolygonMapSection` + `PolygonsMap type="projects"` | none (TM-3911 confirmed project tiles render) |
| **Step through anomalies** `‹ ⚠ 1 of N ›` zooming to each flagged polygon and ringing it | no stepper anywhere; zoom/focus primitives exist (`usePolygonSelectionZoom`, `focusPolygonUuid`, `openPolygonPopupFromMapArea`) | F7 `PolygonAnomalyStepper` + `useProjectAnomalies`. "Ring in white" = reuse the focus style from `usePolygonEditFocusStyle` / `polygonEditFocusStyle.ts` if cheap; otherwise selection highlight is enough for Phase 1 |
| Cross-site overlap visibility ("hunt for cross-site overlaps") | site page only marks overlaps with a tooltip when the partner is outside the site (`useSitePolygonOverlap.ts:69-85`) | F7 overlap pairs + cross-site count + select-cross-site; backend already detects (B2) |
| Click a conflict to open the editor | popup Edit → `openPolygonEditDrawerForSitePolygon`; drawer System Validation tab lists partners | F5 navigation fix so "View details" does not leave the page |
| In-place review (Approve / Request information on selection) | `PolygonBulkActionToolbar` admin Review split button; modals | none |
| Per-polygon editor with live map / drag vertices / versions | exists in `PolygonEditContent` | **out of Phase 1** (geometry editing disabled at project scope; attribute edit optional) |
| Under-mapped / over-mapped / density anomalies (PRD list) | only what validators compute: ESTIMATED_AREA (12), DATA_COMPLETENESS (14), PLANT_START_DATE (15), etc. (`useValidationResultsLabels.ts:8-19`) | Phase 1 anomalies = existing criteria failures only; new anomaly types are Phase 2 backend work |
| Default map size / clustering at portfolio scale (deck open question) | `ResizeBox` initial height `SITE_POLYGON_MAP_INITIAL_HEIGHT_UNITS`, max 600 | keep site defaults; measure with the prod snapshot |

Deck's Options 2 (Field Data Review) and 3 (Casework) are explicitly sequenced after Option 1 in the deck's recommendation and are out of scope here.

---

## 8. Buildable now vs needs DB / running services later

### Buildable and verifiable now (no DB, no creds)
- F1 shared-code edits + unit tests.
- F2 hook (compiles against hand-added generated types; fallback fan-out compiles against existing `siteValidationConnection`).
- F3, F4 refactors (type-check; site page behaviour verified by reading + existing stories if any).
- F5 workspace, F6 site filter, F7 overlap-pair util + anomaly ordering + stepper component (all pure/presentational; unit-testable with fixture DTOs; Storybook story with mocked Redux `ApiSlice` state is possible but optional).
- F8 admin tab, launcher, page, shell, `_app.tsx` regex (tsc + a jest test for the launcher path).
- F9 analytics context.
- B1 endpoint + service refactor + controller/service specs with mocked Sequelize models (existing spec pattern in `validation.service.spec.ts`).
- `tsc --noEmit`, `yarn lint`, jest, nx `test`/`lint`/`build` for research-service.

### Needs the prod snapshot + running services (verify later)
| Item | How to verify |
|---|---|
| Project list actually loads all sites' polygons and the map renders them (GeoServer tiles, `polygon_geometry_active` layer) | Open `/project/6d4d7217-175b-4d0c-927d-7596381ddc55/polygon-review` (Ziama - AMSP, ~96 polygons / 16 sites per the prototype notes); count matches `SELECT count(*) FROM site_polygon sp JOIN v2_sites s ON s.uuid=sp.site_id WHERE s.project_id=? AND sp.is_active=1`. Local GeoServer 503 caveat is documented in memory note `local-geoserver-polygon-tiles-503`. |
| B1 returns the union of site validations; paging with `criteriaId=3` | Compare totals to `Σ GET /validations/v3/sites/{site}` over the project's sites. |
| Cross-site pairs are real | Pick a pair from F7 with `crossSite=true`; confirm both polygons' `extraInfo` reference each other and their `site_id`s differ. |
| Approve / Request information from project scope writes status + `AuditStatus` and triggers project validation jobs | PATCH via the UI, check `site_polygon.status`, `audit_statuses`, `delayed_jobs`. |
| Run Validation → polling → results modal → overlap markers refresh | Trigger on 2 polygons from different sites; watch `criteria_site` rows update and the Validation column re-render. |
| Popup Review actions and "View details" stay in place at project scope | Manual. |
| Map performance for a large project (e.g. 1,000+ polygons) | Time `useAllSitePolygons` progress and tile load; decide whether to cap or virtualize. |
| `yarn generate:researchService` against a running research-service (`localhost:4030`) to replace the hand-added types | Diff generated vs hand-added. |
| Admin gating (`useMyUser().isAdmin`) and breadcrumb links back into `/admin#/project/...` | Manual with admin creds. |

---

## 9. Risks / open questions

1. **Embed vs standalone page.** The brief says "a new Polygons tab on the Project admin Show view". The site precedent deliberately removed react-admin from the review surface (#2707 "remove React Admin and change route"): the workspace expects the redesign `Layout`, a full-width page, a fixed fullscreen map when the drawer opens (`SitePolygonMapSection.tsx:62-67`), `MapAreaProvider`, and Chakra styling that clashes inside MUI `TabbedShowLayout`. Recommendation: tab = launcher (exactly like Site). If the product owner insists on inline rendering, Phase 1 could mount `ProjectPolygonsWorkspace` directly inside the RA tab wrapped in `SitePageProviders`, but expect layout fights and a second QA pass; not recommended.
2. **`SitePolygonsWorkspace` refactor (F4).** Extracting the validation-run polling touches the live site page. Mitigation: pure move, no behaviour change, and both pages call it; otherwise duplicate for Phase 1.
3. **Validation-status resolution at project scope.** `withResolvedValidationStatusFromCriteria` recomputes `validationStatus` from criteria; with B1 this matches the site page. With the F2 fan-out fallback, sites with zero polygons 404 (`validation.controller.ts:53-55` "Site not found or has no polygons") — handle as empty.
4. **Cross-site overlap partner identity.** `extraInfo` has `polyUuid` + `siteName` but not `siteUuid`; two sites with the same name in one project would be ambiguous only when the partner is filtered out. Acceptable; B2 optional endpoint fixes it later.
5. **What "review" includes.** Bulk toolbar exposes Delete and Edit details. Confirm with the product owner whether Phase 1 keeps them (the prototype did) or is strictly view + validate + approve/request-info. The plan wires them but they are one-prop toggles.
6. **Geometry editing in the drawer.** The drawer's edit tab allows reshaping; Phase 1 must gate it (F5). Verify there is no other path into draw mode at project scope (`useStartSitePolygonDrawing` is not mounted; map `PolygonHandler` only for `isFormMap`).
7. **Authorization on B1.** Site validations endpoint has no explicit policy; mirror it or tighten both. Reviewer decision.
8. **Analytics identity.** Events tagged with `siteUuid = project uuid` until F9; harmless but wrong.
9. **Scale.** `useAllSitePolygons` loads every polygon (100/page) and B1 loads all `criteria_site` rows for the project in memory before paging (`validation.service.ts:144-148` pattern). Fine for hundreds; revisit for thousands (deck open question).
10. **Popup "View details" / deep links** use `/site/[uuid]` paths (`sitePolygonNavigation.ts`); `buildSitePolygonEditUrl` with `adminReview` targets the site review page — acceptable as an escape hatch to the site-level page from project scope.

---

## 10. Sequenced task list (Phase 1)

Frontend (website) unless marked BE.

1. **F1** Re-apply prototype shared-code edits (5 files) + `mapSitePolygonToTableRow` tests. *(now)*
2. **B1** Backend `GET /validations/v3/projects/:projectUuid` + service refactor + specs. *(now; DB verify later)*
3. **F2** `useAllProjectValidations` in `src/connections/Validation.ts` + hand-added generated endpoint types (replace via codegen later). *(now)*
4. **F3** `useSitePolygonOverlap` scope param. *(now)*
5. **F4** Extract `usePolygonValidationRun` from `SitePolygonsWorkspace` (or copy, if deferred). *(now)*
6. **F8a** `useProjectPageLoad`, `polygon-review.page.tsx`, `AdminProjectPolygonReviewShell`, `_app.tsx` regex. *(now)*
7. **F5** `ProjectPolygonsWorkspace` (from `42f9b394f`) wired to real validations/overlap/polling, admin popup mode, geometry editing gated, navigation fix. *(now; UI verify later)*
8. **F6** Site facet + siteName search. *(now)*
9. **F7** `projectOverlapPairs` util + tests, `useProjectAnomalies`, `PolygonAnomalyStepper`, metrics additions. *(now; verify pairs with DB later)*
10. **F8b** `ProjectShow` Polygons tab + `PolygonReviewLauncher entity="project"`. *(now)*
11. **F9** Analytics entity context. *(now)*
12. **F10** `tsc`, lint, jest, nx test/lint/build; Storybook story optional. *(now)*
13. **DB pass** (section 8 second list): load Ziama - AMSP, verify counts, cross-site pairs, approve/request-info writes, validation polling, popup actions, performance; run `yarn generate:researchService` and replace hand-added types. *(later)*
14. Phase 2+ (not planned here): draw/upload/versioning at project scope, overlap auto-fix from project scope, new anomaly validators (under/over-mapped, density), optional `GET …/projects/:uuid/overlaps` pairs endpoint, champion (non-admin) project variant, Field Data Review surface.
