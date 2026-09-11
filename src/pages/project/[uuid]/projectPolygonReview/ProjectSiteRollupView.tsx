import { useT } from "@transifex/react";
import { FC, useMemo } from "react";

import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { SITE_POLYGON_MAP_INITIAL_HEIGHT_UNITS } from "@/pages/site/[uuid]/constants/sitePolygonMapSizing";
import ResizeBox from "@/redesignComponents/containers/ResizableSplitView/ResizableBox";
import { DownloadIcon } from "@/redesignComponents/foundations/Icons";
import InlineMessage from "@/redesignComponents/status/InlineMessage/InlineMessage";

import ProjectSiteRollupSummary from "./ProjectSiteRollupSummary";
import ProjectSiteRollupTable from "./ProjectSiteRollupTable";
import { buildSiteCentroidFeatureCollection } from "./siteCentroidFeatureCollection";
import SiteRollupMap from "./SiteRollupMap";
import { useDownloadProjectPolygons } from "./useDownloadProjectPolygons";
import { SiteReviewRollupRow } from "./useProjectSiteRollup";

export interface ProjectSiteRollupViewProps {
  project: ProjectFullDto;
  rows: SiteReviewRollupRow[];
  loaded: boolean;
  error: unknown;
  onSelectSite: (siteUuid: string) => void;
}

/**
 * The project polygon-review "rollup" mode landing page (plan §3.2/T6): a read-only project totals
 * strip, a site-centroid map, and the per-site rollup table. No polygons are loaded at this level —
 * that is the entire point of rollup mode above PROJECT_SITE_ROLLUP_THRESHOLD active polygons.
 */
const ProjectSiteRollupView: FC<ProjectSiteRollupViewProps> = ({ project, rows, loaded, error, onSelectSite }) => {
  const t = useT();
  const { isDownloading: isDownloadingAll, download: handleDownloadAll } = useDownloadProjectPolygons(project);

  // Total active polygons across the project — drives only the Download-All disabled state; the
  // visible summary is site-focused (see ProjectSiteRollupSummary).
  const totalPolygons = useMemo(() => rows.reduce((sum, row) => sum + row.activeTotal, 0), [rows]);

  const featureCollection = useMemo(() => buildSiteCentroidFeatureCollection(rows), [rows]);

  return (
    <PageContent className="bg-theme-neutral-100">
      <PageItem
        title={t("Sites")}
        className="scroll-mt-[5.5rem]"
        flexProps={{ width: "100%" }}
        downloadButtonProps={{
          variant: "secondary",
          size: "small",
          children: t("Download All"),
          leftIcon: <DownloadIcon />,
          loading: isDownloadingAll,
          // Server-side full-project export — stays enabled while the rollup is still loading, only
          // disabled once we know for certain the project has no polygons.
          disabled: isDownloadingAll || (loaded && totalPolygons === 0),
          onClick: () => {
            void handleDownloadAll();
          }
        }}
      />

      {error != null ? (
        <InlineMessage
          variant="error"
          label={t("Unable to load the site rollup")}
          caption={t("We couldn't load the per-site polygon summary for this project. Please retry.")}
        />
      ) : (
        <>
          <ProjectSiteRollupSummary rows={rows} isLoading={!loaded} />

          <ResizeBox
            initialHeight={SITE_POLYGON_MAP_INITIAL_HEIGHT_UNITS}
            minHeight={SITE_POLYGON_MAP_INITIAL_HEIGHT_UNITS}
            maxHeight={600}
          >
            <SiteRollupMap featureCollection={featureCollection} onSelectSite={onSelectSite} loading={!loaded} />
          </ResizeBox>

          <ProjectSiteRollupTable rows={rows} loading={!loaded} onSelectSite={onSelectSite} />
        </>
      )}
    </PageContent>
  );
};

export default ProjectSiteRollupView;
