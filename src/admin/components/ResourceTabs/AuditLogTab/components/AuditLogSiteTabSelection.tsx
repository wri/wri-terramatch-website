import { FC, useMemo } from "react";

import Button from "@/components/elements/Button/Button";

interface AuditLogSiteTabSelectionProps {
  buttonToggle: number;
  setButtonToggle: (buttonToggle: number) => void;
  framework?: string;
  isReport?: boolean;
}

const AuditLogSiteTabSelection: FC<AuditLogSiteTabSelectionProps> = ({
  buttonToggle,
  setButtonToggle,
  framework = null,
  isReport = false
}) => {
  const tabNames = useMemo(() => {
    if (isReport) {
      return ["Project Report", "Site Report", "Polygon Report"];
    }
    const doesNotHaveNurseries = framework === null || ["ppc", "hbf"].includes(framework);
    let tabs = ["Project Status", "Site Status", "Polygon Status"];
    if (!doesNotHaveNurseries) {
      tabs.push("Nursery Status");
    }
    return tabs;
  }, [framework, isReport]);
  return (
    <div className="flex w-fit gap-1 rounded-lg bg-neutral-200 p-1">
      {tabNames.map((tabName, index) => (
        <Button
          key={index}
          variant={`${buttonToggle === index ? "white-toggle" : "transparent-toggle"}`}
          onClick={() => setButtonToggle(index)}
        >
          {tabName}
        </Button>
      ))}
    </div>
  );
};

export default AuditLogSiteTabSelection;
