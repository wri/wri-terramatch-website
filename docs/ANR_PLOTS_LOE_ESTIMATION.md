# ANR Monitoring Plots – LOE Estimation (Revised)

**Scope:** Interim solution for ANR plot grids (30m×30m GeoJSON) tied to approved ANR polygons. Admin upload/view; Champion view/download. No grid generation or validation in TM.

---

## Approach: Phased by Delivery

Instead of flat task list, structure by **foundation → integration → polish**. Each phase delivers testable value.

---

## Phase 1: Foundation | **4.5 d**

### Backend (2.5 d)
Table keyed by polygon UUID; GeoJSON blob. Endpoints: POST, GET by polygon UUID, DELETE.
- **Challenge to 2d:** Auth enforcement, GeoJSON validation, size limits, and "polygon belongs to site + status=approved + ANR" checks add scope. Migration + tests included.
- **Recommendation:** 2.5 d (original 2d was optimistic).

### Admin Upload (2 d) — overlaps with backend
"Upload ANR plot" in selected-polygon context (PolygonDrawer/Aside). File input → API → refetch. Enabled only when polygon approved + practice includes ANR.
- **Assumption:** Polygon attributes (practice, status) already in context when polygon selected. Verified in `sitePolygonData`.
- Replace = re-upload; Delete = button + confirm. Bundled here.
- **Challenge:** 2d holds if we keep replace/delete minimal. UI placement and error handling included. → **2 d**.

---

## Phase 2: Map Integration | **3.5 d**

### Layer + Toggle (3 d combined — was 2+1)
- **Reframe:** Layer and toggle are coupled. Adding layer without toggle is useless; toggle without layer is empty. Estimate as one unit.
- **Logic:** Toggle on + polygon selected + ANR + approved → fetch plot for `polygonFromMap.uuid` (1 API call). Set GeoJSON as source; add fill/line layer. Toggle off or polygon switch → clear source/layer.
- **Challenge to original 2d toggle:** Original assumed "fetch for each approved ANR polygon." Ticket specifies plots for **selected polygon only**. Simpler: 1 fetch. But layer lifecycle (add/remove on style.load, polygon change, toggle) has edge cases.
- **Recommendation:** 2.5 d (layer style, source lifecycle, tooltip for plot ID) + 0.5 d (toggle control, conditional fetch) = **3 d**.

### Conditional Visibility (0.5 d)
Gate all ANR features on practice + status. Feature flag optional. Can be absorbed into above; kept separate for clarity.
- **Recommendation:** **0.5 d**.

---

## Phase 3: PD + Polish | **1.5 d**

### PD Download (0.5 d)
Reuse `downloadGeoJsonFile` pattern. GET plot by polygon UUID, trigger download. Button in MapPolygonPanel or OverviewMapArea when polygon selected.
- **Recommendation:** **0.5 d**. Straightforward.

### Testing & Edge Cases (1 d)
- **Challenge to 0.5d:** Empty state, large GeoJSON, polygon switch timing, regression on polygon QA. Real integration testing usually surfaces 2–3 issues. 0.5d is optimistic.
- **Recommendation:** **1 d**.

---

## Revised Total: **9.5 d** (range: 8–11 d)

| Phase | Items | Days |
|-------|-------|------|
| 1 – Foundation | Backend (2.5), Admin upload/replace/delete (2) | 4.5 |
| 2 – Map | Layer + toggle (3), conditional visibility (0.5) | 3.5 |
| 3 – PD + Polish | Download (0.5), testing (1) | 1.5 |
| **Total** | | **9.5** |

---

## Changes from Original

| Item | Original | Revised | Reason |
|------|----------|---------|--------|
| Backend | 2 d | 2.5 d | Auth, validation, migration often underestimated |
| Admin replace/delete | 0.5 d | (bundled) | Folded into upload; no separate estimate |
| Map toggle + layer | 2 + 1 d | 3 d combined | Coupled; scope simplified (1 polygon, 1 fetch) |
| Testing | 0.5 d | 1 d | Integration and regression usually need more time |
| **Total** | 9 d | **9.5 d** | Backend + testing bumps; consolidation saves 0.5d elsewhere |

---

## Confidence & Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Backend API shape mismatch | +0.5 d | Align schema with FE before implementation |
| Polygon selection context missing in PD | +0.5 d | Verify `polygonFromMap` / selected polygon available in OverviewMapArea |
| Large GeoJSON (>5MB) | +0.5 d | Add size limit or streaming if needed |
| Layer ordering conflicts | Low | Use `beforeLayer` pattern; test with media layer |

---

## Technical Feasibility

- **Map layer:** Low risk. GeoJSON source + `addLayerGeojsonStyle` pattern exists. Distinct styling trivial.
- **Storage:** Simple. No nesting; plots independent of polygon geometry.
- **QA conflict:** Low. Separate layer; no change to polygon validation flows.

---

## Open Questions

- Max GeoJSON size; pagination if needed.
- Polygon versioning: plot on old UUID vs migrate vs delete (program decision).
- Exact UI placement for "Upload ANR plot" in Polygon Review (confirm with design).
