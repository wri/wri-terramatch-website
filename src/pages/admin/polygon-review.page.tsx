import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { ComponentProps, useCallback, useEffect, useMemo } from "react";

import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullProject, useProjectIndex } from "@/connections/Entity";
import { useMyUser } from "@/connections/User";
import FrameworkProvider from "@/context/framework.provider";
import { MapAreaProvider } from "@/context/mapArea.provider";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { ArrowForwardIcon } from "@/redesignComponents/foundations/Icons";
import SelectInput from "@/redesignComponents/Forms/Inputs/SelectInput";
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

  const [projectsLoaded, { data: projects }] = useProjectIndex({ pageSize: 100 });
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

  const projectItems = useMemo(() => {
    return (projects ?? [])
      .map(item => ({
        label:
          item.organisationName != null
            ? `${item.name ?? item.uuid} — ${item.organisationName}`
            : item.name ?? item.uuid,
        value: item.uuid
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [projects]);

  const handleSelect = useCallback(
    (value: string[]) => {
      const uuid = value?.[0];
      const query = { ...router.query } as Record<string, string>;
      if (uuid != null && uuid !== "") query.project = uuid;
      else delete query.project;
      delete query.site; // a new project resets any site drill-in
      void router.push({ pathname: router.pathname, query }, undefined, { shallow: true });
    },
    [router]
  );

  if (!isUserLoaded || isAccessDenied) return null;

  return (
    <Layout navGroups={navGroups} navTitle="Management Panel">
      <Box className="flex w-full min-w-0 flex-col">
        <Box className="px-8 pb-4 pt-6">
          <Typography variant="h5" className="mb-4">
            Polygon Review
          </Typography>
          <Box className="max-w-md">
            <SelectInput
              label="Project"
              placeholder={projectsLoaded ? "Select a project..." : "Loading projects..."}
              items={projectItems}
              value={selectedProjectUuid != null ? [selectedProjectUuid] : []}
              onChange={handleSelect}
              disabled={!projectsLoaded}
            />
          </Box>
          {project != null && selectedProjectUuid != null && (
            <Box className="mt-4">
              <Typography variant="h6">{project.name ?? "Project"}</Typography>
              {project.organisationName != null && (
                <Typography variant="body2" color="text.secondary">
                  {project.organisationName}
                </Typography>
              )}
            </Box>
          )}
        </Box>

        {selectedProjectUuid == null ? (
          <Typography variant="body1" color="text.secondary" className="px-8 pb-8">
            Select a project to review its polygons.
          </Typography>
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
