import { FC } from "react";

import Button from "@/components/elements/Button/Button";

import { AuditLogButtonStates } from "../constants/enum";

interface AuditLogSiteTabSelectionProps {
  buttonToogle: number;
  setButtonToogle: (buttonToogle: number) => void;
}

const AuditLogSiteTabSelection: FC<AuditLogSiteTabSelectionProps> = ({ buttonToogle, setButtonToogle }) => {
  return (
    <div className="flex w-fit gap-1 rounded-lg bg-neutral-200 p-1">
      <Button
        variant={`${buttonToogle === AuditLogButtonStates.PROJECT ? "white-toggle" : "transparent-toggle"}`}
        onClick={() => setButtonToogle(AuditLogButtonStates.PROJECT)}
      >
        Project Status
      </Button>
      <Button
        variant={`${buttonToogle === AuditLogButtonStates.SITE ? "white-toggle" : "transparent-toggle"}`}
        onClick={() => setButtonToogle(AuditLogButtonStates.SITE)}
      >
        Site Status
      </Button>
      <Button
        variant={`${buttonToogle === AuditLogButtonStates.POLYGON ? "white-toggle" : "transparent-toggle"}`}
        onClick={() => setButtonToogle(AuditLogButtonStates.POLYGON)}
      >
        Polygon Status
      </Button>
    </div>
  );
};

export default AuditLogSiteTabSelection;
