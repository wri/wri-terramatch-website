import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useEffect, useState } from "react";

import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Drawer from "@/redesignComponents/containers/Drawer/Drawer";
import FilterPanel from "@/redesignComponents/containers/FilterPanel/FilterPanel";
import FilterCard from "@/redesignComponents/containers/FilterPanel/FilterPanelElements/FilteCards";
import Checkbox from "@/redesignComponents/Forms/Actions/Checkbox/Checkbox";

import type { SiteIndexStatus } from "./siteIndexMockData";

export type SiteIndexFilterStatus = Extract<
  SiteIndexStatus,
  "draft" | "pending-approval" | "information-required" | "not-started" | "approved"
>;

export const SITE_INDEX_STATUS_OPTIONS: { label: string; value: SiteIndexFilterStatus }[] = [
  { label: "Draft", value: "draft" },
  { label: "Pending Approval", value: "pending-approval" },
  { label: "Information Required", value: "information-required" },
  { label: "Approved", value: "approved" }
];

type CheckboxChange = { checked?: boolean | "indeterminate" };

interface SiteIndexFilterDrawerProps {
  open: boolean;
  filters: SiteIndexFilterStatus[];
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: SiteIndexFilterStatus[]) => void;
  onClearFilters: () => void;
}

const SiteIndexFilterDrawer: FC<SiteIndexFilterDrawerProps> = ({
  open,
  filters,
  onOpenChange,
  onApplyFilters,
  onClearFilters
}) => {
  const t = useT();
  const [draftFilters, setDraftFilters] = useState<SiteIndexFilterStatus[]>(filters);

  useEffect(() => {
    if (open) {
      setDraftFilters(filters);
    }
  }, [filters, open]);

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
      size="md"
      placement="end"
      maxW="22.75rem"
      paddingTop={0}
      paddingLeft={0}
      maxH={"100vh"}
    >
      {({ onClose }) => (
        <FilterPanel
          title={t("Filters")}
          variant="fixed"
          onClose={onClose}
          className="h-full"
          content={
            <Flex className="h-full flex-col overflow-auto p-4">
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

export default SiteIndexFilterDrawer;
