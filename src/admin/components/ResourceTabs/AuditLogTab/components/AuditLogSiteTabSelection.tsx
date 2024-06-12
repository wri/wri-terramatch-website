import { FC } from "react";

import Button from "@/components/elements/Button/Button";

interface AuditLogSiteTabSelectionProps {
  buttonToogle: number;
  setButtonToogle: (buttonToogle: number) => void;
}

const tabNames = ["Project Status", "Site Status", "Polygon Status"];

const AuditLogSiteTabSelection: FC<AuditLogSiteTabSelectionProps> = ({ buttonToogle, setButtonToogle }) => {
  return (
    <div className="flex w-fit gap-1 rounded-lg bg-neutral-200 p-1">
      {tabNames.map((tabName, index) => (
        <Button
          key={index}
          variant={`${buttonToogle === index ? "white-toggle" : "transparent-toggle"}`}
          onClick={() => setButtonToogle(index)}
        >
          {tabName}
        </Button>
      ))}
    </div>
  );
};

export default AuditLogSiteTabSelection;
