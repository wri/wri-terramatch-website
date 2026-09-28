import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { InfiniteScrollSentinel } from "@/hooks/useInfiniteScrollSentinel";
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

const NurseriesIndexContent: FC = () => {
  const t = useT();
  const router = useRouter();
  const [reloadNonce, setReloadNonce] = useState(0);
  const { clearSelection } = useNurseriesSelectionActions();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [viewValue, setViewValue] = useState(ALL_PROJECTS_VIEW_VALUE);
  const [hasHydratedQuery, setHasHydratedQuery] = useState(false);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [updates, setUpdates] = useState<string[]>([]);
  const handleNurseriesChanged = useCallback(() => setReloadNonce(current => current + 1), []);
  const selectedProjectUuid = viewValue === ALL_PROJECTS_VIEW_VALUE ? undefined : viewValue;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedQuery(query), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    if (!router.isReady) return;
    const projectFromQuery = router.query.project;
    if (typeof projectFromQuery === "string" && projectFromQuery !== "") {
      setViewValue(projectFromQuery);
    }
    setHasHydratedQuery(true);
  }, [router.isReady, router.query.project]);

  const { projects, sections, loading, loadingMore, hasMore, loadMore, onProjectOpened, nurseryTotal, error } =
    useNurseriesIndexData(reloadNonce, {
      search: debouncedQuery,
      projectUuid: selectedProjectUuid,
      enabled: hasHydratedQuery
    });

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
      if (value === ALL_PROJECTS_VIEW_VALUE) {
        void router.replace("/nurseries", undefined, { shallow: true });
        return;
      }
      void router.replace(`/nurseries?project=${value}`, undefined, { shallow: true });
    },
    [clearSelection, router]
  );
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
                onProjectOpened={onProjectOpened}
              />
            ))}
            <InfiniteScrollSentinel
              hasMore={hasMore}
              loading={loading}
              loadingMore={loadingMore}
              label={t("Loading...")}
              resetKey={filteredSections.length}
              onLoadMore={loadMore}
            />
          </Flex>
        )}
        <NurseriesIndexBulkBar onNurseriesChanged={handleNurseriesChanged} />
      </PageContent>
    </>
  );
};

const NurseriesIndexPage: FC = () => {
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
