import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import type { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import NurseriesIndexBulkBar from "@/pages/nurserie/components/NurseriesIndexBulkBar";
import NurseriesIndexHeader from "@/pages/nurserie/components/NurseriesIndexHeader";
import NurseryProjectIndexBody from "@/pages/nurserie/components/NurseryProjectIndexBody";
import NurseriesSelectionProvider, { useNurseriesSelectionActions } from "@/pages/nurserie/NurseriesSelection.provider";
import { filterNurseryProjectSections } from "@/pages/nurserie/nurseryIndex.utils";
import { useNurseriesIndexData } from "@/pages/nurserie/useNurseriesIndexData";
import NoResults from "@/redesignComponents/content/NoResults/NoResults";
import { LoadingIcon } from "@/redesignComponents/foundations/Icons";

const SEARCH_DEBOUNCE_MS = 300;

type ProjectNurseriesTabProps = {
  project: ProjectFullDto;
};

const ProjectNurseriesTabContent: FC<ProjectNurseriesTabProps> = ({ project }) => {
  const t = useT();
  const [reloadNonce, setReloadNonce] = useState(0);
  const { clearSelection } = useNurseriesSelectionActions();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [statuses, setStatuses] = useState<string[]>([]);
  const [updates, setUpdates] = useState<string[]>([]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedQuery(query.trim()), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timeoutId);
  }, [query]);

  const { sections, loading, onProjectOpened, nurseryTotal, error } = useNurseriesIndexData(reloadNonce, {
    search: debouncedQuery,
    projectUuid: project.uuid,
    enabled: true
  });

  const filteredSections = useMemo(
    () => filterNurseryProjectSections(sections, debouncedQuery, project.uuid, statuses, updates),
    [debouncedQuery, project.uuid, sections, statuses, updates]
  );
  const section = filteredSections[0];
  const hasAppliedFilters = statuses.length > 0 || updates.length > 0;
  const hasActiveSearch = query.trim().length > 0;
  const hasActiveFilters = hasActiveSearch || hasAppliedFilters;
  const nurseryCount = hasActiveFilters && section != null ? section.nurseries.length : nurseryTotal;
  const showEmptyProject =
    section == null || (section.nurseriesLoaded !== false && section.nurseries.length === 0 && !hasActiveFilters);

  const addNurseryHref =
    project.frameworkKey == null
      ? undefined
      : `/entity/nurseries/create/${project.frameworkKey}?parent_name=projects&parent_uuid=${project.uuid}`;

  const handleNurseriesChanged = useCallback(() => setReloadNonce(current => current + 1), []);

  const handleApplyFilters = useCallback(
    (nextStatuses: string[], nextUpdates: string[]) => {
      clearSelection();
      setStatuses(nextStatuses);
      setUpdates(nextUpdates);
    },
    [clearSelection]
  );

  return (
    <div className="flex w-full min-w-0 flex-1 flex-col">
      <NurseriesIndexHeader
        embeddedInProject
        nurseryCount={nurseryCount}
        viewValue={project.uuid}
        viewItems={[]}
        statuses={statuses}
        updates={updates}
        addNurseryHref={addNurseryHref}
        onApplyFilters={handleApplyFilters}
        onViewChange={() => undefined}
        onQueryChange={setQuery}
      />
      <PageContent className={twMerge("h-auto flex-1 bg-theme-neutral-100 px-2 pt-0 pb-8")}>
        {loading ? (
          <Flex minHeight="15rem" alignItems="center" justifyContent="center" gap={3}>
            <LoadingIcon boxSize={6} className="animate-spin" color="primary.700" />
            <Text textStyle="400" color="neutral.800">
              {t("Loading nurseries...")}
            </Text>
          </Flex>
        ) : error ? (
          <NoResults
            title={t("Nurseries could not be loaded")}
            description={t("Please refresh the page and try again.")}
          />
        ) : showEmptyProject ? (
          <NoResults
            title={t("No nurseries found")}
            description={
              hasActiveFilters
                ? t("Try changing your search or filters.")
                : t("There are no nurseries available for this project view.")
            }
          />
        ) : (
          <NurseryProjectIndexBody
            section={section}
            project={project}
            query={debouncedQuery}
            statuses={statuses}
            updates={updates}
            isFiltered={hasActiveFilters}
            onProjectOpened={onProjectOpened}
          />
        )}
        <NurseriesIndexBulkBar onNurseriesChanged={handleNurseriesChanged} />
      </PageContent>
    </div>
  );
};

const ProjectNurseriesTab: FC<ProjectNurseriesTabProps> = ({ project }) => (
  <NurseriesSelectionProvider>
    <ProjectNurseriesTabContent project={project} />
  </NurseriesSelectionProvider>
);

export default ProjectNurseriesTab;
