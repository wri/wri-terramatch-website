import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

import { getStatusOptions } from "@/constants/options/status";
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
  addNurseryHref?: string;
  onApplyStatuses: (statuses: string[]) => void;
  onViewChange: (value: string) => void;
  onQueryChange: (query: string) => void;
};

const NurseriesIndexHeader = ({
  nurseryCount,
  viewValue,
  viewItems,
  statuses,
  addNurseryHref,
  onApplyStatuses,
  onViewChange,
  onQueryChange
}: NurseriesIndexHeaderProps) => {
  const t = useT();
  const router = useRouter();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const statusOptions = useMemo(() => getStatusOptions(t), [t]);
  const activeFilterLabels = useMemo<SelectedFilter[]>(
    () =>
      statuses.length === 0
        ? []
        : [
            {
              category: t("Status"),
              label: statuses.map(status => statusOptions.find(option => option.value === status)?.title ?? status),
              onRemove: () => onApplyStatuses([])
            }
          ],
    [onApplyStatuses, statusOptions, statuses, t]
  );

  return (
    <>
      <ToolbarObject
        className="sticky top-0 z-20 !px-6"
        breadcrumbs={{
          linkRouter: router,
          links: [
            {
              icon: <NurseryIcon />,
              label: t("Nurseries"),
              link: "/nurseries"
            }
          ]
        }}
      />
      <PageHeader
        className="!bg-theme-neutral-100 !px-6"
        title={t("Nurseries")}
        actions={
          <Flex gap={4} alignItems="center">
            <HighLevelSelector
              autocomplete
              label={t("View:")}
              items={viewItems}
              value={viewValue}
              emptyMessage={t("No projects found")}
              width="25rem"
              className="mobile:!w-full"
              onChange={onViewChange}
            />
            <Button
              size="small"
              leftIcon={<PlusIcon boxSize="0.625rem" />}
              disabled={addNurseryHref == null}
              onClick={() => {
                if (addNurseryHref != null) void router.push(addNurseryHref);
              }}
            >
              {t("Add Nursery")}
            </Button>
          </Flex>
        }
      />
      <ToolbarTable
        className="!bg-theme-neutral-200 !px-6 !pb-6 !pt-5"
        classNameContentLeft="w-full"
        classNameContentSearch="w-[19rem]"
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
        onClearFilters={() => onApplyStatuses([])}
      />
      <NurseriesFilterDrawer
        open={isFilterDrawerOpen}
        statuses={statuses}
        onApplyStatuses={onApplyStatuses}
        onOpenChange={setIsFilterDrawerOpen}
      />
    </>
  );
};

export default NurseriesIndexHeader;
