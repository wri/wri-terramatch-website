import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useEffect, useState } from "react";

import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Drawer from "@/redesignComponents/containers/Drawer/Drawer";
import FilterPanel from "@/redesignComponents/containers/FilterPanel/FilterPanel";
import FilterCard from "@/redesignComponents/containers/FilterPanel/FilterPanelElements/FilteCards";
import Checkbox from "@/redesignComponents/Forms/Actions/Checkbox/Checkbox";
import SelectInput from "@/redesignComponents/Forms/Inputs/SelectInput";

import type { SiteIndexStatus, SiteIndexUpdate } from "./siteIndexMockData";

export type SiteIndexFilterStatus = Extract<
  SiteIndexStatus,
  "draft" | "pending-approval" | "information-required" | "not-started" | "approved"
>;

export const SITE_INDEX_STATUS_OPTIONS: { label: string; value: SiteIndexFilterStatus }[] = [
  { label: "Draft", value: "draft" },
  { label: "Pending Approval", value: "pending-approval" },
  { label: "Information Required", value: "information-required" },
  { label: "Not Started", value: "not-started" },
  { label: "Approved", value: "approved" }
];

export type SiteIndexFilterUpdate = SiteIndexUpdate;

export const SITE_INDEX_UPDATE_OPTIONS: { label: string; value: SiteIndexFilterUpdate }[] = [
  { label: "Draft", value: "draft" },
  { label: "Pending Approval", value: "pending-approval" },
  { label: "Information Required", value: "information-required" },
  { label: "Complete", value: "complete" }
];

type CheckboxChange = { checked?: boolean | "indeterminate" };

interface SiteIndexFilterDrawerProps {
  open: boolean;
  filters: SiteIndexFilterStatus[];
  updateFilter: SiteIndexFilterUpdate | null;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: SiteIndexFilterStatus[], updateFilter: SiteIndexFilterUpdate | null) => void;
  onClearFilters: () => void;
}

const SiteIndexFilterDrawer: FC<SiteIndexFilterDrawerProps> = ({
  open,
  filters,
  updateFilter,
  onOpenChange,
  onApplyFilters,
  onClearFilters
}) => {
  const t = useT();
  const [draftFilters, setDraftFilters] = useState<SiteIndexFilterStatus[]>(filters);
  const [draftUpdateFilter, setDraftUpdateFilter] = useState<SiteIndexFilterUpdate | null>(updateFilter);

  useEffect(() => {
    if (open) {
      setDraftFilters(filters);
      setDraftUpdateFilter(updateFilter);
    }
  }, [filters, open, updateFilter]);

  const handleStatusChange = (status: SiteIndexFilterStatus, { checked }: CheckboxChange) => {
    setDraftFilters(current =>
      checked === true
        ? current.includes(status)
          ? current
          : [...current, status]
        : current.filter(currentStatus => currentStatus !== status)
    );
  };

  return (
    <Drawer
      trapFocus={false}
      open={open}
      onOpenChange={onOpenChange}
      size="filterPanel"
      placement="end"
      maxW="22.75rem"
      paddingTop={0}
      paddingLeft={0}
      maxH="100vh"
    >
      {({ onClose }) => (
        <FilterPanel
          title={t("Filters")}
          variant="fixed"
          onClose={onClose}
          className="h-screen max-h-screen shadow-[0_10px_7.5px_rgba(0,0,0,0.1),0_4px_3px_rgba(0,0,0,0.1)]"
          content={
            <Flex className="h-full flex-col gap-4 overflow-auto px-4 pt-4 pb-20">
              <FilterCard label={t("Status")}>
                <Flex className="flex-col gap-4">
                  {SITE_INDEX_STATUS_OPTIONS.map(option => (
                    <Checkbox
                      key={option.value}
                      name={`site-status-${option.value}`}
                      value={option.value}
                      checked={draftFilters.includes(option.value)}
                      onCheckedChange={(change: CheckboxChange) => handleStatusChange(option.value, change)}
                    >
                      {t(option.label)}
                    </Checkbox>
                  ))}
                </Flex>
              </FilterCard>
              <FilterCard label={t("Updates")}>
                <SelectInput
                  placeholder={t("Please select")}
                  value={draftUpdateFilter == null ? [] : [draftUpdateFilter]}
                  items={SITE_INDEX_UPDATE_OPTIONS.map(option => ({
                    label: t(option.label),
                    value: option.value
                  }))}
                  onChange={(values: string[]) =>
                    setDraftUpdateFilter((values[0] as SiteIndexFilterUpdate | undefined) ?? null)
                  }
                />
              </FilterCard>
            </Flex>
          }
          footer={
            <ButtonGroup
              buttons={[
                {
                  id: "clear-all",
                  children: t("Clear all"),
                  variant: "secondary",
                  onClick: () => {
                    setDraftFilters([]);
                    setDraftUpdateFilter(null);
                    onClearFilters();
                    onClose();
                  }
                },
                {
                  id: "apply",
                  children: t("Apply"),
                  variant: "primary",
                  onClick: () => {
                    onApplyFilters(draftFilters, draftUpdateFilter);
                    onClose();
                  }
                }
              ]}
            />
          }
        />
      )}
    </Drawer>
  );
};

export default SiteIndexFilterDrawer;
