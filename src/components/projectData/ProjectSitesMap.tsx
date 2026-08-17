import { useRouter } from "next/router";

import DrilldownMap from "@/components/semanticZoom/DrilldownMap";

import { ProjectDrilldown } from "./useProjectDrilldown";

/**
 * The project map: one clickable centroid per site. A click — on a dot — opens that site's page,
 * per the PRD's entity-page drill-down. The height is fixed by the caller so the map cannot spill
 * into whatever sits below it.
 */
const ProjectSitesMap = ({ drilldown }: { drilldown: ProjectDrilldown }) => {
  const router = useRouter();
  const goToSite = (siteUuid: string) => router.push(`/site/${siteUuid}`);

  return (
    <DrilldownMap
      featureCollection={drilldown.centroids}
      loading={!drilldown.geoLoaded}
      onSelectPolygon={(uuid, siteId) => goToSite(typeof siteId === "string" ? siteId : uuid)}
    />
  );
};

export default ProjectSitesMap;
