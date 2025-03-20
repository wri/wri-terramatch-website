import { useT } from "@transifex/react";
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
  const t = useT();
  const tabNames = useMemo(() => {
    const doesNotHaveNurseries = framework === null || ["ppc", "hbf"].includes(framework);
    if (entityLevel == AuditLogButtonStates.SITE_REPORT) {
      return [
        { index: 4, name: t("Project Report") },
        { index: 5, name: t("Site Report") }
      ];
    }
    if (entityLevel == AuditLogButtonStates.NURSERY_REPORT) {
      return [
        { index: 4, name: t("Project Report") },
        { index: 6, name: t("Nursery Report") }
      ];
    }
    if (isReport) {
      let tabsReport = [t("Project Report"), t("Site Report")];
      if (!doesNotHaveNurseries && existNurseries) {
        tabsReport.push(t("Nursery Report"));
      }
      return tabsReport;
    }
    let tabs = [t("Project Status"), t("Site Status"), t("Polygon Status")];
    if (!doesNotHaveNurseries && AuditLogButtonStates.PROJECT == entityLevel && existNurseries) {
      tabs.push(t("Nursery Status"));
    }
    return tabs;
  }, [framework, isReport, entityLevel, existNurseries, t]);
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
