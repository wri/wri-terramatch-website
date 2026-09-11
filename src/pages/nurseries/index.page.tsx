import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import Head from "next/head";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
const SEARCH_DEBOUNCE_MS = 300;

const NurseriesIndexContent = () => {
  const t = useT();
  const [reloadNonce, setReloadNonce] = useState(0);
  const { clearSelection } = useNurseriesSelectionActions();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [viewValue, setViewValue] = useState(ALL_PROJECTS_VIEW_VALUE);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [updates, setUpdates] = useState<string[]>([]);
  const handleNurseriesChanged = useCallback(() => setReloadNonce(current => current + 1), []);
  const selectedProjectUuid = viewValue === ALL_PROJECTS_VIEW_VALUE ? undefined : viewValue;
  const statusFilter = statuses.length === 1 ? statuses[0] : undefined;
  const updateRequestStatusFilter = updates.length === 1 ? updates[0] : undefined;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedQuery(query), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timeoutId);
  }, [query]);

  const { projects, sections, loading, loadingMore, hasMore, loadMore, nurseryTotal, error } = useNurseriesIndexData(
    reloadNonce,
    {
      search: debouncedQuery,
      projectUuid: selectedProjectUuid,
      status: statusFilter,
      updateRequestStatus: updateRequestStatusFilter
    }
  );

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
    () => filterNurseryProjectSections(sections, "", undefined, statuses, updates),
    [sections, statuses, updates]
  );
  const accordionOpenResetKey = `${viewValue}:${debouncedQuery.trim()}:${statuses.join(",")}:${updates.join(",")}`;
  const nurseryCount =
    statuses.length > 0 || updates.length > 0
      ? filteredSections.reduce((total, section) => total + section.nurseries.length, 0)
      : nurseryTotal;
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
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (node == null || !hasMore || loading || loadingMore) return;

    const observer = new IntersectionObserver(
      entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        void loadMore();
      },
      { rootMargin: "200px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [filteredSections.length, hasMore, loadMore, loading, loadingMore]);

  const handleApplyFilters = useCallback(
    (nextStatuses: string[], nextUpdates: string[]) => {
      clearSelection();
      setStatuses(nextStatuses);
      setUpdates(nextUpdates);
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
        updates={updates}
        addNurseryHref={addNurseryHref}
        onApplyFilters={handleApplyFilters}
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
              {query.trim() === "" && statuses.length === 0 && updates.length === 0
                ? t("There are no nurseries available for this project view.")
                : t("Try changing your search or filters.")}
            </Text>
          </Box>
        ) : (
          <Flex gap={4} flexDirection="column">
            {filteredSections.map((section, index) => (
              <NurseryProjectSection
                key={`${viewValue}-${section.id}-${reloadNonce}`}
                section={section}
                query={debouncedQuery}
                statuses={statuses}
                updates={updates}
                isFiltered={query.trim() !== "" || statuses.length > 0 || updates.length > 0}
                defaultOpen={index === 0}
                openResetKey={accordionOpenResetKey}
              />
            ))}
            {hasMore ? (
              <Flex ref={sentinelRef} minHeight="4rem" alignItems="center" justifyContent="center" gap={3}>
                {loadingMore ? (
                  <>
                    <LoadingIcon boxSize={5} className="animate-spin" color="primary.700" />
                    <Text textStyle="400" color="neutral.800">
                      {t("Loading more nurseries...")}
                    </Text>
                  </>
                ) : null}
              </Flex>
            ) : null}
          </Flex>
        )}
        <NurseriesIndexBulkBar onNurseriesChanged={handleNurseriesChanged} />
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
