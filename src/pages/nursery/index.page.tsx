import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import Head from "next/head";
import { FC, useCallback, useMemo, useState } from "react";

import IndexLoadingRow from "@/components/extensive/EntityIndex/IndexLoadingRow";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { useIndexViewState } from "@/hooks/useIndexViewState";
import { InfiniteScrollSentinel } from "@/hooks/useInfiniteScrollSentinel";
import NoResults from "@/redesignComponents/content/NoResults/NoResults";
import ResponsiveTypography from "@/styles/ResponsiveTypography";

import NurseriesIndexBulkBar from "./components/NurseriesIndexBulkBar";
import NurseriesIndexHeader from "./components/NurseriesIndexHeader";
import NurseryProjectSection from "./components/NurseryProjectSection";
import NurseriesSelectionProvider, { useNurseriesSelectionActions } from "./NurseriesSelection.provider";
import { useNurseriesIndexData } from "./useNurseriesIndexData";

const ALL_PROJECTS_VIEW_VALUE = "all-projects";

const NurseriesIndexContent: FC = () => {
  const t = useT();
  const { clearSelection } = useNurseriesSelectionActions();
  const [reloadNonce, setReloadNonce] = useState(0);
  const [viewMenuOpened, setViewMenuOpened] = useState(false);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [updates, setUpdates] = useState<string[]>([]);
  const {
    view: viewValue,
    query,
    setQuery,
    debouncedQuery,
    hasHydratedQuery,
    handleViewChange
  } = useIndexViewState({
    basePath: "/nursery",
    allProjectsValue: ALL_PROJECTS_VIEW_VALUE,
    onViewChange: clearSelection
  });
  const handleNurseriesChanged = useCallback(() => setReloadNonce(current => current + 1), []);
  const selectedProjectUuid = viewValue === ALL_PROJECTS_VIEW_VALUE ? undefined : viewValue;

  const { metas, projects, loading, error, nurseryTotal, hasMore, loadingMore, loadMore } = useNurseriesIndexData({
    search: debouncedQuery,
    statuses,
    updates,
    projectUuid: selectedProjectUuid,
    enabled: hasHydratedQuery,
    catalogRequested: viewMenuOpened,
    reloadNonce
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
  const hasFilters = query.trim() !== "" || statuses.length > 0 || updates.length > 0;
  const accordionOpenResetKey = `${viewValue}:${debouncedQuery}:${statuses.join(",")}:${updates.join(",")}`;
  const sectionFilters = useMemo(
    () => ({ search: debouncedQuery, statuses, updates }),
    [debouncedQuery, statuses, updates]
  );
  const nurseryCount = nurseryTotal;
  const addNurseryHref =
    selectedProject?.frameworkKey == null
      ? undefined
      : `/entity/nurseries/create/${selectedProject.frameworkKey}?parent_name=projects&parent_uuid=${selectedProject.uuid}`;

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
        onViewOpenChange={open => open && setViewMenuOpened(true)}
        onQueryChange={setQuery}
      />
      <PageContent className="h-auto flex-1 px-2 py-0">
        {loading ? (
          <IndexLoadingRow label={t("Loading nurseries...")} minHeight="15rem" />
        ) : error ? (
          <NoResults
            title={t("Nurseries could not be loaded")}
            description={t("Please refresh the page and try again.")}
          />
        ) : metas.length === 0 && !hasMore ? (
          <NoResults
            title={t("No nurseries found")}
            description={
              hasFilters
                ? t("Try changing your search or filters.")
                : t("There are no nurseries available for this project view.")
            }
          />
        ) : (
          <Flex gap={4} flexDirection="column">
            {metas.map((meta, index) => (
              <NurseryProjectSection
                key={`${viewValue}-${meta.uuid}`}
                meta={meta}
                filters={sectionFilters}
                isFiltered={hasFilters}
                defaultOpen={index === 0}
                openResetKey={accordionOpenResetKey}
              />
            ))}
            <InfiniteScrollSentinel
              hasMore={hasMore}
              loading={loading}
              loadingMore={loadingMore}
              label={t("Loading...")}
              resetKey={metas.length}
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
