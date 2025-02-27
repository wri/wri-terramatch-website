import { FC, useMemo } from "react";

import Button from "@/components/elements/Button/Button";

interface AuditLogSiteTabSelectionProps {
  buttonToggle: number;
  setButtonToggle: (buttonToggle: number) => void;
  framework?: string;
}

const AuditLogSiteTabSelection: FC<AuditLogSiteTabSelectionProps> = ({
  buttonToggle,
  setButtonToggle,
  framework = null
}) => {
  const tabNames = useMemo(() => {
    const doesNotHaveNurseries = framework === null || ["ppc", "hbf"].includes(framework);
    let tabs = ["Project Status", "Site Status", "Polygon Status"];
    if (!doesNotHaveNurseries) {
      tabs.push("Nursery Status");
    }
    return tabs;
  }, [framework]);
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
