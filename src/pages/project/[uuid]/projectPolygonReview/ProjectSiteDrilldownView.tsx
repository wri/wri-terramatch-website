import { useT } from "@transifex/react";
import { FC } from "react";

import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullSite } from "@/connections/Entity";
import SitePolygonsWorkspace from "@/pages/site/[uuid]/sitePolygonReview/SitePolygonsWorkspace";
import InlineMessage from "@/redesignComponents/status/InlineMessage/InlineMessage";

export interface ProjectSiteDrilldownViewProps {
  siteUuid: string;
}

/**
 * The project polygon-review "rollup" mode's drilled-in view (plan §3.2/T6): renders the EXISTING
 * `SitePolygonsWorkspace` (`variant="adminReview"`) for the chosen site — the same canonical review
 * surface `/site/[uuid]/polygon-review` renders. Zero duplication: everything about reviewing a site's
 * polygons (its own map, table, bulk actions, edit drawer) is the site workspace's own, unmodified.
 *
 * The "Polygon Review › [project] › [site]" breadcrumb (and its in-page navigation) lives entirely in
 * the shared header, which the admin polygon-review page renders once above the workspace.
 *
 * This reads as an in-place, project-scoped review with the site's full toolset: the Add / Draw
 * Polygon / Upload entry points stay enabled (same as the standalone site review), and every FULL
 * review action (approve, request-information, run-validation, bulk edit details, the edit drawer)
 * stays enabled. `hideGeotaggedMedia` removes photo markers; this intentionally does not apply the
 * flat view's Phase-1 `registerPolygonReviewOnly`/geometry gate.
 */
const ProjectSiteDrilldownView: FC<ProjectSiteDrilldownViewProps> = ({ siteUuid }) => {
  const t = useT();
  const [isLoaded, { data: site, loadFailure }] = useFullSite({ id: siteUuid });

  return (
    <div className="flex w-full min-w-0 flex-1 flex-col">
      {loadFailure != null ? (
        <div className="px-6 pb-6">
          <InlineMessage
            variant="error"
            label={t("Unable to load this site")}
            caption={t("Please go back and try again.")}
          />
        </div>
      ) : (
        <LoadingContainer wrapInPaper={false} loading={!isLoaded || site == null}>
          {site != null && (
            <SitePolygonsWorkspace
              key={site.uuid}
              site={site}
              variant="adminReview"
              hideGeotaggedMedia
              zoomToBboxOnEditClose
            />
          )}
        </LoadingContainer>
      )}
    </div>
  );
};

export default ProjectSiteDrilldownView;
