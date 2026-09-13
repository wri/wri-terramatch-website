import { Box, Typography } from "@mui/material";
import type { FC } from "react";
import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullProject, useProjectIndex } from "@/connections/Entity";
import FrameworkProvider from "@/context/framework.provider";
import { MapAreaProvider } from "@/context/mapArea.provider";
import SelectInput from "@/redesignComponents/Forms/Inputs/SelectInput";
import ProjectPolygonsWorkspace from "@/pages/project/[uuid]/projectPolygonReview/ProjectPolygonsWorkspace";

import { useSearchParamsDrilldown } from "./useSearchParamsDrilldown";

/**
 * Admin "Polygon Review" page (react-admin custom route, /admin#/polygon-review).
 *
 * A project picker drives the existing project-level polygon review experience: selecting a project
 * renders a minimal project header + ProjectPolygonsWorkspace (flat list/map, per-site rollup, and
 * site drill-in) — without the green ProjectHeader banner and without the standalone shell.
 *
 * State lives in the URL (`?project=<uuid>`, `?site=<uuid>`) so the view is shareable and
 * refresh-safe; a project change clears any in-flight site drill-in.
 */
export const PolygonReviewPage: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedProjectUuid = searchParams.get("project") ?? undefined;

  // The admin's accessible projects (server-scoped, same set as the Projects list). pageSize 100 is
  // the index default; a searchable/paged picker is a follow-up if an admin exceeds that.
  const [projectsLoaded, { data: projects }] = useProjectIndex({ pageSize: 100 });

  // Only fetches when a project is selected (undefined id → no request).
  const [projectLoaded, { data: project }] = useFullProject({ id: selectedProjectUuid });

  // HashRouter-safe `?site=` drill-in state, injected into the workspace.
  const drilldown = useSearchParamsDrilldown();

  // Scope the react-admin content-column override (see custom-admin-page-styles.css) to this route
  // only, so the workspace can shrink to the viewport and render full-bleed here without affecting
  // other admin pages.
  useEffect(() => {
    document.body.classList.add("polygon-review-page");
    return () => document.body.classList.remove("polygon-review-page");
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
      const next = new URLSearchParams(searchParams);
      if (uuid != null && uuid !== "") {
        next.set("project", uuid);
      } else {
        next.delete("project");
      }
      next.delete("site"); // a new project resets any site drill-in
      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  return (
    <Box className="flex w-full min-w-0 flex-col">
      {/* Header / project picker region (the RA content padding is removed for this route). */}
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
                {project != null && (
                  <ProjectPolygonsWorkspace project={project} variant="adminReview" drilldown={drilldown} />
                )}
              </LoadingContainer>
            </FrameworkProvider>
          </MapAreaProvider>
        </Box>
      )}
    </Box>
  );
};
