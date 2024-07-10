import { FC } from "react";

import Button from "@/components/elements/Button/Button";

interface AuditLogSiteTabSelectionProps {
  buttonToggle: number;
  setButtonToggle: (buttonToggle: number) => void;
}

const tabNames = ["Project Status", "Site Status", "Polygon Status"];

const AuditLogSiteTabSelection: FC<AuditLogSiteTabSelectionProps> = ({ buttonToggle, setButtonToggle }) => (
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

export default AuditLogSiteTabSelection;
