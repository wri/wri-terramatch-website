import { useT } from "@transifex/react";
import { FC } from "react";

import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullSite } from "@/connections/Entity";
import PolygonReviewHeader from "@/pages/admin/polygonReview/PolygonReviewHeader";
import SitePolygonsWorkspace from "@/pages/site/[uuid]/sitePolygonReview/SitePolygonsWorkspace";
import InlineMessage from "@/redesignComponents/status/InlineMessage/InlineMessage";

export interface ProjectSiteDrilldownViewProps {
  siteUuid: string;
  /** The parent project's name — the first (clickable) breadcrumb crumb. */
  projectName: string;
  /** The parent project's uuid — builds the rollup href so crumbs are real, openable links. */
  projectUuid: string;
}

/**
 * The project polygon-review "rollup" mode's drilled-in view (plan §3.2/T6): renders the EXISTING
 * `SitePolygonsWorkspace` (`variant="adminReview"`) for the chosen site — the same canonical review
 * surface `/site/[uuid]/polygon-review` renders — with a small "All sites" back button above it. Zero
 * duplication: everything about reviewing a site's polygons (its own map, table, bulk actions, edit
 * drawer) is the site workspace's own, unmodified.
 *
 * This reads as an in-place, project-scoped review with the site's full toolset: the Add / Draw
 * Polygon / Upload entry points stay enabled (same as the standalone site review), and every FULL
 * review action (approve, request-information, run-validation, bulk edit details, the edit drawer)
 * stays enabled. `hideGeotaggedMedia` removes photo markers; this intentionally does not apply the
 * flat view's Phase-1 `registerPolygonReviewOnly`/geometry gate.
 */
const ProjectSiteDrilldownView: FC<ProjectSiteDrilldownViewProps> = ({ siteUuid, projectName, projectUuid }) => {
  const t = useT();
  const [isLoaded, { data: site, loadFailure }] = useFullSite({ id: siteUuid });

  return (
    <div className="flex w-full min-w-0 flex-1 flex-col">
      {/* TODO(site buckets): no site-level polygon status-counts component/hook exists yet; the header
          renders the breadcrumb + picker only. Add the buckets as children once such a component lands.
          The "Polygon Review › [project] › [site]" breadcrumb (and its in-page navigation) lives entirely
          in the shared header now. */}
      <PolygonReviewHeader
        projectName={projectName || undefined}
        projectUuid={projectUuid}
        siteName={site?.name ?? undefined}
      />
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
