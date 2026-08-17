import type { FeatureCollection } from "geojson";
import { useRouter } from "next/router";
import { useMemo } from "react";

import { aggregateProject } from "@/components/semanticZoom/aggregate";
import DrilldownMap from "@/components/semanticZoom/DrilldownMap";
import LevelCard, { ChildEntry } from "@/components/semanticZoom/LevelCard";
import { useProjectSitePolygonsGeoJson } from "@/connections/GeoJsonExport";
import { useSiteIndicatorRollup } from "@/connections/SiteIndicatorRollup";

/**
 * The project-level drill-down, as a launchpad rather than an in-tab panel.
 *
 * The PRD frames this experience as entity-level pages: from the project you click a site and land
 * on that site's page. So unlike the semantic-zoom Overview panel — which drilled in place via
 * ?site=/?polygon= query params — this composes the same aggregation core (rollup → aggregateProject
 * → LevelCard) with a map of site centroids, and both the map click and the child-list click
 * NAVIGATE to the site page. Nothing here mutates query state.
 *
 * Sites are drawn as centroids, never as invented hulls: there is no site geometry in the data, and
 * a computed boundary would claim land the project does not hold. The point sits at the mean of the
 * site's polygon coordinates.
 */
export interface ProjectDrilldownLaunchpadProps {
  projectUuid: string;
  projectName: string;
}

const ProjectDrilldownLaunchpad = ({ projectUuid, projectName }: ProjectDrilldownLaunchpadProps) => {
  const router = useRouter();

  const [rollupLoaded, { data: rollupRows }] = useSiteIndicatorRollup(projectUuid);
  const rows = useMemo(() => rollupRows ?? [], [rollupRows]);

  const [geoLoaded, { data: projectGeo }] = useProjectSitePolygonsGeoJson({
    projectUuid,
    geometryOnly: false,
    enabled: true
  });

  const centroids = useMemo<FeatureCollection | null>(() => {
    if (projectGeo == null) return null;
    const features = projectGeo.features ?? [];

    const sums = new Map<string, { lng: number; lat: number; n: number }>();
    const visit = (siteId: string, coords: unknown): void => {
      if (!Array.isArray(coords)) return;
      if (typeof coords[0] === "number" && typeof coords[1] === "number") {
        const [lng, lat] = coords as [number, number];
        if (!Number.isFinite(lng) || !Number.isFinite(lat)) return;
        const acc = sums.get(siteId) ?? { lng: 0, lat: 0, n: 0 };
        sums.set(siteId, { lng: acc.lng + lng, lat: acc.lat + lat, n: acc.n + 1 });
        return;
      }
      for (const child of coords) visit(siteId, child);
    };
    for (const feature of features) {
      const siteId = feature.properties?.siteId;
      if (typeof siteId !== "string") continue;
      if (feature.geometry != null && "coordinates" in feature.geometry) visit(siteId, feature.geometry.coordinates);
    }

    return {
      type: "FeatureCollection",
      features: rows
        .map(row => {
          const acc = sums.get(row.siteUuid);
          if (acc == null || acc.n === 0) return null;
          return {
            type: "Feature" as const,
            properties: {
              uuid: row.siteUuid,
              siteId: row.siteUuid,
              kind: "site",
              name: row.siteName ?? "Unnamed site",
              polygons: row.polygons,
              polygonsLabel: `${row.polygons.toLocaleString()} polygons`
            },
            geometry: { type: "Point" as const, coordinates: [acc.lng / acc.n, acc.lat / acc.n] }
          };
        })
        .filter(feature => feature != null)
    } as FeatureCollection;
  }, [projectGeo, rows]);

  const aggregate = useMemo(() => aggregateProject(rows), [rows]);

  const childEntries: ChildEntry[] = useMemo(
    () =>
      rows.map(row => ({
        id: row.siteUuid,
        name: row.siteName ?? "Unnamed site",
        polygons: row.polygons,
        inReviewCount: row.inReviewCount
      })),
    [rows]
  );

  const goToSite = (siteUuid: string) => router.push(`/site/${siteUuid}`);

  if (!rollupLoaded) {
    return <p className="p-4 text-sm text-theme-neutral-500">Loading project indicators…</p>;
  }

  return (
    <div className="flex w-full flex-col gap-3 ws-1100:h-[30rem] ws-1100:flex-row">
      <div className="relative min-h-[24rem] w-full flex-1 overflow-hidden rounded-lg">
        <DrilldownMap
          featureCollection={centroids}
          loading={!geoLoaded}
          onSelectPolygon={(uuid, siteId) => goToSite(typeof siteId === "string" ? siteId : uuid)}
        />
      </div>
      <div className="min-h-[24rem] w-full shrink-0 ws-1100:h-full ws-1100:w-[26rem]">
        <LevelCard
          aggregate={aggregate}
          title={projectName}
          subtitle={`${rows.length} ${rows.length === 1 ? "site" : "sites"}`}
          childEntries={childEntries}
          onSelectChild={goToSite}
        />
      </div>
    </div>
  );
};

export default ProjectDrilldownLaunchpad;
