import PolygonDataTable from "@/components/entityData/PolygonDataTable";
import { useProjectAnomalies } from "@/components/projectData/anomalies/useProjectAnomalies";
import { useAllSitePolygons } from "@/connections/SitePolygons";

/**
 * The site Details-and-Data polygon table: this site's polygons, with the merged anomaly flag,
 * filter/search, and bulk/inline editing.
 *
 * It is a thin scope wrapper over the shared `PolygonDataTable` — a site has no sub-sites level, so
 * no Sites|Polygons toggle and no Site column. The anomaly engine runs at project scope (it needs
 * the whole project to do its work); called without a ProjectFullDto the project-goal watchlist
 * checks stay silent, which is correct here, while geometry-validation and polygon checks still
 * light up per row.
 */
export interface SiteDataTableProps {
  siteUuid: string;
  projectUuid: string;
}

const SiteDataTable = ({ siteUuid, projectUuid }: SiteDataTableProps) => {
  const { data: sitePolygons, isLoading } = useAllSitePolygons({
    entityName: "sites",
    entityUuid: siteUuid,
    enabled: siteUuid != null && siteUuid !== ""
  });

  const { countsByEntity } = useProjectAnomalies(projectUuid);

  const polygons = sitePolygons ?? [];

  return (
    <PolygonDataTable
      polygons={polygons}
      countsByEntity={countsByEntity}
      projectUuid={projectUuid}
      loading={isLoading}
      emptyLabel="This site has no polygons yet."
      toolbarLeading={
        <span className="text-xs font-medium text-theme-neutral-500">
          Polygons ({polygons.length.toLocaleString()})
        </span>
      }
    />
  );
};

export default SiteDataTable;
