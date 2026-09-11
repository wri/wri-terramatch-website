# Project-level polygon review at scale — design options memo

Audience: designer + tech lead reacting/deciding. No code in this doc.

> **UPDATE (2026-09-07) — recommendation revised after two data findings + PM input. Read §0 first.**
> The original memo (below, §1–5) recommended an *anomalies-only queue* on the assumption that few polygons need review. Prod data + the PM disproved that assumption. The current recommendation is in **§0**; §1–5 are kept for the reasoning trail.

---

## 0. Revised recommendation (supersedes §3)

### Finding 1 — "show only exceptions" doesn't shrink the problem, because "Partially Passed" is approvable
The reviewer terminology matters: validation status is one of **Passed / Partially Passed / Failed / Not Started**, and **admins approve Passed *and* Partially Passed**. So "needs hands-on work" = **Failed + Not Started**, not "anything not Passed." Re-measured on the mega-projects:

| Project | Total | Approvable (passed+partial) | Failed | Not started |
|---|---|---|---|---|
| Rwanda 2023 | 10,977 | **8,939 (81%)** | 1,807 | 231 |
| Nurturing Indigenous | 4,309 | **4,275 (99%)** | 22 | 12 |
| Landscape Restoration | 4,347 | **3,340 (77%)** | 547 | 460 |
| SHADE 4 VEGETABLES | 7,705 | 3,476 (45%) | 3,612 | 617 |
| Community Led | 6,454 | 2,803 | 3,316 | 335 |
| Scaling up | 4,351 | 380 | 18 | **3,953 (not validated yet)** |

Across all active polygons, *partial* is the single most common status (48k of ~110k). So on most big projects the dominant reality is **a large approvable majority**, not a large exception set — which means the primary job is bulk-clearing that majority, and an "exceptions-only" view would hide 80–99% of what the reviewer acts on.

### Finding 2 — the PM confirms two distinct workflows, split by task type
- **Bulk, driven by validation result (the volume):** approval and **attribute edits (e.g. restoration practice)** are done *in bulk*, grouped/filtered by validation status.
- **Individual polygon view (the exceptions):** fixing **overlaps / geometry** and **plant start date** is done one polygon at a time.

### Revised recommendation
Make the large-project spine **"group/filter by validation status → bulk act," backed by server-side aggregate counts so we never load-all**:
1. **Server-side summary tiles + status filter** — "8,939 approvable · 1,807 failed · 231 not started" without loading 10k rows. This is the scale fix and the workflow fix at once.
2. **Bulk-approve and bulk-attribute-edit** as the primary, fast path over the passed/partial majority. *(Bulk attribute edit was disabled in Phase 1 as "view+review"; the PM says it's core — re-enable it for project scope.)*
3. **Anomaly stepper / individual drill-in scoped to the Failed + Not-Started subset** — a right-sized set (often hundreds), where geometry/overlap/plant-start fixes happen. *(Individual **geometry** editing was gated off in Phase 1; see the separate re-enable plan `project-polygons-geometry-editing-plan.md`.)*
4. **Size-adaptive:** ≤25-polygon projects (~46%) keep today's flat UI untouched; the rollup/summary machinery only engages above a threshold.
5. **Never hold the full set client-side above the threshold** — the table becomes a server-paged query; overlap-pair dedup needs its own aggregate rather than a load-all over validations.

This keeps the anomalies concept as a *filter/lens* (useful) rather than the *only* view (which the data shows fails the worst projects), and it directly matches the PM's two-workflow split.

### Still open for PM/tech lead
- Whether "browse everything" (unfiltered) is a genuine need or just inherited from the site page — decides how much server-pagination we must build vs. a filter-required safety valve.
- Acceptable first-paint latency on the worst project (sets page size / whether the aggregate endpoint ships in phase 1).
- Whether bulk attribute edit at project scope should be limited to certain fields/statuses.

---

## 1. Problem framing

We shipped project-level polygon review by lifting the site-level workspace (map + full-load table + filters + anomaly stepper + bulk approve/request-info) up one level of scope. That UI's core assumption — "load every polygon for this scope into memory, render it all, let the reviewer scroll/filter" — holds at site scale because a site is small by construction. It breaks at project scope because a project is not small by construction.

**The wrinkle that rules out the obvious fix.** The instinct is "just roll up to a site list and drill in" — but the data says that doesn't bound the problem. The heaviest projects don't have many sites; they have *few* sites with *enormous* polygon counts inside them:

- Rwanda 2023: Agroforestry in Rubavu — 3 sites, 10,977 polygons, one single site with 10,012.
- SHADE 4 VEGETABLES — 3 sites, 7,705 polygons.
- Scaling up Community Capacity — **1 site**, 4,351 polygons.
- The single worst site anywhere: 10,012 active polygons.

So there are really two independent scale problems, and a design that only solves one of them still fails the worst projects:

1. **Across-site scale** — many sites, moderate polygons each (e.g. GBM PPC: 21 sites / 3,908 polys, ~186/site). A site-grouped view genuinely helps here.
2. **Within-site scale** — one or a handful of sites, each individually too large for a flat map+table. Drilling "into the site" lands you right back in the same flat-list problem, just one level down. Any design that treats "group by site" as the whole answer will look great in a demo and fail on exactly the projects that most need help.

**Two distinct costs, not one.** These call for different fixes:
- **Load cost**: `useAllSitePolygons` auto-paginates every page (100/page) into memory before anything renders — 10k polygons = ~100 sequential requests, a 10k-row table in the DOM, and (per the implementation plan's own open question) unverified GeoServer tile performance at that density. This is a *before-you-can-do-anything* tax.
- **Interaction/cognitive cost**: even if load were instant, no reviewer can usefully scan a 10,977-row table or a map covered in 10k features. This is a *while-you-work* tax, and it exists even in projects where load is cheap (e.g. 500 polygons loads fine but is still an overwhelming flat list to review).

A design has to address both, and it has to hold up for the concentrated-in-one-site case, not just the spread-out case.

**Which segment each approach actually helps** (288 projects w/ polygons):

| Segment | Count | Bottleneck | What helps |
|---|---|---|---|
| ≤25 polygons | 132 (46%) | none | nothing needed — don't regress |
| 26–100 | 45 | mild interaction | either approach; low stakes |
| 101–500 | 72 | interaction > load | exceptions-first mainly; site facet if multi-site |
| 501–2,000 | 23 | load *and* interaction | needs a real fix |
| 2,000+ | 16 | load *and* interaction, often concentrated in 1–3 sites | needs a fix that does **not** depend on site grouping |

The last two rows (39 projects, ~14%) are where today's UI actually fails, and the wrinkle means a chunk of them won't be rescued by a site hierarchy at all.

**Non-negotiable constraint:** cross-site overlap is the entire reason project scope exists. The OVERLAPPING validator already runs project-wide server-side; whatever we build must keep surfacing that signal, not bury it inside per-site views.

---

## 2. Approaches

### A — Site-grouped hierarchy (drill-down)

**Core idea:** project landing = a list of sites with health summary cards (polygon count, % flagged, last activity), not a single flat map+table. Click a site → today's existing site-level workspace, unmodified. A separate "Cross-site" section/tab above the site list carries anomalies that don't belong to one site.

**10k-in-one-site case:** does not solve it. Drilling into the Rwanda site with 10,012 polygons drops you into the identical flat map+table problem, just renamed. This approach is a real win only for the spread-out shape (GBM PPC-style), not the concentrated shape — and the concentrated shape is where the worst projects live.

**Cross-site visibility:** requires a bolted-on top-level summary (cross-site overlaps aren't "inside" any one site's card), which is exactly the kind of view this pattern naturally omits unless deliberately added back in.

**Load strategy:** landing page can be cheap (aggregate counts per site, not full polygon load) — but only if we build a new lightweight aggregation. Drilling into a mega-site still triggers the full load-all for that site.

**Reuse vs. build:** highest reuse of any option — the site workspace is untouched; only a new site-list landing view + a cross-site summary panel are net-new, both fairly small pieces of UI.

**Verdict:** cheap and clean for the ~103 multi-site projects with reasonable per-site counts, but leaves the worst 16+ projects exactly as broken as today. Not sufficient alone.

---

### B — Anomalies-first review queue (exceptions surface)

**Core idea:** stop treating this as a browsing tool and treat it as what it actually is — a review tool. Default view shows only polygons that need a decision: failed validations, overlaps (same-site and cross-site), pending/needs-more-info status. Clean, already-approved polygons are summarized in a count tile, never rendered by default.

**10k-in-one-site case:** this is the one approach that structurally solves it, because it decouples effort from *total* polygon count and scales with *anomaly* count instead. A site with 10,012 polygons where (say) 40 have open validation failures is a 40-row queue, not a 10,012-row table — regardless of how many sites the project has or how the polygons are distributed across them. This directly attacks both the load cost (fetch only the flagged subset) and the interaction cost (nothing to scroll past).

**Cross-site visibility:** improves it. The OVERLAPPING criteria failure is just another queue item, and because it's not nested under a site, cross-site pairs surface with equal or higher prominence than same-site issues — the opposite of option A's problem. The already-planned `useProjectAnomalies` / `PolygonAnomalyStepper` concept from the implementation plan is essentially this idea already, just currently scoped as a strip *on top of* the full table rather than *replacing* it as the default.

**Load strategy — the key finding:** the backend index already supports `validationStatus[]` and `hasOverlap` as query filters (confirmed in the existing endpoint: `GET /research/v3/sitePolygons?projectId[]=…&hasOverlap=true` etc.). That means an exceptions query is filterable server-side **today**, without new backend work, if the frontend stops always calling the "auto-paginate everything" hook for the default view and instead issues a filtered, bounded query. This is a data-fetching inversion, not a new endpoint.

**Caveat / risk to flag honestly:** this only pays off if the anomalous subset really is small relative to total. We don't have that number yet for the worst projects (e.g., is the 10,012-polygon Rwanda site mostly already-approved with a handful of outstanding issues, or mostly pending review?). If it's the latter, the "queue" could itself still be in the high hundreds — better than 10k, but it means the queue also needs pagination, not an assumption that it's always tiny. Flagged as an open question below.

**Reuse vs. build:** medium. Table rows/columns, bulk approve/request-info, and the anomaly-stepper concept are all reused near-verbatim. The real work is inverting the default data-loading path from "load-all → compute anomalies client-side" to "query anomalies server-side directly," which touches the workspace's core data hook, not a cosmetic layer.

---

### C — Progressive disclosure / viewport-driven loading (map-first)

**Core idea:** map is primary. At wide zoom, show a cheap aggregate view (clustered/status-colored points, similar to the design deck's "Field Data Review" map concept) instead of full geometry. The table stays empty/collapsed until the reviewer zooms into an area or selects a cluster; only then do we fetch and render that viewport's polygons.

**10k-in-one-site case:** partial. Rendering is bounded by viewport for the *map* (GeoServer MVT tiles are already fetched per-tile, so this may already be less bad than assumed for pure rendering — worth measuring before assuming it's broken). But a single geographically-concentrated mega-site's 10k polygons can all sit in the same viewport at a normal zoom level, so viewport-bounding alone doesn't guarantee a small in-view set. Would need real spatial clustering/aggregation at zoomed-out levels, with a "zoom in past N features to see individuals" threshold — a materially new interaction, not a tweak.

**Cross-site visibility:** actually well-suited spatially — an overlap is by definition two polygons occupying the same place, so wide-zoom clustering naturally puts cross-site conflicts where the eye would look. But you can't "step through" a spatial cluster the way you can step through a list, so this still needs option B's queue/stepper as a companion for actually working the anomaly list — it's not a replacement.

**Load strategy:** genuinely new — bbox/cluster-scoped fetches for the table and validation data, not just the map tiles (which are arguably already viewport-scoped). This is the piece of the current architecture that has *no* existing viewport-awareness today outside the tile layer itself.

**Reuse vs. build:** lowest of the four. This is the most bespoke option — no analogous pattern exists in the site-level UI (a site's table always shows the whole site), so it's new interaction design, not a scoped-up reuse of something already built.

---

### D — Server-side pagination + aggregate summary tiles (never load-all)

**Core idea:** infrastructural fix underneath any of the above. Stop calling the auto-paginate-everything hook at project scope entirely. The table becomes a real server-paged grid (request page N of a filtered/sorted query, bounded page size, never hold more than ~100-500 rows client-side). Summary tiles (total, % approved, % needs-info, overlap count, cross-site count, sites count) come from a small new aggregate endpoint computed in SQL, not summed from a fully-loaded array in the browser.

**10k-in-one-site case:** solved for the table (page size is constant regardless of total). The map and the overlap-pair dedup logic need the same treatment — today, overlap pairs are computed client-side from a fully-loaded validation set, which has the identical load-all problem one layer down (the implementation plan already flags an optional future endpoint, `GET …/projects/:uuid/overlaps`, returning deduped pairs — at this scale it stops being optional).

**Cross-site visibility:** unaffected either way structurally, but requires that aggregate/overlap-pairs endpoint to avoid just moving the load-all problem from polygons to validations.

**Load strategy:** true server pagination + a handful of new lightweight aggregate/summary endpoints. This is the only option that is backend-heavy rather than mostly frontend/hook work.

**Reuse vs. build:** UI components (rows, columns, toolbar) reuse cleanly; the backend work (pagination cursors, count queries, an overlap-pairs endpoint) is genuinely new and is the most expensive line item of any option here.

**Note:** this isn't really a competing *navigation* idea like A/B/C — it's the plumbing fix that makes "browse everything" tenable at all. Without it, any approach that still has a "see the full list" mode (which most reviewers will eventually ask for) hits the same wall.

---

## 3. Recommendation

**Ship B (anomalies-first) as the default entry point, on top of the filters/backend we already have, with a hard size-based safety valve standing in for D until D is actually built. Treat A as an optional secondary lens, not the primary structure. Defer C.**

Why, given the data and the reuse-first culture:

- B is the only option that solves *both* halves of the wrinkle (across-site and within-a-mega-site) with the same mechanism, because it organizes around "needs a decision" instead of around project/site structure. That's the actual job of this tool — it's called *review*, not *browse*.
- B is buildable almost entirely by inverting a data-fetching default and reusing filters (`hasOverlap`, `validationStatus[]`) that already exist server-side today — no new backend endpoint is required to ship the first version. That's about as close to "reuse, not invent" as this problem allows.
- A is nearly free (mostly a new landing list + summary cards) and is a genuinely nice navigational aid for the ~103 multi-site, moderate-count projects — but it must not be the *only* path, because it silently fails the concentrated mega-site projects, which are exactly the ones that most need help. Ship it as an alternate tab/filter, not a forced hierarchy.
- D is necessary eventually — B's exceptions queue could still be uncomfortably large if a mega-site's anomaly rate turns out to be high, and any "browse everything" fallback needs it regardless — but it's a backend-heavy investment we shouldn't front-load before confirming (via a real query) how big the exceptions sets actually are. Phase 1 substitutes a cheap safety valve (below) for the full server-pagination rebuild.
- C is the most bespoke, most expensive, and the least validated against real perf data (the implementation plan itself flags map performance at 1,000+ polygons as unmeasured). Don't invest here until B ships and we've actually measured whether the map is even part of the bottleneck.

---

## 4. Phasing

**Phase 1 — minimal step that helps the most projects for the least build**
1. Flip the project workspace's default view to the exceptions queue (Approach B): fetch via existing `hasOverlap` / `validationStatus[]` filters instead of `useAllSitePolygons`'s load-all; render the existing anomaly-stepper concept as the primary surface, not a strip above a full table.
2. Add the already-planned Site facet/filter (this was already scoped as a small addition in the implementation plan) as an optional lens — not a mandatory drill path.
3. Add a size-based safety valve for "Browse all": below a threshold (needs a number — see open questions), keep today's load-all table as a secondary mode; above the threshold, disable full load-all and require a filter/search before rendering rows, with a clear message why. This buys time before D is built without ever silently hanging the browser on a 10k-row fetch.
4. Cross-site overlap pairs surface through the same exceptions query (already the plan for F7's overlap-pair util) — no new backend work needed for this phase.
5. Leave the map rendering path as-is; don't invest in viewport-scoping yet.

**Phase 2 — after Phase 1 ships and we've measured real anomaly rates and map perf**
6. Build the aggregate/summary endpoint + true server-side pagination for "Browse all" (Approach D), replacing the blunt size-threshold valve.
7. Build the site-grouped landing view with health cards (Approach A) as an additional navigational lens for the multi-site projects, if user feedback says it's wanted.
8. Only if the mega-site perf test shows the map genuinely chokes past some N features: invest in viewport/cluster-driven map+table sync (Approach C).

**Deferred / explicitly out of scope here**
- New anomaly types beyond current validators (under-mapped, over-mapped, density) — separate backend/detection work.
- Reconciling this per-project queue with the design deck's cross-project "Field Data Review" / "Casework" concepts. Those are a different surface (portfolio-wide inbox vs. per-project drill-in) but share the same underlying idea as Approach B — a queue of cases, not a browse-everything table. Worth designing Phase 1's exceptions queue so its data shape (case = anomaly + polygon + evidence) is compatible with that future direction, so this isn't rebuilt twice.

---

## 5. Open questions for product owner / tech lead

1. **What's the real anomaly rate on the worst sites?** We need one query: of the Rwanda site's 10,012 active polygons, how many currently have a failed validation, an open overlap, or a non-approved status? This number determines whether Approach B alone gets the queue down to "a few dozen" (great) or "several hundred" (still needs D's pagination sooner than planned).
2. **Is "browse everything" a real reviewer need, or only present today because it's what got reused from the site page?** If reviewers are fine working exclusively from the exceptions queue, we can skip building a full-browse mode at project scope entirely and avoid most of D's cost.
3. **What's an acceptable first-paint latency** for the exceptions queue on the worst-case project? This sets the page size / whether we need the aggregate endpoint in Phase 1 rather than Phase 2.
4. **Should cross-site overlaps be surfaced first/separately in the stepper**, ahead of same-site issues (since cross-site visibility is project scope's unique value), or blended by severity/age like any other anomaly?
5. **What threshold** should trigger the Phase 1 "browse-all disabled" safety valve — 500? 1,000? Should relate to how many sequential page requests we're willing to let a reviewer's browser make (currently ~1 request per 100 polygons).
6. **Has GeoServer/MVT tile performance at 10k+ features per project actually been load-tested?** This is already flagged as unresolved in the implementation plan and directly determines whether Approach C's map work is worth doing at all.
7. **Timeline for the cross-project Field Data Review / Casework surface** from the design deck — if that's coming within a couple quarters, should Phase 1 here be scoped as version 1 of that queue model rather than a project-scoped one-off?
