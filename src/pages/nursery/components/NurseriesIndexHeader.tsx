import { Box, Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { useRouter } from "next/router";
import { FC, useCallback, useMemo, useRef, useState } from "react";

import { useEntityFuzzySearch } from "@/connections/EntityFuzzySearch";
import { getStatusOptions, getUpdateStatusFilterOptions } from "@/constants/options/status";
import { useDebounce } from "@/hooks/useDebounce";
import { useIsMobile } from "@/hooks/useIsMobile";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import PageHeader from "@/redesignComponents/content/headers/PageHeaders/PageHeader";
import HighLevelSelector from "@/redesignComponents/Forms/Inputs/HighLevelSelector/HighLevelSelector";
import type { HighLevelSelectorItem } from "@/redesignComponents/Forms/Inputs/HighLevelSelector/HighLevelSelector.types";
import { NurseryIcon, PlusIcon } from "@/redesignComponents/foundations/Icons";
import type { ListItemProps, SelectedFilter } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";
import ToolbarObject from "@/redesignComponents/navigation/Toolbar/ToolbarObject";
import ToolbarTable from "@/redesignComponents/navigation/Toolbar/ToolbarTable/ToolbarTable";

import NurseriesFilterDrawer from "./NurseriesFilterDrawer";

type NurseriesIndexHeaderProps = {
  nurseryCount: number;
  viewValue: string;
  viewItems: HighLevelSelectorItem[];
  statuses: string[];
  updates: string[];
  addNurseryHref?: string;
  onApplyFilters: (statuses: string[], updates: string[]) => void;
  onViewChange: (value: string) => void;
  onQueryChange: (query: string) => void;
  embeddedInProject?: boolean;
  showViewSelector?: boolean;
};

const ALL_PROJECTS_VIEW = "all-projects";

const NurseriesIndexHeader: FC<NurseriesIndexHeaderProps> = ({
  nurseryCount,
  viewValue,
  viewItems,
  statuses,
  updates,
  addNurseryHref,
  onApplyFilters,
  onViewChange,
  onQueryChange,
  embeddedInProject = false,
  showViewSelector = true
}) => {
  const t = useT();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const statusOptions = useMemo(() => getStatusOptions(t), [t]);
  const updateOptions = useMemo(() => getUpdateStatusFilterOptions(t), [t]);

  // Suggestions are offered only where the search covers every nursery the page lists.
  const suggestionsEnabled = !embeddedInProject && viewValue === ALL_PROJECTS_VIEW;
  const [suggestionQuery, setSuggestionQuery] = useState("");
  const debouncedSetSuggestionQuery = useDebounce(setSuggestionQuery);
  const [, { data: suggestionResults }] = useEntityFuzzySearch({
    entity: "nurseries",
    search: suggestionQuery,
    enabled: suggestionsEnabled
  });
  const suggestionOptions = useMemo<ListItemProps[]>(
    () => (suggestionResults ?? []).flatMap(({ uuid, name }) => (name == null ? [] : [{ id: uuid, label: name }])),
    [suggestionResults]
  );

  // The search clears its input right after a pick, which reports an empty query. That query is only an echo of
  // the pick, so it must not undo the filter the pick applied.
  const ignoreClearAfterPickRef = useRef(false);
  const handleSearchQueryChange = useCallback(
    (query: string) => {
      if (query === "" && ignoreClearAfterPickRef.current) {
        ignoreClearAfterPickRef.current = false;
        return;
      }
      ignoreClearAfterPickRef.current = false;
      if (!suggestionsEnabled || query.trim() === "") onQueryChange(query);
      if (suggestionsEnabled) debouncedSetSuggestionQuery(query);
    },
    [onQueryChange, debouncedSetSuggestionQuery, suggestionsEnabled]
  );
  const handleSuggestionSelect = useCallback(
    (option: ListItemProps) => {
      ignoreClearAfterPickRef.current = true;
      onQueryChange(option.label);
    },
    [onQueryChange]
  );
  const activeFilterLabels = useMemo<SelectedFilter[]>(
    () => [
      ...(statuses.length === 0
        ? []
        : [
            {
              category: t("Status"),
              label: statuses.map(status => statusOptions.find(option => option.value === status)?.title ?? status),
              onRemove: () => onApplyFilters([], updates)
            }
          ]),
      ...(updates.length === 0
        ? []
        : [
            {
              category: t("Updates"),
              label: updates.map(update => updateOptions.find(option => option.value === update)?.title ?? update),
              onRemove: () => onApplyFilters(statuses, [])
            }
          ])
    ],
    [onApplyFilters, statusOptions, statuses, t, updateOptions, updates]
  );

  const addNurseryButton = {
    children: t("Add Nursery"),
    leftIcon: <PlusIcon boxSize="0.625rem" />,
    disabled: addNurseryHref == null,
    className: "shrink-0 whitespace-nowrap",
    onClick: () => {
      if (addNurseryHref != null) void router.push(addNurseryHref);
    }
  };

  const viewSelector = showViewSelector ? (
    <HighLevelSelector
      label={t("View:")}
      items={viewItems}
      value={viewValue}
      emptyMessage={t("No projects found")}
      width="25rem"
      className="mobile:!w-full"
      onChange={onViewChange}
    />
  ) : null;

  const toolbar = (
    <ToolbarTable
      className={classNames(
        "!px-6 !pb-6 !pt-5",
        embeddedInProject
          ? "sticky top-[5.5625rem] z-10 border-b border-theme-neutral-300 !bg-theme-neutral-100 mobile:top-[7.8125rem]"
          : "!bg-theme-neutral-200"
      )}
      classNameContentLeft={embeddedInProject ? "min-w-0 flex-1 !shrink" : "w-full"}
      classNameContentSearch="w-[19rem] max-w-full mobile:w-auto mobile:min-w-0 mobile:flex-1"
      search={{
        placeholder: t("Search"),
        options: suggestionsEnabled ? suggestionOptions : [],
        displayResults: suggestionsEnabled ? "text" : "none",
        count: nurseryCount,
        label: nurseryCount === 1 ? t("Nursery") : t("Nurseries"),
        onSelect: handleSuggestionSelect,
        onQueryChange: handleSearchQueryChange
      }}
      selectedFilters={activeFilterLabels}
      showClearFilters={activeFilterLabels.length > 0}
      onClickFilterButton={() => setIsFilterDrawerOpen(true)}
      onClearFilters={() => onApplyFilters([], [])}
      button={embeddedInProject ? addNurseryButton : undefined}
    />
  );

  return (
    <>
      {embeddedInProject ? (
        toolbar
      ) : (
        <>
          <ToolbarObject
            className="sticky top-0 z-20 !px-6"
            breadcrumbs={{
              linkRouter: router,
              links: [
                {
                  icon: <NurseryIcon />,
                  label: t("Nurseries"),
                  link: "/nursery"
                }
              ]
            }}
          />
          <Box className="sticky top-11 z-10">
            <PageHeader
              className=" !bg-theme-neutral-100 !pb-0 !pt-1"
              title={t("Nurseries")}
              actions={
                isMobile ? (
                  <Button size="small" {...addNurseryButton} />
                ) : (
                  <Flex gap={4} alignItems="center">
                    {viewSelector}
                    <Button size="small" {...addNurseryButton} />
                  </Flex>
                )
              }
            />
            {isMobile && viewSelector != null && <Box className="bg-theme-neutral-100 px-6 pt-4">{viewSelector}</Box>}
            {toolbar}
          </Box>
        </>
      )}
      <NurseriesFilterDrawer
        open={isFilterDrawerOpen}
        statuses={statuses}
        updates={updates}
        onApplyFilters={onApplyFilters}
        onOpenChange={setIsFilterDrawerOpen}
      />
    </>
  );
};

export default NurseriesIndexHeader;
