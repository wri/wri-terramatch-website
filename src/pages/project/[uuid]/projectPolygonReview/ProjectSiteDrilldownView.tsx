import { useT } from "@transifex/react";
import { FC, forwardRef, MouseEvent, ReactNode, useMemo } from "react";

import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullSite } from "@/connections/Entity";
import PolygonReviewHeader from "@/pages/admin/polygonReview/PolygonReviewHeader";
import SitePolygonsWorkspace from "@/pages/site/[uuid]/sitePolygonReview/SitePolygonsWorkspace";
import Breadcrumb from "@/redesignComponents/navigation/Breadcrumbs/Breadcrumb";
import InlineMessage from "@/redesignComponents/status/InlineMessage/InlineMessage";

export interface ProjectSiteDrilldownViewProps {
  siteUuid: string;
  /** The parent project's name — the first (clickable) breadcrumb crumb. */
  projectName: string;
  /** The parent project's uuid — builds the rollup href so crumbs are real, openable links. */
  projectUuid: string;
  onBack: () => void;
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
const ProjectSiteDrilldownView: FC<ProjectSiteDrilldownViewProps> = ({ siteUuid, projectName, projectUuid, onBack }) => {
  const t = useT();
  const [isLoaded, { data: site, loadFailure }] = useFullSite({ id: siteUuid });

  // The rollup (site-list) URL — the drill-in without `?site=`. Used as the real href on the
  // clickable crumbs so they open/middle-click like normal links, while a plain click routes
  // in-place via `onBack` (a shallow push that just drops `?site=`).
  const rollupHref = `/admin/polygon-review?project=${projectUuid}`;

  // linkRouter adapter for the shared Breadcrumb (WriBreadcrumb renders each non-final crumb through
  // it, passing `to`/`href`; the final crumb is a non-clickable <p>). A plain left-click stays
  // in-place via onBack; modified clicks fall through to the href so "open in new tab" still works.
  const CrumbLink = useMemo(
    () =>
      forwardRef<HTMLAnchorElement, { to?: string; href?: string; className?: string; children: ReactNode }>(
        function CrumbLink({ to, href, className, children }, ref) {
          return (
            <a
              ref={ref}
              href={to ?? href}
              className={className}
              onClick={(event: MouseEvent<HTMLAnchorElement>) => {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
                event.preventDefault();
                onBack();
              }}
            >
              {children}
            </a>
          );
        }
      ),
    [onBack]
  );

  return (
    <div className="flex w-full min-w-0 flex-1 flex-col">
      {/* TODO(site buckets): no site-level polygon status-counts component/hook exists yet; render
          the breadcrumb + picker only. Add the buckets here once such a component lands. */}
      <PolygonReviewHeader>
        {/* `[Project] › Sites › [Site]`: the project crumb and "Sites" both return to the rollup;
            the site name is the non-clickable last crumb (so no separate site-name heading — it
            would duplicate that crumb). */}
        <Breadcrumb
          linkRouter={CrumbLink}
          links={[
            { label: projectName || t("Project"), link: rollupHref },
            { label: t("Sites"), link: rollupHref },
            { label: site?.name ?? t("Site"), link: `${rollupHref}&site=${siteUuid}` }
          ]}
        />
      </PolygonReviewHeader>
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
