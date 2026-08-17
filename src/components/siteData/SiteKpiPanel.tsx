import { useRouter } from "next/router";

import LevelCard from "@/components/semanticZoom/LevelCard";

import { SiteDrilldown } from "./useSiteDrilldown";

/**
 * The site KPI panel: the six aggregated indicators for this site plus the list of polygons to
 * drill into. Sits below the Actions panel in the fixed row on the site Overview tab and scrolls
 * internally. Clicking a polygon opens its page — the same destination the map shapes reach, so
 * list drill and spatial drill land in the same place.
 */
const SiteKpiPanel = ({
  drilldown,
  siteName,
  projectUuid
}: {
  drilldown: SiteDrilldown;
  siteName: string;
  projectUuid: string;
}) => {
  const router = useRouter();
  const goToPolygon = (polygonUuid: string) => router.push(`/project/${projectUuid}/polygon/${polygonUuid}`);

  if (!drilldown.loaded) {
    return <p className="p-4 text-sm text-theme-neutral-500">Loading site indicators…</p>;
  }

  return (
    <LevelCard
      aggregate={drilldown.aggregate}
      title={siteName}
      subtitle={`${drilldown.polygonCount} ${drilldown.polygonCount === 1 ? "polygon" : "polygons"}`}
      childEntries={drilldown.childEntries}
      onSelectChild={goToPolygon}
    />
  );
};

export default SiteKpiPanel;
