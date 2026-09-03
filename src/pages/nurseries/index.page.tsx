import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import Head from "next/head";
import { useCallback, useMemo, useState } from "react";

import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { LoadingIcon } from "@/redesignComponents/foundations/Icons";
import ResponsiveTypography from "@/styles/ResponsiveTypography";

import NurseriesIndexBulkBar from "./components/NurseriesIndexBulkBar";
import NurseriesIndexHeader from "./components/NurseriesIndexHeader";
import NurseryProjectSection from "./components/NurseryProjectSection";
import NurseriesSelectionProvider, { useNurseriesSelectionActions } from "./NurseriesSelection.provider";
import { filterNurseryProjectSections } from "./nurseryIndex.utils";
import { useNurseriesIndexData } from "./useNurseriesIndexData";

const ALL_PROJECTS_VIEW_VALUE = "all-projects";

const NurseriesIndexContent = () => {
  const t = useT();
  const { projects, sections, loading, error } = useNurseriesIndexData();
  const { clearSelection } = useNurseriesSelectionActions();
  const [query, setQuery] = useState("");
  const [viewValue, setViewValue] = useState(ALL_PROJECTS_VIEW_VALUE);
  const [statuses, setStatuses] = useState<string[]>([]);

  const viewItems = useMemo(
    () => [
      { label: t("All Projects"), value: ALL_PROJECTS_VIEW_VALUE },
      ...projects
        .map(project => ({ label: project.name ?? t("Project"), value: project.uuid }))
        .sort((a, b) => a.label.localeCompare(b.label))
    ],
    [projects, t]
  );

  const selectedProject = useMemo(() => projects.find(project => project.uuid === viewValue), [projects, viewValue]);
  const filteredSections = useMemo(
    () =>
      filterNurseryProjectSections(
        sections,
        query,
        viewValue === ALL_PROJECTS_VIEW_VALUE ? undefined : viewValue,
        statuses
      ),
    [query, sections, statuses, viewValue]
  );
  const nurseryCount = useMemo(
    () => filteredSections.reduce((total, section) => total + section.nurseries.length, 0),
    [filteredSections]
  );
  const addNurseryHref =
    selectedProject?.frameworkKey == null
      ? undefined
      : `/entity/nurseries/create/${selectedProject.frameworkKey}?parent_name=projects&parent_uuid=${selectedProject.uuid}`;
  const handleViewChange = useCallback(
    (value: string) => {
      clearSelection();
      setViewValue(value);
    },
    [clearSelection]
  );

  return (
    <>
      <NurseriesIndexHeader
        nurseryCount={nurseryCount}
        viewValue={viewValue}
        viewItems={viewItems}
        statuses={statuses}
        addNurseryHref={addNurseryHref}
        onApplyStatuses={setStatuses}
        onViewChange={handleViewChange}
        onQueryChange={setQuery}
      />
      <PageContent className="px-2 py-0">
        {loading ? (
          <Flex minHeight="15rem" alignItems="center" justifyContent="center" gap={3}>
            <LoadingIcon boxSize={6} className="animate-spin" color="primary.700" />
            <Text textStyle="400" color="neutral.800">
              {t("Loading nurseries...")}
            </Text>
          </Flex>
        ) : error ? (
          <Box background="neutral.100" h="full" p={4}>
            <Text textStyle="400-bold">{t("Nurseries could not be loaded")}</Text>
            <Text textStyle="400">{t("Please refresh the page and try again.")}</Text>
          </Box>
        ) : filteredSections.length === 0 ? (
          <Box background="neutral.100" h="full" p={4}>
            <Text textStyle="400-bold">{t("No nurseries found")}</Text>
            <Text textStyle="400">
              {query.trim() === "" && statuses.length === 0
                ? t("There are no nurseries available for this project view.")
                : t("Try changing your search or filters.")}
            </Text>
          </Box>
        ) : (
          <div className="space-y-4">
            {filteredSections.map((section, index) => (
              <NurseryProjectSection
                key={`${viewValue}-${section.id}`}
                section={section}
                defaultOpen={viewValue !== ALL_PROJECTS_VIEW_VALUE && index === 0}
              />
            ))}
          </div>
        )}
        <NurseriesIndexBulkBar />
      </PageContent>
    </>
  );
};

const NurseriesIndexPage = () => {
  const t = useT();

  return (
    <NurseriesSelectionProvider>
      <ResponsiveTypography />
      <Head>
        <title>{t("Nurseries")}</title>
      </Head>
      <NurseriesIndexContent />
    </NurseriesSelectionProvider>
  );
};

export default NurseriesIndexPage;
