import { FC, useEffect } from "react";

import { AnrMapOverlayProvider } from "@/context/anrMapOverlay.provider";
import { PolygonEditDrawerProvider } from "@/context/polygonEditDrawer.provider";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";

import ProjectFlatPolygonsView from "./ProjectFlatPolygonsView";
import { resolveProjectPolygonViewMode } from "./projectPolygonViewMode";
import ProjectSiteDrilldownView from "./ProjectSiteDrilldownView";
import ProjectSiteRollupView from "./ProjectSiteRollupView";
import { UseProjectSiteDrilldown, useProjectSiteDrilldown } from "./useProjectSiteDrilldown";
import { useProjectSiteRollup } from "./useProjectSiteRollup";

export interface ProjectPolygonsWorkspaceProps {
  project: ProjectFullDto;
  variant?: "adminReview";
  /**
   * Drill-in state provider. Defaults to the Next-router `useProjectSiteDrilldown` (standalone page).
   * The admin panel runs under react-admin's HashRouter, where the Next router can't see the in-hash
   * `?site=`, so it injects a `useSearchParams`-based adapter instead.
   */
  drilldown?: UseProjectSiteDrilldown;
}

/**
 * ProjectPolygonsWorkspace — mode switch for project-level polygon review
 * (docs/plans/project-polygons-site-rollup-plan.md §3.2).
 *
 * The site rollup (`useProjectSiteRollup`) fires first, always — it is cheap (O(sites), no polygon
 * rows) and its total decides the mode via `resolveProjectPolygonViewMode`:
 *  - "flat": the project has < PROJECT_SITE_ROLLUP_THRESHOLD active polygons — today's full polygon
 *    list + map, unchanged (`ProjectFlatPolygonsView`). Only this branch loads every polygon.
 *  - "rollup", no `?site=`: a per-site rollup table + site-centroid map, no polygons loaded
 *    (`ProjectSiteRollupView`).
 *  - "rollup", `?site=<uuid>`: in-place drill-in — the existing `SitePolygonsWorkspace` for that
 *    site, the canonical site review surface (`ProjectSiteDrilldownView`).
 *  - "loading": the rollup hasn't resolved yet — render nothing rather than guess.
 *
 * A one-site project has nothing to roll up, so it auto-drills into that site.
 */
const ProjectPolygonsWorkspaceContent: FC<ProjectPolygonsWorkspaceProps> = ({
  project,
  variant = "adminReview",
  drilldown
}) => {
  const { loaded: rollupLoaded, rows, total, error: rollupError } = useProjectSiteRollup(project.uuid);
  // Always call the Next-router default (hooks must be unconditional); use the injected adapter when
  // provided (admin/HashRouter). The default's navigate is never invoked when an adapter is injected.
  const fallbackDrilldown = useProjectSiteDrilldown();
  const { siteUuid, drillInto, backToSites } = drilldown ?? fallbackDrilldown;

  const mode = resolveProjectPolygonViewMode({
    isLoadingTotal: !rollupLoaded,
    totalError: rollupError != null,
    total
  });

  // A one-site project's rollup list would be a single row — go straight to its review. Still
  // resolved under rollup mode first, so no project-wide load-all happens before the redirect.
  useEffect(() => {
    if (mode === "rollup" && siteUuid == null && rows.length === 1) {
      drillInto(rows[0].siteUuid);
    }
  }, [mode, siteUuid, rows, drillInto]);

  if (mode === "loading") {
    return null;
  }

  if (mode === "flat") {
    return <ProjectFlatPolygonsView project={project} variant={variant} />;
  }

  if (siteUuid != null) {
    return <ProjectSiteDrilldownView siteUuid={siteUuid} onBack={backToSites} />;
  }

  return (
    <ProjectSiteRollupView
      project={project}
      rows={rows}
      loaded={rollupLoaded}
      error={rollupError}
      onSelectSite={drillInto}
    />
  );
};

const ProjectPolygonsWorkspace: FC<ProjectPolygonsWorkspaceProps> = ({
  project,
  variant = "adminReview",
  drilldown
}) => (
  <AnrMapOverlayProvider>
    <PolygonEditDrawerProvider>
      <ProjectPolygonsWorkspaceContent project={project} variant={variant} drilldown={drilldown} />
    </PolygonEditDrawerProvider>
  </AnrMapOverlayProvider>
);

export default ProjectPolygonsWorkspace;
