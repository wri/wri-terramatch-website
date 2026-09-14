import { Box, Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC, forwardRef, MouseEvent, ReactNode, useMemo } from "react";

import Breadcrumb from "@/redesignComponents/navigation/Breadcrumbs/Breadcrumb";
import {
  DESKTOP_MAX_LABEL_LENGTH,
  truncateBreadcrumbLabel
} from "@/redesignComponents/navigation/Breadcrumbs/breadcrumbLabel";

import ProjectPickerSelect from "./ProjectPickerSelect";

export const POLYGON_REVIEW_PATH = "/admin/polygon-review";

export interface PolygonReviewHeaderProps {
  /** The current project's name — adds a "[project]" crumb after "Polygon Review". */
  projectName?: string;
  /** The current project's uuid — builds the project crumb's rollup href. */
  projectUuid?: string;
  /** The current site's name — adds a (final, non-clickable) "[site]" crumb. */
  siteName?: string;
  /** Bottom row: the status-buckets tiles / prompt shown beneath the breadcrumb + picker. */
  children?: ReactNode;
}

// linkRouter adapter for the shared Breadcrumb (WriBreadcrumb renders each non-final crumb through it,
// passing `to`/`href`; the final crumb is a non-clickable <p>). A plain left-click routes in-place to
// that crumb's own link via a shallow push (pathname is constant, only the query changes); modified
// clicks fall through to the href so "open in new tab" still works. Defined at module scope (it calls
// useRouter itself) so it is a stable component type, not re-created on every header render.
const CrumbLink = forwardRef<
  HTMLAnchorElement,
  { to?: string; href?: string; className?: string; children: ReactNode }
>(function CrumbLink({ to, href, className, children }, ref) {
  const router = useRouter();
  const target = to ?? href;
  return (
    <a
      ref={ref}
      href={target}
      className={className}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey) return;
        event.preventDefault();
        if (target != null) void router.push(target, undefined, { shallow: true });
      }}
    >
      {children}
    </a>
  );
});

/**
 * PolygonReviewHeader — the cohesive top panel shared by every polygon-review view (empty state, flat
 * list, site rollup, site drill-in). Rendered ONCE by the admin polygon-review page above the workspace,
 * so it stays mounted across mode changes and project switches. Two rows on a neutral/white panel
 * consistent with the surrounding PageContent:
 *   • Top row: a breadcrumb (LEFT) reflecting the current depth — "Polygon Review" › [project] › [site],
 *     each crumb conditional on props — and the searchable project picker (RIGHT).
 *   • Bottom row: the caller's status tiles / prompt (`children`), sitting BELOW the picker.
 *
 * The whole review is URL-driven (`?project=`, `?site=`), so each breadcrumb crumb navigates to its own
 * link via a shallow Next `router.push` on a plain left-click (staying in-page, just changing the query),
 * while modified / middle clicks fall through to the real href so "open in new tab" still works. The
 * Breadcrumb renders the LAST crumb as non-clickable automatically. Thus: empty state → "Polygon Review";
 * project level → "Polygon Review › [project]"; drill-in → "Polygon Review › [project] › [site]".
 */
const PolygonReviewHeader: FC<PolygonReviewHeaderProps> = ({ projectName, projectUuid, siteName, children }) => {
  const t = useT();

  const links = useMemo(() => {
    const projectHref = `${POLYGON_REVIEW_PATH}?project=${projectUuid}`;
    // Labels are truncated at the string level (the product-wide convention, see breadcrumbLabel /
    // ResponsiveBreadcrumbToolbar) so a long project or site name keeps the breadcrumb on one line
    // instead of wrapping the single-line design-system Breadcrumb.
    const crumbs: { label: string; link: string }[] = [{ label: t("Polygon Review"), link: POLYGON_REVIEW_PATH }];
    if (projectName != null) {
      crumbs.push({ label: truncateBreadcrumbLabel(projectName, DESKTOP_MAX_LABEL_LENGTH), link: projectHref });
    }
    // The site crumb is always last, so it is rendered non-clickable; its link is unused but required.
    if (siteName != null) {
      crumbs.push({ label: truncateBreadcrumbLabel(siteName, DESKTOP_MAX_LABEL_LENGTH), link: projectHref });
    }
    return crumbs;
  }, [projectName, projectUuid, siteName, t]);

  return (
    <Box as="header" bg="white" borderBottomWidth="1px" borderColor="neutral.200" paddingX={6} paddingY={4}>
      <Flex align="flex-start" justify="space-between" gap={4}>
        <Box minW={0} flex="1 1 auto">
          <Breadcrumb linkRouter={CrumbLink} links={links} />
        </Box>
        <Box flexShrink={0}>
          <ProjectPickerSelect />
        </Box>
      </Flex>
      {children != null && <Box mt={4}>{children}</Box>}
    </Box>
  );
};

export default PolygonReviewHeader;
