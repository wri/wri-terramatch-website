import { Text } from "@chakra-ui/react";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { ComponentProps, useEffect, useMemo } from "react";

import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import Paper from "@/components/elements/Paper/Paper";
import { useFullProject } from "@/connections/Entity";
import { useMyUser } from "@/connections/User";
import FrameworkProvider from "@/context/framework.provider";
import { MapAreaProvider } from "@/context/mapArea.provider";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import ProjectPickerSelect from "@/pages/admin/polygonReview/ProjectPickerSelect";
import { ArrowForwardIcon } from "@/redesignComponents/foundations/Icons";
import Layout, { defaultAdminNavGroups } from "@/redesignComponents/Loayout/Layout";
import ProjectPolygonsWorkspace from "@/pages/project/[uuid]/projectPolygonReview/ProjectPolygonsWorkspace";

const POLYGON_REVIEW_PATH = "/admin/polygon-review";

type NavGroups = ComponentProps<typeof Layout>["navGroups"];

/**
 * Admin "Polygon Review" — the New UX (redesign Layout) full-screen page, launched from the
 * react-admin left nav. It presents a project picker driving the existing project-level polygon
 * review (flat list/map, per-site rollup, site drill-in), with "Polygon Review" selected in the
 * blue side nav and a "Back to admin" link. State lives in the URL (`?project=`, `?site=`).
 */
const AdminPolygonReviewPage = () => {
  const router = useRouter();
  const selectedProjectUuid = typeof router.query.project === "string" ? router.query.project : undefined;

  const [isUserLoaded, { isAdmin }] = useMyUser();
  const isAccessDenied = isUserLoaded && !isAdmin;
  useEffect(() => {
    if (isAccessDenied) void router.replace("/admin");
  }, [isAccessDenied, router]);

  const [projectLoaded, { data: project }] = useFullProject({ id: selectedProjectUuid });

  // Blue side nav: the shared admin-review placeholders, plus a "Back to admin" link and a
  // "Polygon Review" entry (inserted after Sites) whose href matches this route so it renders
  // selected. Placeholder links stay non-functional, per the design.
  const navGroups = useMemo<NavGroups>(() => {
    const [notifications, main] = defaultAdminNavGroups;
    return [
      { links: [{ href: "/admin", icon: <ArrowForwardIcon boxSize={4} className="rotate-180" />, label: "Back to admin" }] },
      notifications,
      {
        links: [
          ...main.links.slice(0, 5), // Dashboard, Organizations, Programmes, Projects, Sites
          {
            href: POLYGON_REVIEW_PATH,
            // The old-admin polygon (pentagon) mark; currentColor so it takes the nav's white/active tint.
            icon: <Icon name={IconNames.POLYGON} className="h-4 w-4" />,
            label: "Polygon Review"
          },
          ...main.links.slice(5) // Nurseries, Reports, Users
        ]
      }
    ];
  }, []);

  if (!isUserLoaded || isAccessDenied) return null;

  return (
    <Layout navGroups={navGroups} navTitle="Management Panel" collapsed={false}>
      <Box className="flex w-full min-w-0 flex-col">
        {selectedProjectUuid == null ? (
          // Starting screen: a centered card (TerraMatch EmptyState/Paper pattern) with the searchable
          // project picker as the primary action.
          <Box className="flex min-h-[60vh] flex-1 items-center justify-center p-8">
            <Paper className="w-full max-w-xl p-15 text-center">
              <Icon name={IconNames.POLYGON} width={72} className="m-auto mb-6 text-primary-500" />
              <Text textStyle="800-bold" color="primary.900" className="mb-2">
                Review project polygons
              </Text>
              <Text textStyle="400" color="neutral.700" className="mx-auto mb-8 max-w-md">
                Select a project to review, validate, and approve its site polygons.
              </Text>
              <Box className="mx-auto max-w-sm text-left">
                <ProjectPickerSelect />
              </Box>
            </Paper>
          </Box>
        ) : (
          <Box className="w-full min-w-0 flex-1">
            <MapAreaProvider>
              <FrameworkProvider frameworkKey={project?.frameworkKey}>
                <LoadingContainer loading={!projectLoaded}>
                  {project != null && <ProjectPolygonsWorkspace project={project} variant="adminReview" />}
                </LoadingContainer>
              </FrameworkProvider>
            </MapAreaProvider>
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default AdminPolygonReviewPage;
