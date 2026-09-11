import { useT } from "@transifex/react";
import { FC } from "react";

import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullSite } from "@/connections/Entity";
import SitePolygonsWorkspace from "@/pages/site/[uuid]/sitePolygonReview/SitePolygonsWorkspace";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import InlineMessage from "@/redesignComponents/status/InlineMessage/InlineMessage";

export interface ProjectSiteDrilldownViewProps {
  siteUuid: string;
  onBack: () => void;
}

/**
 * The project polygon-review "rollup" mode's drilled-in view (plan §3.2/T6): renders the EXISTING
 * `SitePolygonsWorkspace` (`variant="adminReview"`) for the chosen site — the same canonical review
 * surface `/site/[uuid]/polygon-review` renders — with a small "All sites" back button above it. Zero
 * duplication: everything about reviewing a site's polygons (its own map, table, bulk actions, edit
 * drawer) is the site workspace's own, unmodified.
 *
 * Product wants this to read as an in-place, project-scoped filtered review rather than the
 * standalone site editor: `hideCreateActions` removes the Add/Draw/Upload entry points and
 * `hideGeotaggedMedia` removes photo markers, while every FULL review action (approve,
 * request-information, run-validation, bulk edit details, the edit drawer) stays enabled — this
 * intentionally does not apply the flat view's Phase-1 `registerPolygonReviewOnly`/geometry gate.
 */
const ProjectSiteDrilldownView: FC<ProjectSiteDrilldownViewProps> = ({ siteUuid, onBack }) => {
  const t = useT();
  const [isLoaded, { data: site, loadFailure }] = useFullSite({ id: siteUuid });

  return (
    <div className="flex w-full min-w-0 flex-1 flex-col">
      <div className="px-6 pt-4">
        <Button variant="borderless" size="small" className="underline underline-offset-2" onClick={onBack}>
          {`← ${t("All sites")}`}
        </Button>
      </div>
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
              hideCreateActions
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
