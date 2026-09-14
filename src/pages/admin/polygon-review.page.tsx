import { Box } from "@mui/material";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { ComponentProps, useEffect, useMemo } from "react";

import PolygonReviewHeader, { POLYGON_REVIEW_PATH } from "@/admin/polygonReview/PolygonReviewHeader";
import ProjectPickerSelect from "@/admin/polygonReview/ProjectPickerSelect";
import Paper from "@/components/elements/Paper/Paper";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullProject, useFullSite } from "@/connections/Entity";
import { useMyUser } from "@/connections/User";
import FrameworkProvider from "@/context/framework.provider";
import { MapAreaProvider } from "@/context/mapArea.provider";
import ProjectPolygonsWorkspace from "@/pages/project/[uuid]/projectPolygonReview/ProjectPolygonsWorkspace";
import { ArrowForwardIcon } from "@/redesignComponents/foundations/Icons";
import Layout, { defaultAdminNavGroups } from "@/redesignComponents/Loayout/Layout";
import InlineMessage from "@/redesignComponents/status/InlineMessage/InlineMessage";

type NavGroups = ComponentProps<typeof Layout>["navGroups"];

/**
 * Admin "Polygon Review" — the New UX (redesign Layout) full-screen page, launched from the
 * react-admin left nav. It presents a project picker driving the existing project-level polygon
 * review (flat list/map, per-site rollup, site drill-in), with "Polygon Review" selected in the
 * blue side nav and a "Back to admin" link. State lives in the URL (`?project=`, `?site=`).
 *
 * The shared PolygonReviewHeader (breadcrumb + picker) is rendered ONCE here, above the workspace, so
 * it stays mounted while the workspace switches modes (including its brief "loading" null) or the user
 * switches projects. The site name for the deepest breadcrumb crumb is resolved from `?site=`.
 */
const AdminPolygonReviewPage = () => {
  const t = useT();
  const router = useRouter();
  const selectedProjectUuid = typeof router.query.project === "string" ? router.query.project : undefined;
  const selectedSiteUuid =
    typeof router.query.site === "string" && router.query.site !== "" ? router.query.site : undefined;

  const [isUserLoaded, { isAdmin }] = useMyUser();
  const isAccessDenied = isUserLoaded && !isAdmin;
  useEffect(() => {
    if (isAccessDenied) void router.replace("/admin");
  }, [isAccessDenied, router]);

  const [projectLoaded, { data: project, loadFailure }] = useFullProject({ id: selectedProjectUuid });
  // Cache-hit resolve of the drilled-in site's name for the breadcrumb's last crumb.
  const [, { data: site }] = useFullSite({ id: selectedSiteUuid });

  // Blue side nav: the shared admin-review placeholders, plus a "Back to admin" link and a
  // "Polygon Review" entry (inserted right after the "Sites" placeholder) whose href matches this
  // route so it renders selected. Placeholder links stay non-functional, per the design.
  const navGroups = useMemo<NavGroups>(() => {
    const [notifications, main] = defaultAdminNavGroups;
    const links = [...main.links];
    const sitesIndex = links.findIndex(link => link.label === "Sites");
    const insertAt = sitesIndex >= 0 ? sitesIndex + 1 : links.length;
    links.splice(insertAt, 0, {
      href: POLYGON_REVIEW_PATH,
      // The old-admin polygon (pentagon) mark; currentColor so it takes the nav's white/active tint.
      icon: <Icon name={IconNames.POLYGON} className="h-4 w-4" />,
      label: t("Polygon Review")
    });
    return [
      {
        links: [
          { href: "/admin", icon: <ArrowForwardIcon boxSize={4} className="rotate-180" />, label: t("Back to admin") }
        ]
      },
      notifications,
      { links }
    ];
  }, [t]);

  if (!isUserLoaded || isAccessDenied) return null;

  const projectUnavailable = projectLoaded && (project == null || loadFailure != null);

  return (
    <Layout navGroups={navGroups} collapsed={false}>
      <Box className="flex w-full min-w-0 flex-col">
        {selectedProjectUuid == null ? (
          // Starting screen: a centered card (TerraMatch EmptyState/Paper pattern) with the searchable
          // project picker as the primary action.
          <Box className="flex min-h-[60vh] flex-1 items-center justify-center p-8">
            <Paper className="w-full max-w-xl p-15 text-center">
              <Icon name={IconNames.POLYGON} width={80} className="m-auto mb-8 text-primary-500" />
              <Text variant="text-bold-headline-1000" className="mb-5 text-center">
                {t("Review project polygons")}
              </Text>
              <Text variant="text-light-body-300" className="m-auto mb-8 max-w-md text-center">
                {t("Select a project to review, validate, and approve its site polygons.")}
              </Text>
              <Box className="flex justify-center">
                <ProjectPickerSelect />
              </Box>
            </Paper>
          </Box>
        ) : (
          <Box className="flex w-full min-w-0 flex-1 flex-col">
            <PolygonReviewHeader
              projectName={project?.name ?? undefined}
              projectUuid={selectedProjectUuid}
              siteName={site?.name ?? undefined}
            />
            <Box className="w-full min-w-0 flex-1">
              {projectUnavailable ? (
                <Box className="p-6">
                  <InlineMessage
                    variant="error"
                    label={t("Unable to load this project")}
                    caption={t("We couldn't load this project's polygon review. Please pick another project or retry.")}
                  />
                </Box>
              ) : (
                <MapAreaProvider>
                  <FrameworkProvider frameworkKey={project?.frameworkKey}>
                    <LoadingContainer loading={!projectLoaded}>
                      {project != null && (
                        <ProjectPolygonsWorkspace key={project.uuid} project={project} variant="adminReview" />
                      )}
                    </LoadingContainer>
                  </FrameworkProvider>
                </MapAreaProvider>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default AdminPolygonReviewPage;
