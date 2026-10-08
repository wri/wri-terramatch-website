import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC, useMemo, useState } from "react";

import { getChangeRequestStatusOptions, getStatusOptions } from "@/constants/options/status";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import PageHeader from "@/redesignComponents/content/headers/PageHeaders/PageHeader";
import HighLevelSelector from "@/redesignComponents/Forms/Inputs/HighLevelSelector/HighLevelSelector";
import type { HighLevelSelectorItem } from "@/redesignComponents/Forms/Inputs/HighLevelSelector/HighLevelSelector.types";
import { NurseryIcon, PlusIcon } from "@/redesignComponents/foundations/Icons";
import type { SelectedFilter } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";
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
};

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
  embeddedInProject = false
}) => {
  const t = useT();
  const router = useRouter();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const statusOptions = useMemo(() => getStatusOptions(t), [t]);
  const updateOptions = useMemo(
    () =>
      getChangeRequestStatusOptions(t).map(option =>
        option.value === "approved" ? { ...option, title: t("Complete") } : option
      ),
    [t]
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
    className: embeddedInProject ? "shrink-0 whitespace-nowrap" : undefined,
    onClick: () => {
      if (addNurseryHref != null) void router.push(addNurseryHref);
    }
  };

  return (
    <>
      {embeddedInProject ? null : (
        <>
          <ToolbarObject
            className="sticky top-0 z-20 !px-6"
            breadcrumbs={{
              linkRouter: router,
              links: [
                {
                  icon: <NurseryIcon />,
                  label: t("Nurseries"),
                  link: "/nurserie"
                }
              ]
            }}
          />
          <PageHeader
            className=" !bg-theme-neutral-100 !pb-0 !pt-1 mobile:flex-col mobile:items-start mobile:gap-4"
            title={t("Nurseries")}
            actions={
              <Flex gap={4} alignItems="center">
                <HighLevelSelector
                  key={`${viewValue}:${viewItems.find(item => item.value === viewValue)?.label ?? ""}`}
                  autocomplete
                  label={t("View:")}
                  items={viewItems}
                  value={viewValue}
                  emptyMessage={t("No projects found")}
                  width="25rem"
                  className="mobile:!w-full"
                  onChange={onViewChange}
                />
                <Button size="small" {...addNurseryButton} />
              </Flex>
            }
          />
        </>
      )}
      <ToolbarTable
        className="!bg-theme-neutral-200 !px-6 !pb-6 !pt-5"
        classNameContentLeft={embeddedInProject ? "min-w-0 flex-1 !shrink" : "w-full"}
        classNameContentSearch="w-[19rem] max-w-full"
        search={{
          placeholder: t("Search nurseries"),
          options: [],
          displayResults: "none",
          count: nurseryCount,
          label: nurseryCount === 1 ? t("Nursery") : t("Nurseries"),
          onQueryChange
        }}
        selectedFilters={activeFilterLabels}
        showClearFilters={activeFilterLabels.length > 0}
        onClickFilterButton={() => setIsFilterDrawerOpen(true)}
        onClearFilters={() => onApplyFilters([], [])}
        button={embeddedInProject ? addNurseryButton : undefined}
      />
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
