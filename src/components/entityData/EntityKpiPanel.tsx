import { useRouter } from "next/router";

import LevelCard from "@/components/semanticZoom/LevelCard";

import { childHref, childNoun } from "./entityLevel";
import { EntityDrilldown } from "./useEntityDrilldown";

/**
 * The entity KPI panel: the aggregated indicators for a project or a site, plus the list of children
 * to drill into. Clicking a child in the list lands where a click on the map does — the two are the
 * same descent by different routes.
 */
const EntityKpiPanel = ({
  drilldown,
  title,
  projectUuid
}: {
  drilldown: EntityDrilldown;
  title: string;
  projectUuid: string;
}) => {
  const router = useRouter();

  if (!drilldown.loaded) {
    return <p className="p-4 text-sm text-theme-neutral-500">Loading indicators…</p>;
  }

  return (
    <LevelCard
      aggregate={drilldown.aggregate}
      title={title}
      subtitle={`${drilldown.childCount} ${
        drilldown.childCount === 1 ? childNoun(drilldown.level).slice(0, -1) : childNoun(drilldown.level)
      }`}
      childEntries={drilldown.childEntries}
      onSelectChild={childUuid => router.push(childHref(drilldown.level, projectUuid, childUuid))}
    />
  );
};

export default EntityKpiPanel;
