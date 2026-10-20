import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

import PageContent from "@/components/extensive/PageElements/PageContent/PageContent";
import type { ProjectFullDto, ProjectNurseriesMetaDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { INDEX_SEARCH_DEBOUNCE_MS } from "@/hooks/useIndexViewState";
import NurseriesIndexBulkBar from "@/pages/nursery/components/NurseriesIndexBulkBar";
import NurseriesIndexHeader from "@/pages/nursery/components/NurseriesIndexHeader";
import NurseryProjectBody from "@/pages/nursery/components/NurseryProjectBody";
import NurseriesSelectionProvider, { useNurseriesSelectionActions } from "@/pages/nursery/NurseriesSelection.provider";
import { useNurseriesIndexData } from "@/pages/nursery/useNurseriesIndexData";
import { useNurseryProjectRows } from "@/pages/nursery/useNurseryProjectRows";
import NoResults from "@/redesignComponents/content/NoResults/NoResults";
import { LoadingIcon } from "@/redesignComponents/foundations/Icons";

type ProjectNurseriesTabProps = {
  project: ProjectFullDto;
};

const ProjectNurseriesBody: FC<{
  meta: ProjectNurseriesMetaDto;
  search: string;
  statuses: string[];
  updates: string[];
  isFiltered: boolean;
}> = ({ meta, search, statuses, updates, isFiltered }) => {
  const filters = useMemo(() => ({ search, statuses, updates }), [search, statuses, updates]);
  const nurseries = useNurseryProjectRows(meta, filters, true);
  return <NurseryProjectBody meta={meta} nurseries={nurseries} isFiltered={isFiltered} embeddedInProject />;
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
    const timeoutId = window.setTimeout(() => setDebouncedQuery(query.trim()), INDEX_SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timeoutId);
  }, [query]);

  const { metas, loading, error, nurseryTotal } = useNurseriesIndexData({
    search: debouncedQuery,
    statuses,
    updates,
    projectUuid: project.uuid,
    enabled: true,
    reloadNonce
  });
  const meta = metas[0];
  const hasActiveFilters = debouncedQuery !== "" || statuses.length > 0 || updates.length > 0;

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
        nurseryCount={nurseryTotal}
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
        ) : meta == null ? (
          <NoResults
            title={t("No nurseries found")}
            description={
              hasActiveFilters
                ? t("Try changing your search or filters.")
                : t("There are no nurseries available for this project view.")
            }
          />
        ) : (
          <ProjectNurseriesBody
            meta={meta}
            search={debouncedQuery}
            statuses={statuses}
            updates={updates}
            isFiltered={hasActiveFilters}
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
