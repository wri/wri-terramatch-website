import { useRouter } from "next/router";

import DrilldownMap from "@/components/semanticZoom/DrilldownMap";

import { SiteDrilldown } from "./useSiteDrilldown";

/**
 * The site map: this site's actual polygon shapes, each clickable. A click opens that polygon's
 * page, per the PRD's entity-page drill-down. The height is fixed by the caller so the Mapbox
 * canvas is bounded and cannot spill into the section below.
 */
const SiteMap = ({ drilldown, projectUuid }: { drilldown: SiteDrilldown; projectUuid: string }) => {
  const router = useRouter();
  const goToPolygon = (polygonUuid: string) => router.push(`/project/${projectUuid}/polygon/${polygonUuid}`);

  return (
    <DrilldownMap
      featureCollection={drilldown.featureCollection}
      loading={!drilldown.geoLoaded}
      onSelectPolygon={uuid => goToPolygon(uuid)}
    />
  );
};

export default SiteMap;
