import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import React, { FC, useEffect, useMemo, useState } from "react";

import { useIsAdmin } from "@/hooks/useIsAdmin";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import FeedbackTag from "@/redesignComponents/actions/Tags/FeedbackTag/FeedbackTag";
import Drawer from "@/redesignComponents/containers/Drawer/Drawer";
import FilterPanel from "@/redesignComponents/containers/FilterPanel/FilterPanel";
import FilterCard from "@/redesignComponents/containers/FilterPanel/FilterPanelElements/FilteCards";
import Checkbox from "@/redesignComponents/Forms/Actions/Checkbox/Checkbox";
import Switch from "@/redesignComponents/Forms/Actions/Switch/Switch";
import TextInput from "@/redesignComponents/Forms/Inputs/TextInput";

import {
  EMPTY_SITE_ROLLUP_FILTERS,
  SITE_STATUS_LABELS,
  SITE_STATUS_OPTIONS,
  SiteRollupFilterState,
  SiteStatusBucket
} from "./siteRollupFilter.constants";

type CheckboxChange = { checked?: boolean | "indeterminate" };

const setArrayValue = <T extends string>(values: T[], value: T, checked: boolean): T[] => {
  if (checked) {
    return values.includes(value) ? values : [...values, value];
  }
  return values.filter(item => item !== value);
};

interface SiteRollupFilterDrawerProps {
  trigger?: React.ReactNode;
  open?: boolean;
  filters: SiteRollupFilterState;
  onApplyFilters: (filters: SiteRollupFilterState) => void;
  onClearFilters: () => void;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Site-level filter drawer for the rollup view. Mirrors `PolygonFilterDrawer`
 * (`src/pages/site/[uuid]/components/PolygonFilterDrawer.tsx`) — a right-side Drawer of FilterCards
 * with a Clear all / Apply footer, editing a draft copy that only commits on Apply — so site and
 * polygon filtering look and behave the same.
 */
const SiteRollupFilterDrawer: FC<SiteRollupFilterDrawerProps> = ({
  trigger,
  open,
  filters,
  onApplyFilters,
  onClearFilters,
  onOpenChange
}) => {
  const t = useT();
  const isAdmin = useIsAdmin();
  const [draftFilters, setDraftFilters] = useState<SiteRollupFilterState>(filters);

  useEffect(() => {
    if (open === true) {
      setDraftFilters(filters);
    }
  }, [filters, open]);

  const activeFilters = useMemo(() => {
    const tags: { id: string; label: string }[] = [];
    for (const bucket of draftFilters.status) {
      tags.push({ id: `status:${bucket}`, label: t(SITE_STATUS_LABELS[bucket]) });
    }
    if (draftFilters.onlyOverlaps) {
      tags.push({ id: "onlyOverlaps", label: t("Overlaps") });
    }
    if (draftFilters.hectaresMin !== "" || draftFilters.hectaresMax !== "") {
      const fromLabel = draftFilters.hectaresMin !== "" ? draftFilters.hectaresMin : t("Any");
      const toLabel = draftFilters.hectaresMax !== "" ? draftFilters.hectaresMax : t("Any");
      tags.push({ id: "hectares", label: `${fromLabel} - ${toLabel} ha` });
    }
    return tags;
  }, [draftFilters, t]);

  const removeFilter = (id: string) => {
    const [category, value] = id.split(":");
    setDraftFilters(current => {
      switch (category) {
        case "status":
          return { ...current, status: current.status.filter(s => s !== value) };
        case "onlyOverlaps":
          return { ...current, onlyOverlaps: false };
        case "hectares":
          return { ...current, hectaresMin: "", hectaresMax: "" };
        default:
          return current;
      }
    });
  };

  const handleStatusChange = (value: SiteStatusBucket, { checked }: CheckboxChange) => {
    setDraftFilters(current => ({
      ...current,
      status: setArrayValue(current.status, value, checked === true)
    }));
  };

  const handleOverlapChange = ({ checked }: CheckboxChange) => {
    setDraftFilters(current => ({ ...current, onlyOverlaps: checked === true }));
  };

  return (
    <Drawer
      trapFocus={false}
      trigger={trigger}
      open={open}
      onOpenChange={onOpenChange}
      maxW="22rem"
      paddingTop={isAdmin ? 12 : 0}
      maxH={isAdmin ? "calc(100vh - 3rem)" : "100vh"}
    >
      {({ onClose }) => (
        <FilterPanel
          title={t("Filters")}
          variant="fixed"
          onClose={onClose}
          className="h-full"
          content={
            <Flex className="h-full flex-col gap-3 overflow-auto p-4">
              <Flex className="mb-2 flex-wrap gap-2" display={activeFilters.length > 0 ? "flex" : "none"}>
                {activeFilters.map(filter => (
                  <FeedbackTag
                    key={filter.id}
                    type="info-white"
                    label={filter.label}
                    closable
                    onClose={() => removeFilter(filter.id)}
                  />
                ))}
              </Flex>
              <FilterCard label={t("Site Status")}>
                {SITE_STATUS_OPTIONS.map(option => (
                  <Checkbox
                    key={option.value}
                    name={`site-status-${option.value}`}
                    value={option.value}
                    checked={draftFilters.status.includes(option.value)}
                    onCheckedChange={(change: CheckboxChange) => handleStatusChange(option.value, change)}
                  >
                    {t(option.label)}
                  </Checkbox>
                ))}
              </FilterCard>
              <FilterCard label={t("Overlap")}>
                <Switch name="onlyOverlaps" checked={draftFilters.onlyOverlaps} onCheckedChange={handleOverlapChange}>
                  {t("Only sites with overlaps")}
                </Switch>
              </FilterCard>
              <FilterCard label={t("Hectares")}>
                <Flex className="items-center gap-2">
                  <TextInput
                    type="number"
                    size="small"
                    noMarginBottom
                    placeholder={t("Min")}
                    value={draftFilters.hectaresMin}
                    onChange={event => setDraftFilters(current => ({ ...current, hectaresMin: event.target.value }))}
                  />
                  <TextInput
                    type="number"
                    size="small"
                    noMarginBottom
                    placeholder={t("Max")}
                    value={draftFilters.hectaresMax}
                    onChange={event => setDraftFilters(current => ({ ...current, hectaresMax: event.target.value }))}
                  />
                </Flex>
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
                    setDraftFilters(EMPTY_SITE_ROLLUP_FILTERS);
                    onClearFilters();
                    onClose();
                  }
                },
                {
                  id: "apply",
                  children: t("Apply"),
                  variant: "primary",
                  onClick: () => {
                    onApplyFilters(draftFilters);
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

export default SiteRollupFilterDrawer;
