# Project-level polygons — refactor / simplification review

Branch: `feat/project-level-polygons-admin` (website + microservices), reviewed against `main`. Read-only; no code changed.
Scope: duplication, over-building, dead/vestigial code, reuse-vs-reimplement. Correctness was reviewed separately and is only mentioned where a consolidation would also settle it.

Line numbers are from the branch head at review time.

---

## 0. TL;DR

The feature is well-scoped and most of the "reuse" decisions are right (virtual-site adapter, `SitePolygonsWorkspace` for drill-in, one rollup endpoint). The things worth doing, in order of value/effort:

1. **Retire `useProjectPolygonStatusCounts` and feed the flat-view tiles from the rollup rows the parent already loaded** — removes 5 requests per page load, a hook, its test, and a refetch in the polling path. Small, project-only, no site risk.
2. **Extract two hooks out of `SitePolygonsWorkspace` by pure move — `usePolygonValidationRun` (state + polling) and `usePolygonReviewModals` (approve / request-info) — and consume them from both workspaces.** This is ~350 of the ~1000 copied lines, and it is exactly the part that has already drifted (the project copy silently dropped the error toasts and the overlap-failure filter). Do it as its own follow-up PR after the feature lands, not inside PR-3.
3. **Do not build a shared "core" workspace component.** Two thin composers over shared hooks is the right end state; a single entity-parameterised mega-component would be worse than the copy.
4. **Delete the vestigial "interim rollup" scaffolding** (`hasNoBucketData`, the null branches in `rollupTableCells`, `selectedSiteUuid` on the map, `loadSiteReviewRollup`, `siteStatus`, `enableEditDetails`, the `variant` prop thread).
5. Backend: fold the duplicated page/criteria parsing into one helper each in controller and service, and give site and project validations one shared "active polygon uuids for these sites" query so the two scopes stop having different semantics.

---

## 1. Top refactor / simplify opportunities (ranked by value ÷ effort)

### R1. Feed the flat-view summary tiles from the rollup; delete `useProjectPolygonStatusCounts`

**What's over-built.** `ProjectPolygonsWorkspace` already fires `useProjectSiteRollup` (one request, returns per-site `passed/partial/failed/notChecked/activeTotal`) and uses its `total` to decide the mode. It then mounts `ProjectFlatPolygonsView`, which fires `useProjectPolygonStatusCounts` (`useProjectPolygonStatusCounts.ts:36-84`) — **five more `pageSize=1` index requests** — to get the same four numbers for `ProjectPolygonSummaryTiles` (`ProjectFlatPolygonsView.tsx:163-167, 1022-1027`). The polling path then refetches those five again after every validation run (`:628`). The rollup plan §3.4 explicitly said to retire this hook once the endpoint shipped; the endpoint shipped, the hook stayed.

**Simpler alternative.** Pass the rollup rows (or a pre-summed `{ total, passed, partial, failed, notChecked }`) down from `ProjectPolygonsWorkspaceContent` into `ProjectFlatPolygonsView` as a prop, and have `ProjectPolygonSummaryTiles` read from that. For the post-validation refresh, add `.refetch()` to `siteReviewRollupConnection` (`src/connections/SiteReviewRollup.ts:19-23`; the factory already supports it, `apiConnectionFactory.ts:658-666`) or prune the `siteReviewRollups` index, and call it where `refetchStatusCounts()` is called today. `Download All`'s disabled state (`:902`) reads the same total.

Note the bucket semantics are slightly *better* from the rollup: it counts `validation_status IS NULL` as not-checked; the count endpoint's `validationStatus=["not_checked"]` filter probably does not.

**Alternative worth putting to the PM:** drop the tiles from flat mode entirely. They now only ever render for projects with < 100 polygons — the segment the scale memo (§1 table) classified as "nothing needed". If the tiles go, so do `ProjectPolygonSummaryTiles.tsx` (109 lines) and the `applyValidationStatuses` wiring. Either way the hook goes.

**Delete:** `useProjectPolygonStatusCounts.ts`, `useProjectPolygonStatusCounts.test.ts`, `loadSitePolygonCount` in `src/connections/SitePolygons.ts:257-275` (only caller is the hook).
**Effort:** ~1–2 h. **Risk:** none to the site page; project-only.

### R2. Extract `usePolygonValidationRun` from `SitePolygonsWorkspace` (pure move), consume from both

**What's duplicated.** The validation-run block is byte-for-byte copied and is the largest single chunk:

| Piece | `SitePolygonsWorkspace.tsx` | `ProjectFlatPolygonsView.tsx` |
|---|---|---|
| 6 refs + 4 state hooks | 153-162 | 126-135 |
| `clearValidationPending` | 460-467 | 352-359 |
| `handleValidationUiCleared` | 469-485 | 361-377 |
| `handleValidationJobsStarted` | 487-509 | 379-401 |
| `openValidationResultsModalIfPending` + drawer-pending effect | 632-648 | 460-476 |
| 20-attempt polling effect | 650-761 | 556-671 |
| `handleValidationZoomConsumed` | 772-775 | 682-685 |

~200 lines each. **It has already drifted:** the project copy replaced the two `showPolygonErrorToast(...)` calls on timeout / failure (`Site:734, :741`) with `Log.error` only (`Project:645, :650`) — a reviewer running validation on a project that times out gets no feedback. That is the cost the F4 note in `project-level-polygons-admin.md` accepted; it is now a real divergence, and every future fix to polling (there have been several — the loop-fix commit `009e0a923` touched this area) has to be made twice.

**Why the copy was defensible then and isn't now.** F4 was deferred because the site page was live and the project workspace was unproven. The project view has now been through three loop-bug fixes and a DB pass; the block is stable in both places. The site page is also *already touched* on this branch (`SitePolygonsWorkspace.tsx` +34/-8, `useSitePolygonBulkActions.ts` +86, `useSitePolygonOverlap.ts` +39), so "never touch the site workspace" is no longer the operative constraint — "touch it only with pure moves" is.

**Concrete shape (avoids the circular dependency with `useSitePolygonBulkActions`).** The three callbacks that bulk-actions consumes (`handleValidationJobsStarted`, `clearValidationPending`, `handleValidationUiCleared`) only touch local state/refs; the polling effect consumes bulk-actions' outputs (`showValidationResultsModalIfPending`, `cancelPendingValidationResultsModal`). Split in two so call order stays exactly as it is today:

```
// src/pages/site/[uuid]/hooks/usePolygonValidationRun.ts
const validationRun = usePolygonValidationRunState({ polygonsData });
//   → { pendingValidationPolygonUuids, validationZoomPolygonUuids, supplementalValidations,
//       skipNextSiteBboxZoomNonce, handleValidationJobsStarted, clearValidationPending,
//       handleValidationUiCleared, handleValidationZoomConsumed, /* refs */ internals }

const bulk = useSitePolygonBulkActions({ ...validationRun callbacks });

usePolygonValidationPolling(validationRun, {
  isEditPolygonOpen, refetchPolygons, fetchAllValidationPages, fetchOverlapValidations,
  showValidationResultsModalIfPending: bulk.showValidationResultsModalIfPending,
  cancelPendingValidationResultsModal: bulk.cancelPendingValidationResultsModal,
  analytics: { siteUuid, entityType }, onResolved?: () => void, t
});
```

`onResolved` is where the project view refreshes the rollup (R1). Toasts stay in the hook so both scopes get them.

**Effort:** ~half a day + a QA pass of "Run Validation" on the site page (the only behaviour to re-verify). **Risk:** medium (touches the live site page), mitigated by pure move, identical dependency arrays, and both pages exercising the same code from then on. Ship as its own PR after PR-3/PR-4 so the diff reads as a move.

### R3. Extract `usePolygonReviewModals` (approve / request-information), consume from both

**What's duplicated.** Modal state + open/close handlers + `resolveSitePolygonUuidsAndNames` + `handleApprovePolygons` + `handleConfirmRequestInformation` + the two map-popup bridges + the two drawer bridges:

- `SitePolygonsWorkspace.tsx:830-960`
- `ProjectFlatPolygonsView.tsx:117-122, 722-849`

~130 lines each, identical except `mapSitePolygonToTableRow(polygon, t, { includeSiteName: true })` in the project copy. Inputs: `{ polygonsData, selectedRows, approvePolygons, requestInformationForPolygons, clearBulkTableSelection, editPolygonUuid, includeSiteName, t }`; it reads `polygonApproveConfirmation` / `polygonRequestInformationConfirmation` from `useMapAreaContext` itself. Outputs: the 4 state values + 6 handlers that `SitePolygonModals` and `PolygonEditDrawerDataSync` take.

**Effort:** ~2 h. **Risk:** low-medium; pure move, no async subtleties. Bundle with R2 in the same follow-up PR.

### R4. Make the site-only `SitePolygonModals` props optional instead of passing 25 no-ops

`ProjectFlatPolygonsView.tsx:950-1021` passes `submitPayload={null}`, `openUploadModal={false}`, `onSubmitPolygons={() => undefined}`, `onUploadSuccess={() => undefined}`, … — roughly 25 props that exist only to satisfy required types for flows the project view deliberately has no entry point to. Making those props optional in `SitePolygonModals.tsx:40-91` with defaults of `false` / `[]` / `null` / noop is purely additive (the site workspace still passes every real value) and removes ~35 lines of noise plus the risk that someone "fixes" a `() => undefined` into a real handler.

**Effort:** ~1 h. **Risk:** very low (types only; site passes all props).

### R5. Selection / focus housekeeping — extract only if R2+R3 land

`clearTableSelection`/`clearBulkTableSelection`, the prune-selection-to-visible-rows effect, the pending-focus deep-link effect, `handleFocusPolygonConsumed`, `polygonTableHighlight` memo, `handleClearHover`, sticky-scroll effect: `Site:404-434, 521-538, 808-828, 987-1000` vs `Project:312-320, 510-541, 700-720, 857-870`. ~80 lines each. Worth folding into a `usePolygonTableInteraction` hook once R2/R3 exist, not before — on its own it's small and stable.

Also note the one real drift here: `handleSelectOverlapPolygons` in the project view (`:322-332`) dropped the `.filter(hasOverlapValidationFailure)` that the site version has (`:546-547`). Whether that matters is a correctness question; that it *could* drift is the reason to share it.

### R6. Backend: one helper each for the duplicated controller/service plumbing (see §5)

---

## 2. The big one: is there a clean shared-core extraction now?

**Verdict: extract hooks, not a component. Leave the two composers as two files.**

What is genuinely shared between `SitePolygonsWorkspace` (1289 lines) and `ProjectFlatPolygonsView` (1106 lines):

| Block | Lines (each) | Extract? |
|---|---|---|
| Validation-run state + polling | ~200 | **Yes** (R2) — highest churn, already drifted |
| Approve / request-info modals + bridges | ~130 | **Yes** (R3) — mechanical, no async |
| Selection / focus / sticky housekeeping | ~80 | Later (R5) |
| `SitePolygonModals` no-op spread | ~35 | Shrink via optional props (R4) |
| Data hooks wiring (filters → polygons → validations → table → overlap → selection → cross-site) | ~120 | **No** — these are already hooks; the wiring *is* the composer's job, and it differs (`entityName`, `showSiteColumn`, `overlapValidationsSource`, site-facet filter, `virtualSite`) |
| JSX render | ~250 | **No** — the project view omits `PolygonSubmissionAnnouncement`, Add/Draw/Upload, undo, `overlapFix`, and adds tiles / stepper / cross-site count |

After R2+R3+R4 the project view is ~700 lines, the site view ~900, and the remaining duplication is "call the same 12 hooks in the same order, then render" — which is the acceptable kind: it is declarative, easy to diff, and each file reads top-to-bottom.

What **not** to do: a `PolygonsWorkspace({ entity, entityUuid, features: {...} })` that both pages render. The site page has drawing, upload, duplicate-detection, `?editPolygon=` deep links, submit flows, overlap auto-fix; the project view has none of those and adds a Site facet, tiles, stepper, cross-site selection, virtual-site adapter. A single component would need ~15 feature switches and would put every project change on the site page's blast radius — the opposite of what the branch's own PR-split plan is optimising for. The drill-in already proves the "render the *real* site workspace when you actually want the site workspace" pattern; the flat view is a different product surface and should stay a different composer.

**Sequencing:** land the feature (PR-0…PR-4 as planned). Then one follow-up PR: "extract `usePolygonValidationRun` + `usePolygonReviewModals`, pure move, both workspaces consume". Reviewer instruction: verify the site diff is deletion-only plus two hook calls. That is a much easier review than an extraction interleaved with new-feature code.

---

## 3. Dead / vestigial code

Ordered by how clearly dead it is.

| # | What | Where | Why it's vestigial | Action |
|---|---|---|---|---|
| D1 | `useProjectPolygonStatusCounts` + `loadSitePolygonCount` + test | `useProjectPolygonStatusCounts.ts`, `src/connections/SitePolygons.ts:257-275` | Superseded by the rollup (R1). Its `enabled` param (`:36`) is never passed; `needsWork` (`:17, :27, :69`) and the returned `error` are never read. | Delete (R1) |
| D2 | `hasNoBucketData` "all-zero → —" guard | `ProjectSiteRollupTable.tsx:15-31, 76-81` | Written for the interim fan-out that reported buckets as 0. The real endpoint always returns buckets (`site-polygons.service.ts` GROUP BY). The guard is now *wrong* rather than harmless: a site whose polygons are all `not_checked` has `notChecked === activeTotal` so it's fine, but a site with real polygons and every bucket legitimately 0 cannot exist, so it never fires — pure dead branch. | Delete guard; render numbers directly |
| D3 | Null branches in `rollupTableCells` | `rollupTableCells.tsx:13-14 (orDash null), 23-26 (AnomaliesCell null)` | Only reachable via D2. | Simplify to number-only once D2 goes |
| D4 | `useProjectSiteRollup.toRow` | `useProjectSiteRollup.ts:35-52` | The backend DTO already normalises every count to a number (`site-review-rollup.dto.ts` constructor) — the FE re-does `?? 0` on fields that can't be null. It also coerces `hectares: null → 0`, which is why `orDash(row.hectares, " ha")` (`ProjectSiteRollupTable.tsx:121`) can never show "—" for a site with no polygons. | Consume `SiteReviewRollupDto` directly (keep only `siteName ?? ""`); or keep `toRow` but stop nulling hectares |
| D5 | `SiteRollupMap.selectedSiteUuid` | `SiteRollupMap.tsx:36, 203-212` (+ `promoteId: "uuid"` at `:131`, the `"selected"` feature-state branch at `:145-147`) | Never passed by `ProjectSiteRollupView`. When a site *is* selected the map is unmounted (drill-in replaces it). Carried over from the prototype where map and list coexisted. | Delete prop, effect, feature-state branch, `promoteId` |
| D6 | `loadSiteReviewRollup` | `src/connections/SiteReviewRollup.ts:24` | Unused export. | Delete |
| D7 | `siteStatus` on the rollup row | `useProjectSiteRollup.ts:12, 38`; DTO `siteStatus` | Fetched, mapped, never rendered or filtered on. Harmless in the DTO (cheap, may be wanted later); dead on the FE row type. | Drop from the FE row; keep in DTO if you expect a "site status" column soon, otherwise drop from the SQL too |
| D8 | `enableEditDetails` prop | `PolygonBulkActionToolbar.tsx:43-46, 70-84`; only caller `ProjectFlatPolygonsView.tsx:948` passes `true` (= default) | Added for "Phase 1 view-only", then product re-enabled bulk edit. Every caller now uses the default. This is a shared-component change carried for nothing. | Delete the prop; keep `enableDelete` (used with `false`) |
| D9 | `variant?: "adminReview"` thread | `ProjectPolygonsWorkspace.tsx:16, 35, 58, 76`; `ProjectFlatPolygonsView.tsx:93, 96, 99`; `AdminProjectPolygonReviewShell.tsx:39` | Type is the single literal `"adminReview"`; `isAdminReview` is always `true`; passed through three components. The site workspace's variant is real (`"champions" \| "adminReview"`); this one is YAGNI for a champion project variant nobody has scheduled. | Drop the prop; hard-code `isAdminReview = true` with a one-line comment. Re-add when a second variant exists |
| D10 | `virtualSite` extra fields | `ProjectFlatPolygonsView.tsx:138-148` | `projectUuid`, `hectaresToRestoreGoal`, `frameworkKey` are set but the consumers get those from `project` directly (`SitePolygonModals projectUuid={project.uuid}` `:1007`, `SitePolygonMetricsSection restorationAreaGoal={project.totalHectaresRestoredGoal}` `:1072`); shared site components only read `siteData.uuid` / `site.name`. | Shrink to `{ uuid, name }`; the cast comment then also gets simpler |
| D11 | Stale header comment | `ProjectFlatPolygonsView.tsx:83-86` | Says "Bulk Delete and bulk Edit Details are disabled"; Edit Details is enabled at `:948`. | Fix the comment |
| D12 | `AdminProjectPolygonReviewShell` second `useFullSite` | `AdminProjectPolygonReviewShell.tsx:28-31` | Only to get `drilldownSite?.name` for the breadcrumb; `ProjectSiteDrilldownView` fetches the same site. The comment says "cache-only in practice" — true, but it's a second subscription in a component that also re-renders the whole workspace. | Acceptable as-is; cleaner alternative is for the drilldown view to report the site name up (`onSiteLoaded(name)`), or for the breadcrumb to render the site name from the rollup rows (already in memory, no fetch). Low priority |
| D13 | Untranslated map label strings | `siteCentroidFeatureCollection.ts:20-25, 55` | `"polygons"`, `"failed"`, `"overlaps"`, `"Unnamed site"` are hard-coded English inside a pure util (no `t`). Not dead code, but a cheap fix: pass `t` in or build the label in `SiteRollupMap` where `useT` is available. | Fix when convenient |

Not dead, but flagged for honesty: `useAllSiteValidations` / `useAllProjectValidations` (`src/connections/Validation.ts` ~120-207) are two 30-line hooks that differ only in which connection they call. The paging loop was already extracted (`loadAllValidationPages`), which was the right call; folding the two hooks into a generic `useAllValidations(loadPage)` would save ~25 lines and is optional.

---

## 4. Two summary-tile components

`ProjectPolygonSummaryTiles` (109 lines; interactive; counts *polygons* by validation status; flat mode) vs `ProjectSiteRollupSummary` (82 lines; read-only; counts *sites* by review state; rollup mode).

**Recommendation: keep two containers, share one tile primitive.** They are semantically different (polygons vs sites, click-to-filter vs read-only) and the rollup summary's per-site heuristics (`withFailures`, `fullyApprovable`, `notStarted` at `ProjectSiteRollupSummary.tsx:28-35`) don't map onto validation-status filters. Unifying them would mean a props union that is harder to read than two 80-line files.

What *is* duplicated is the tile chrome — the `Box px={4} py={3} borderRadius="lg" borderWidth="1px" …` + 24px value + 300 label — `ProjectPolygonSummaryTiles.tsx:71-102` and `ProjectSiteRollupSummary.tsx:53-70`, plus the `tone → colour` maps (`:20-25` and `:12-17`). Extract a ~25-line `SummaryTile({ value, label, tone, isLoading, active?, onClick? })` in the same folder and have both map over it. ~40 lines saved, and the two strips stop looking subtly different. Do it if you touch either file for R1; not worth a PR on its own.

If R1's "drop the tiles from flat mode" option is taken, this question disappears.

---

## 5. Backend

### 5a. `GET /validations/v3/projects/:projectUuid` — consolidate the plumbing

- **Controller** (`validation.controller.ts:60-87` vs `:101-128`): the two bodies are identical apart from the service call and the `requestPath` prefix — page defaults, `criteriaId` parse + validation, the `reduce` into a document, `addIndex`. Extract `private parseValidationIndexQuery(query)` → `{ pageSize, pageNumber, criteriaId }` and `private buildValidationIndexDocument(validations, total, pageNumber, requestPath)`. Keep two routes / two `operationId`s (codegen wants them). ~30 lines saved, and any future query-param addition happens once.
- **Service** (`validation.service.ts:109-168`): `getSiteValidations` and `getProjectValidations` both re-validate `pageSize`/`pageNumber` (`:118-123`, `:149-154`) before delegating to `getValidationsForPolygonUuids`. Move the page checks into `getValidationsForPolygonUuids` (`:170`) and delete them from both callers.
- **Double project lookup.** `getProjectValidations` does `Project.findOne({ uuid })` (`:156-163`) and then calls `getProjectPolygonUuidsForValidation(project.id)` which does `Project.findByPk(projectId)` again (`:258-264`). Two round-trips for one row.
- **Two scopes, two semantics — consolidate into one helper.** The site path resolves uuids with `SitePolygon.findAll({ siteUuid, isActive: true })` (`:125-131`); the project path reuses `getProjectPolygonUuidsForValidation`, which was written for the validation *job* and additionally filters `polygonUuid != ""`, `deletedAt: null`, and **`validationStatus: { [Op.ne]: null }`** (`:276-284`). So a never-validated active polygon is included in site validations and excluded from project validations. The correctness review owns whether that matters for the UI; from a structure standpoint the fix is the same either way: one `private getActivePolygonUuidsForSites(siteUuids: string[])` used by both `getSiteValidations` and `getProjectValidations` (project path = `Site.findAll({ projectId }) → helper`). That deletes the `Project.findByPk` duplication and leaves `getProjectPolygonUuidsForValidation` to the job path only.

The `getValidationsForPolygonUuids` extraction itself is correct and is the right seam. Its in-memory paging over `allCriteriaData` (`:186-207`) is pre-existing and scales with the project — already flagged in the Phase 1 plan risk #9; not this review's problem.

### 5b. `GET /research/v3/sitePolygons/siteReviewRollup`

Well-built: one GROUP BY, constants instead of literals, LEFT JOIN rationale documented, explicit `deleted_at`, index migration justified with the query it serves. Nothing to consolidate. Two small notes:

- The backend `SiteReviewRollupRow` type (`site-review-rollup.dto.ts:9-26`, `number | string`) and the FE `SiteReviewRollupRow` (`useProjectSiteRollup.ts:9-26`, `number`) share a name and not a shape. Rename the backend one `SiteReviewRollupSqlRow` (or similar) so a grep doesn't mislead.
- `siteStatus` is selected/grouped but the FE never uses it (D7). Keep it if a site-status column is imminent; otherwise drop it from the SQL, DTO, hand-added FE schema, and row type together.
- The controller spec (+104) and service spec (+88) are proportionate; no duplication worth flagging.

### 5c. Hand-added generated types

`researchServiceComponents.ts:1765-1818`, `researchServiceSchemas.ts:1313-1332`, `researchServiceConstants.ts` — three hand-written blocks marked "replace via `yarn generate:researchService`". That is the agreed procedure; just make sure the replacement actually happens in PR-2/PR-4 (or a follow-up) and that `GetSiteReviewRollupResponse.data` becomes an array (`data?: {…}[]`) in the generated output — the hand-added version types it as a single object (`:1798-1806`), which is only working because the connection layer ignores that type.

---

## 6. What NOT to change (deliberate, keep)

- **`ProjectSiteDrilldownView` rendering `SitePolygonsWorkspace` verbatim** (`ProjectSiteDrilldownView.tsx:50-56`) with `hideCreateActions` / `hideGeotaggedMedia` as the only knobs. This is the zero-duplication choice from the rollup plan §3.2 and it's the model for R2/R3: reuse the real thing, add the smallest opt-out prop.
- **The "virtual site" cast** (`ProjectFlatPolygonsView.tsx:138-148`). Ugly but honest; the shared hooks only read `uuid`/`name`. Shrink it (D10), don't replace it with a real adapter type — that would be over-engineering for two fields.
- **Client-side Site facet** (`polygonFilter.constants.ts siteId`, `ProjectFlatPolygonsView.tsx:192-220`). The backend index forbids `siteId[]` with `projectId[]`; filtering the already-loaded < 100 rows client-side is the right call. Don't add a server param for it.
- **Client-side overlap-pair dedup** (`projectOverlapPairs.ts`) and **`useProjectAnomalies` ordering**. Pure, tested, no requests, and flat mode is bounded at 100 polygons so scale isn't a concern. The optional `…/projects/:uuid/overlaps` endpoint from Phase 1 plan §6 B2 stays optional.
- **Two Mapbox instances** (`SiteRollupMap` standalone vs `PolygonsMap` under `MapAreaProvider`). They never co-mount; wiring the rollup map through `MapAreaProvider`/`Map.tsx`'s unverified `polygonsCentroids` prop would be more code and more risk for no user-visible gain (rollup plan §6 risk 3).
- **The fail-safe "rollup on error" mode** (`projectPolygonViewMode.ts:30-32`). Small, tested, and prevents the one bad outcome (load-all on an unknown-size project).
- **`useProjectSiteDrilldown` URL state** (`?site=`). 46 lines for linkable, back-button-safe drill-in; exactly as thin as it should be. Calling it in both the shell and the workspace is fine — it's a router read.
- **All the additive, default-preserving props on shared site files** (`showSiteColumn`, `entityScope`, `entityType`/`entityModel`, `siteOptions`, `searchSiteName`, `overlapValidationsSource`, `crossSiteTooltip`, `hideCreateActions`, `hideGeotaggedMedia`, `crossSiteOverlapCount`/`anomalyStepper` slots, `entityType` on analytics). Every one defaults to prior site behaviour; that's the correct way to reuse. The single exception is `enableEditDetails` (D8), which no longer has a non-default caller.
- **`ApprovePolygonConfirmation` prune-on-open fix** (`:49-57`). A general correctness fix; keep, and call it out in PR-1 as planned.
- **Copying the polling block *for PR-3*.** The decision to ship the copy rather than refactor the live site page inside the feature PR was right for that PR. R2 is a recommendation about the *next* PR, not a reversal of that call.
- **The `criteria_site` index migration.** Justified by the correlated EXISTS in the rollup and by the OVERLAPPING validator; keep.

---

## 7. Suggested order of operations

1. Before opening PR-3/PR-4: D2, D3, D5, D6, D8, D9, D10, D11 (all project-only or type-only deletions; ~15 min each). R1 if the tiles stay. 5a controller/service helpers and the shared uuid resolver (backend, self-contained, keeps the specs).
2. After PR-4 merges: one follow-up PR for R2 + R3 (+ R4 while there), reviewed as a pure move against the site page.
3. Opportunistic: R5, §4 `SummaryTile`, `useAllValidations` generic, `siteStatus` decision, translated map labels.
