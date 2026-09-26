import { useT } from "@transifex/react";
import { FC, useEffect, useMemo, useState } from "react";

import FilterCard from "@/redesignComponents/containers/FilterPanel/FilterPanelElements/FilterCards";
import IndexFilterDrawer from "@/redesignComponents/containers/FilterPanel/IndexFilterDrawer";
import Checkbox from "@/redesignComponents/Forms/Actions/Checkbox/Checkbox";
import SelectInput from "@/redesignComponents/Forms/Inputs/SelectInput";

import type { SiteIndexStatus, SiteIndexUpdate } from "./siteIndex.types";

export type SiteIndexFilterStatus = Extract<
  SiteIndexStatus,
  "draft" | "pending-approval" | "information-required" | "approved"
>;

export const SITE_INDEX_STATUS_OPTIONS: { label: string; value: SiteIndexFilterStatus }[] = [
  { label: "Draft", value: "draft" },
  { label: "Pending Approval", value: "pending-approval" },
  { label: "Information Required", value: "information-required" },
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
}

const SiteIndexFilterDrawer: FC<SiteIndexFilterDrawerProps> = ({
  open,
  filters,
  updateFilter,
  onOpenChange,
  onApplyFilters
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

  const activeFilterTags = useMemo(() => {
    const tags: { id: string; label: string }[] = [];

    draftFilters.forEach(status => {
      const option = SITE_INDEX_STATUS_OPTIONS.find(item => item.value === status);
      tags.push({ id: `status-${status}`, label: t(option?.label ?? status) });
    });

    if (draftUpdateFilter != null) {
      const option = SITE_INDEX_UPDATE_OPTIONS.find(item => item.value === draftUpdateFilter);
      tags.push({ id: "update", label: t(option?.label ?? draftUpdateFilter) });
    }

    return tags;
  }, [draftFilters, draftUpdateFilter, t]);

  const handleStatusChange = (status: SiteIndexFilterStatus, { checked }: CheckboxChange) => {
    setDraftFilters(current =>
      checked === true
        ? current.includes(status)
          ? current
          : [...current, status]
        : current.filter(currentStatus => currentStatus !== status)
    );
  };

  const removeFilterTag = (id: string) => {
    if (id === "update") {
      setDraftUpdateFilter(null);
      return;
    }

    if (id.startsWith("status-")) {
      const status = id.replace("status-", "") as SiteIndexFilterStatus;
      setDraftFilters(current => current.filter(currentStatus => currentStatus !== status));
    }
  };

  return (
    <IndexFilterDrawer
      open={open}
      onOpenChange={onOpenChange}
      tags={activeFilterTags}
      onRemoveTag={removeFilterTag}
      onClear={() => {
        setDraftFilters([]);
        setDraftUpdateFilter(null);
      }}
      onApply={() => onApplyFilters(draftFilters, draftUpdateFilter)}
      drawerSize="filterPanel"
      drawerPlacement="end"
      drawerMaxW="22.75rem"
      drawerPaddingTop={0}
      drawerPaddingLeft={0}
      drawerMaxH="100vh"
      panelClassName="h-screen max-h-screen shadow-[0_10px_7.5px_rgba(0,0,0,0.1),0_4px_3px_rgba(0,0,0,0.1)]"
    >
      <FilterCard label={t("Status")}>
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
    </IndexFilterDrawer>
  );
};

export default SiteIndexFilterDrawer;
