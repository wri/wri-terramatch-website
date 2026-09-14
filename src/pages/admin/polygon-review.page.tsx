import { Text } from "@chakra-ui/react";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { ComponentProps, useEffect, useMemo } from "react";

import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullProject } from "@/connections/Entity";
import { useMyUser } from "@/connections/User";
import FrameworkProvider from "@/context/framework.provider";
import { MapAreaProvider } from "@/context/mapArea.provider";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import PolygonReviewHeader from "@/pages/admin/polygonReview/PolygonReviewHeader";
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
          // No project chosen yet — the header still renders so its (right-justified) picker is
          // available; each view supplies its own header once a project is selected.
          <PolygonReviewHeader>
            <Text textStyle="400" color="neutral.700">
              Select a project to review its polygons.
            </Text>
          </PolygonReviewHeader>
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
