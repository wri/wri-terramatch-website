import { FC, useMemo } from "react";

import Button from "@/components/elements/Button/Button";

import { AuditLogButtonStates } from "../constants/enum";

interface AuditLogSiteTabSelectionProps {
  buttonToggle: number;
  setButtonToggle: (buttonToggle: number) => void;
  framework?: string;
  isReport?: boolean;
  entityLevel?: number;
  existNurseries?: boolean;
}

const AuditLogSiteTabSelection: FC<AuditLogSiteTabSelectionProps> = ({
  buttonToggle,
  setButtonToggle,
  framework = null,
  isReport = false,
  entityLevel,
  existNurseries = false
}) => {
  const tabNames = useMemo(() => {
    const doesNotHaveNurseries = framework === null || ["ppc", "hbf"].includes(framework);
    if (entityLevel == AuditLogButtonStates.SITE_REPORT) {
      return [
        { index: 4, name: "Project Report" },
        { index: 5, name: "Site Report" }
      ];
    }
    if (entityLevel == AuditLogButtonStates.NURSERY_REPORT) {
      return [
        { index: 4, name: "Project Report" },
        { index: 6, name: "Nursery Report" }
      ];
    }
    if (isReport) {
      let tabsReport = ["Project Report", "Site Report"];
      if (!doesNotHaveNurseries && existNurseries) {
        tabsReport.push("Nursery Report");
      }
      return tabsReport;
    }
    let tabs = ["Project Status", "Site Status", "Polygon Status"];
    if (!doesNotHaveNurseries && AuditLogButtonStates.PROJECT == entityLevel && existNurseries) {
      tabs.push("Nursery Status");
    }
    return tabs;
  }, [framework, isReport, entityLevel, existNurseries]);
  return (
    <div className="flex w-fit gap-1 rounded-lg bg-neutral-200 p-1">
      {tabNames.map((tab: any, index) => {
        const realIndex = isReport ? index + 4 : tab.index ?? index;
        const tabName = typeof tab === "string" ? tab : tab.name;

        return (
          <Button
            key={realIndex}
            variant={buttonToggle === realIndex ? "white-toggle" : "transparent-toggle"}
            onClick={() => setButtonToggle(realIndex)}
          >
            {tabName}
          </Button>
        );
      })}
    </div>
  );
};

export default AuditLogSiteTabSelection;
