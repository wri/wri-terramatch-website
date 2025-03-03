import { FC, useMemo } from "react";

import Button from "@/components/elements/Button/Button";

import { AuditLogButtonStates } from "../constants/enum";

interface AuditLogSiteTabSelectionProps {
  buttonToggle: number;
  setButtonToggle: (buttonToggle: number) => void;
  framework?: string;
  isReport?: boolean;
  entityLevel?: number;
}

const AuditLogSiteTabSelection: FC<AuditLogSiteTabSelectionProps> = ({
  buttonToggle,
  setButtonToggle,
  framework = null,
  isReport = false,
  entityLevel
}) => {
  const tabNames = useMemo(() => {
    const doesNotHaveNurseries = framework === null || ["ppc", "hbf"].includes(framework);
    if (isReport) {
      let tabsReport = ["Project Report", "Site Report"];
      if (!doesNotHaveNurseries) {
        tabsReport.push("Nursery Report");
      }
      return tabsReport;
    }
    let tabs = ["Project Status", "Site Status", "Polygon Status"];
    if (!doesNotHaveNurseries && AuditLogButtonStates.PROJECT == entityLevel) {
      tabs.push("Nursery Status");
    }
    return tabs;
  }, [framework, isReport, entityLevel]);
  return (
    <div className="flex w-fit gap-1 rounded-lg bg-neutral-200 p-1">
      {tabNames.map((tabName, index) => {
        const realIndex = isReport ? index + 4 : index;
        return (
          <Button
            key={realIndex}
            variant={`${buttonToggle === realIndex ? "white-toggle" : "transparent-toggle"}`}
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
