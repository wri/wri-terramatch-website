import { useT } from "@transifex/react";
import { FC, useMemo } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { EditIcon } from "@/redesignComponents/foundations/Icons";
import { ProgressSteps } from "@/redesignComponents/status/ProgressIndicator/ProgressSteps";
import { StepProps } from "@/redesignComponents/status/ProgressIndicator/types";

import { OrganisationSetUpStep } from "./types";

type OrganizationSetUpSectionProps = {
  steps: OrganisationSetUpStep[];
  onEditStep: () => void;
};

const OrganizationSetUpSection: FC<OrganizationSetUpSectionProps> = ({ steps, onEditStep }) => {
  const t = useT();

  const progressSteps = useMemo<StepProps[]>(
    () =>
      steps.map(({ title, completed }, index) => ({
        index: index + 1,
        status: completed ? "completed" : "available",
        label: title,
        onClick: onEditStep,
        actions: (
          <Button
            type="button"
            variant="borderless"
            size="small"
            leftIcon={completed ? <EditIcon boxSize={3} /> : undefined}
            onClick={onEditStep}
          >
            {completed ? t("Edit") : t("Add")}
          </Button>
        )
      })),
    [onEditStep, steps, t]
  );

  return <ProgressSteps steps={progressSteps} />;
};

export default OrganizationSetUpSection;
