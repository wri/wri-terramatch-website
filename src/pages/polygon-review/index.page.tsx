import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { useProjectMapIndex } from "@/connections/ProjectMapIndex";
import { useMyUser } from "@/connections/User";
import { MapAreaProvider } from "@/context/mapArea.provider";
import PageHeader from "@/redesignComponents/content/headers/PageHeaders/PageHeader";
import Table from "@/redesignComponents/dataDisplay/Table/Table";
import Layout from "@/redesignComponents/Layout/Layout";

import { buildPolygonTableColumns } from "../site/[uuid]/components/polygonTableColumns";
import PolygonReviewEmptyState from "./components/PolygonReviewEmptyState";
import PolygonReviewMap from "./components/PolygonReviewMap";
import PolygonReviewToolbar from "./components/PolygonReviewToolbar";
import ProjectContextPicker from "./components/ProjectContextPicker";
import {
  EMPTY_PROJECT_CONTEXT_FILTERS,
  filterProjects,
  ProjectContextFilters,
  sortProjectsByName
} from "./utils/projectContextFilter";

/**
 * Polygon Review index. No polygon data loads until a project is picked in the Level 1 project context filter;
 * clearing that filter returns the page to its initial (unscoped) state.
 */
const PolygonReviewIndexPage: FC = () => {
  const t = useT();
  const router = useRouter();
  const [isUserLoaded, { isAdmin }] = useMyUser();
  const [, { data: mapIndex, loadFailure }] = useProjectMapIndex({ enabled: isAdmin });

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [filters, setFilters] = useState<ProjectContextFilters>(EMPTY_PROJECT_CONTEXT_FILTERS);
  const [selectedProjectUuid, setSelectedProjectUuid] = useState<string | null>(null);

  const columns = useMemo(() => buildPolygonTableColumns(t, { showEntityColumns: true }), [t]);

  const projects = useMemo(() => sortProjectsByName(mapIndex?.projects ?? []), [mapIndex]);
  const filteredProjects = useMemo(() => filterProjects(projects, filters), [filters, projects]);
  const selectedProject = useMemo(
    () => projects.find(({ uuid }) => uuid === selectedProjectUuid) ?? null,
    [projects, selectedProjectUuid]
  );
  const mapProjects = useMemo(
    () => (selectedProject != null ? [selectedProject] : filteredProjects),
    [filteredProjects, selectedProject]
  );

  const openPicker = useCallback(() => setIsPickerOpen(true), []);

  const selectProject = useCallback((uuid: string) => {
    setSelectedProjectUuid(uuid);
    setIsPickerOpen(false);
  }, []);

  const clearProjectContext = useCallback(() => {
    setFilters(EMPTY_PROJECT_CONTEXT_FILTERS);
    setSelectedProjectUuid(null);
  }, []);

  const isAccessDenied = isUserLoaded && !isAdmin;
  useEffect(() => {
    if (isAccessDenied) {
      void router.replace("/");
    }
  }, [isAccessDenied, router]);

  if (!isUserLoaded || isAccessDenied) return null;

  return (
    <Layout>
      <PageHeader
        title={t("Polygon Review")}
        actions={
          <ProjectContextPicker
            open={isPickerOpen}
            projects={projects}
            filteredProjects={filteredProjects}
            filters={filters}
            selectedProject={selectedProject}
            onOpenChange={setIsPickerOpen}
            onFiltersChange={setFilters}
            onSelectProject={selectProject}
            onClear={clearProjectContext}
          />
        }
      />
      <MapAreaProvider>
        <PageContent className="bg-theme-neutral-100">
          <Flex direction="column" gap={4}>
            <PolygonReviewToolbar isProjectSelected={selectedProject != null} />
            <PolygonReviewMap projects={mapProjects} hasLoadFailure={loadFailure != null} />
            <Flex
              direction="column"
              borderWidth="1px"
              borderColor="neutral.300"
              borderRadius="0.25rem"
              bg="neutral.100"
            >
              <Table data={[]} columns={columns} selectable showPagination={false} />
              {selectedProject == null && <PolygonReviewEmptyState onSelectProject={openPicker} />}
            </Flex>
          </Flex>
        </PageContent>
      </MapAreaProvider>
    </Layout>
  );
};

export default PolygonReviewIndexPage;
