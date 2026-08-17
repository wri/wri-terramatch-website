import { useRouter } from "next/router";

import DrilldownMap from "@/components/semanticZoom/DrilldownMap";

import { childHref } from "./entityLevel";
import { EntityDrilldown } from "./useEntityDrilldown";

/**
 * The entity map: site centroids on a project, polygon shapes on a site. A click descends one level —
 * to a site's page from the project, to a polygon's page from a site — via the shared childHref.
 * The map's fixed height is imposed by the surrounding EntityDataView, so its canvas cannot spill.
 */
const EntityMap = ({ drilldown, projectUuid }: { drilldown: EntityDrilldown; projectUuid: string }) => {
  const router = useRouter();

  return (
    <DrilldownMap
      featureCollection={drilldown.mapFeatures}
      loading={!drilldown.geoLoaded}
      onSelectPolygon={(uuid, siteId) => {
        // At project level the clicked feature is a site centroid (uuid === siteId); at site level
        // it is a polygon (uuid). Either way the child id is what childHref routes on.
        const childUuid = drilldown.level === "project" ? (typeof siteId === "string" ? siteId : uuid) : uuid;
        router.push(childHref(drilldown.level, projectUuid, childUuid));
      }}
    />
  );
};

export default EntityMap;
