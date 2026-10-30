import { useT } from "@transifex/react";
import { FC, useEffect, useMemo, useState } from "react";

import FilterCard from "@/redesignComponents/containers/FilterPanel/FilterPanelElements/FilterCards";
import IndexFilterDrawer from "@/redesignComponents/containers/FilterPanel/IndexFilterDrawer";
import Checkbox from "@/redesignComponents/Forms/Actions/Checkbox/Checkbox";

import type { SiteIndexStatus, SiteIndexUpdate } from "./siteIndex.types";

export type SiteIndexFilterStatus = Extract<
  SiteIndexStatus,
  "draft" | "pending-approval" | "information-required" | "approved"
>;

export const getSiteIndexStatusOptions = (t: typeof useT): { label: string; value: SiteIndexFilterStatus }[] => [
  { label: t("Draft"), value: "draft" },
  { label: t("Pending Approval"), value: "pending-approval" },
  { label: t("Information Required"), value: "information-required" },
  { label: t("Approved"), value: "approved" }
];

export type SiteIndexFilterUpdate = SiteIndexUpdate;

export const getSiteIndexUpdateOptions = (t: typeof useT): { label: string; value: SiteIndexFilterUpdate }[] => [
  { label: t("Draft"), value: "draft" },
  { label: t("Pending Approval"), value: "pending-approval" },
  { label: t("Information Required"), value: "information-required" },
  { label: t("Complete"), value: "complete" }
];

type CheckboxChange = { checked?: boolean | "indeterminate" };

interface SiteIndexFilterDrawerProps {
  open: boolean;
  filters: SiteIndexFilterStatus[];
  updateFilters: SiteIndexFilterUpdate[];
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: SiteIndexFilterStatus[], updateFilters: SiteIndexFilterUpdate[]) => void;
}

const SiteIndexFilterDrawer: FC<SiteIndexFilterDrawerProps> = ({
  open,
  filters,
  updateFilters,
  onOpenChange,
  onApplyFilters
}) => {
  const t = useT();
  const statusOptions = useMemo(() => getSiteIndexStatusOptions(t), [t]);
  const updateOptions = useMemo(() => getSiteIndexUpdateOptions(t), [t]);
  const [draftFilters, setDraftFilters] = useState<SiteIndexFilterStatus[]>(filters);
  const [draftUpdateFilters, setDraftUpdateFilters] = useState<SiteIndexFilterUpdate[]>(updateFilters);

  useEffect(() => {
    if (open) {
      setDraftFilters(filters);
      setDraftUpdateFilters(updateFilters);
    }
  }, [filters, open, updateFilters]);

  const activeFilterTags = useMemo(() => {
    const tags: { id: string; label: string }[] = [];

    statusOptions
      .filter(option => draftFilters.includes(option.value))
      .forEach(option => tags.push({ id: `status-${option.value}`, label: option.label }));

    updateOptions
      .filter(option => draftUpdateFilters.includes(option.value))
      .forEach(option => tags.push({ id: `update-${option.value}`, label: option.label }));

    return tags;
  }, [draftFilters, draftUpdateFilters, statusOptions, updateOptions]);

  const handleStatusChange = (status: SiteIndexFilterStatus, { checked }: CheckboxChange) => {
    setDraftFilters(current =>
      checked === true
        ? current.includes(status)
          ? current
          : [...current, status]
        : current.filter(currentStatus => currentStatus !== status)
    );
  };

  const handleUpdateChange = (update: SiteIndexFilterUpdate, { checked }: CheckboxChange) => {
    setDraftUpdateFilters(current =>
      checked === true
        ? current.includes(update)
          ? current
          : [...current, update]
        : current.filter(currentUpdate => currentUpdate !== update)
    );
  };

  const removeFilterTag = (id: string) => {
    if (id.startsWith("update-")) {
      const update = id.replace("update-", "") as SiteIndexFilterUpdate;
      setDraftUpdateFilters(current => current.filter(currentUpdate => currentUpdate !== update));
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
        setDraftUpdateFilters([]);
      }}
      onApply={() => onApplyFilters(draftFilters, draftUpdateFilters)}
      drawerSize="filterPanel"
      drawerPlacement="end"
      drawerMaxW="22.75rem"
      drawerPaddingTop={0}
      drawerPaddingLeft={0}
      drawerMaxH="100vh"
      panelClassName="h-screen max-h-screen shadow-[0_0.625rem_0.46875rem_rgba(0,0,0,0.1),0_0.25rem_0.1875rem_rgba(0,0,0,0.1)]"
    >
      <FilterCard label={t("Status")}>
        {statusOptions.map(option => (
          <Checkbox
            key={option.value}
            name={`site-status-${option.value}`}
            value={option.value}
            checked={draftFilters.includes(option.value)}
            onCheckedChange={(change: CheckboxChange) => handleStatusChange(option.value, change)}
          >
            {option.label}
          </Checkbox>
        ))}
      </FilterCard>
      <FilterCard label={t("Updates")}>
        {updateOptions.map(option => (
          <Checkbox
            key={option.value}
            name={`site-update-${option.value}`}
            value={option.value}
            checked={draftUpdateFilters.includes(option.value)}
            onCheckedChange={(change: CheckboxChange) => handleUpdateChange(option.value, change)}
          >
            {option.label}
          </Checkbox>
        ))}
      </FilterCard>
    </IndexFilterDrawer>
  );
};

export default SiteIndexFilterDrawer;
