import { useRouter } from "next/router";

import LevelCard from "@/components/semanticZoom/LevelCard";

import { ProjectDrilldown } from "./useProjectDrilldown";

/**
 * The project KPI panel: the six aggregated indicators plus the list of sites to drill into.
 *
 * Sits full-width below the map+actions row on the Overview tab. Clicking a site in the list opens
 * its page, the same destination the map centroids reach — list drill and spatial drill land in the
 * same place.
 */
const ProjectKpiPanel = ({ drilldown, projectName }: { drilldown: ProjectDrilldown; projectName: string }) => {
  const router = useRouter();
  const goToSite = (siteUuid: string) => router.push(`/site/${siteUuid}`);

  if (!drilldown.loaded) {
    return <p className="p-4 text-sm text-theme-neutral-500">Loading project indicators…</p>;
  }

  return (
    <LevelCard
      aggregate={drilldown.aggregate}
      title={projectName}
      subtitle={`${drilldown.siteCount} ${drilldown.siteCount === 1 ? "site" : "sites"}`}
      childEntries={drilldown.childEntries}
      onSelectChild={goToSite}
    />
  );
};

export default ProjectKpiPanel;
