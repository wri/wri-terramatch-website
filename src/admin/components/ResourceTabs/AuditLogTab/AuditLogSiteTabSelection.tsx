import { FC } from "react";

import Button from "@/components/elements/Button/Button";

import { ButtonStates } from "./AuditLogSiteTab";

interface AuditLogSiteTabSelectionProps {
  buttonToogle: number;
  setButtonToogle: (buttonToogle: number) => void;
}

const AuditLogSiteTabSelection: FC<AuditLogSiteTabSelectionProps> = ({ buttonToogle, setButtonToogle }) => {
  return (
    <div className="flex w-fit gap-1 rounded-lg bg-neutral-200 p-1">
      <Button
        variant={`${buttonToogle === ButtonStates.PROJECTS ? "white-toggle" : "transparent-toggle"}`}
        onClick={() => setButtonToogle(ButtonStates.PROJECTS)}
      >
        Project Status
      </Button>
      <Button
        variant={`${buttonToogle === ButtonStates.SITE ? "white-toggle" : "transparent-toggle"}`}
        onClick={() => setButtonToogle(ButtonStates.SITE)}
      >
        Site Status
      </Button>
      <Button
        variant={`${buttonToogle === ButtonStates.POLYGON ? "white-toggle" : "transparent-toggle"}`}
        onClick={() => setButtonToogle(ButtonStates.POLYGON)}
      >
        Polygon Status
      </Button>
    </div>
  );
};

export default AuditLogSiteTabSelection;
