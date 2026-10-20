import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import Head from "next/head";
import { FC, useCallback, useMemo, useState } from "react";

import IndexLoadingRow from "@/components/extensive/EntityIndex/IndexLoadingRow";
import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import { useIndexViewState } from "@/hooks/useIndexViewState";
import NoResults from "@/redesignComponents/content/NoResults/NoResults";
import ResponsiveTypography from "@/styles/ResponsiveTypography";

import NurseriesIndexBulkBar from "./components/NurseriesIndexBulkBar";
import NurseriesIndexHeader from "./components/NurseriesIndexHeader";
import NurseryProjectSection from "./components/NurseryProjectSection";
import NurseriesSelectionProvider, { useNurseriesSelectionActions } from "./NurseriesSelection.provider";
import { filterNurseryProjectSections } from "./nurseryIndex.utils";
import { useNurseriesIndexData } from "./useNurseriesIndexData";

const ALL_PROJECTS_VIEW_VALUE = "all-projects";

const NurseriesIndexContent: FC = () => {
  const t = useT();
  const { clearSelection } = useNurseriesSelectionActions();
  const [reloadNonce, setReloadNonce] = useState(0);
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

  const hasChildFilter = debouncedQuery !== "" || statuses.length > 0 || updates.length > 0;
  const { projects, sections, loading, hasMore, onProjectOpened, nurseryTotal, error, childrenPending } =
    useNurseriesIndexData(reloadNonce, {
      search: debouncedQuery,
      projectUuid: selectedProjectUuid,
      enabled: hasHydratedQuery,
      loadAllChildren: hasChildFilter
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
  // While a filter is applied, a project only appears once its nurseries have loaded and been matched.
  // Showing unloaded projects would make them vanish as soon as their nurseries arrive.
  const filteredSections = useMemo(
    () =>
      filterNurseryProjectSections(sections, "", undefined, statuses, updates).filter(
        section => !(hasChildFilter && section.nurseriesLoaded === false)
      ),
    [hasChildFilter, sections, statuses, updates]
  );
  const accordionOpenResetKey = `${viewValue}:${debouncedQuery}:${statuses.join(",")}:${updates.join(",")}`;
  const nurseryCount =
    statuses.length > 0 || updates.length > 0
      ? filteredSections.reduce((total, section) => total + section.nurseries.length, 0)
      : nurseryTotal;
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
        ) : filteredSections.length === 0 && !hasMore && !childrenPending ? (
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
            {filteredSections.map((section, index) => (
              <NurseryProjectSection
                key={`${viewValue}-${section.id}-${reloadNonce}`}
                section={section}
                query={debouncedQuery}
                statuses={statuses}
                updates={updates}
                isFiltered={hasFilters}
                defaultOpen={index === 0}
                openResetKey={accordionOpenResetKey}
                onProjectOpened={onProjectOpened}
              />
            ))}
            {hasMore || childrenPending ? <IndexLoadingRow label={t("Loading...")} /> : null}
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
