import { T, useT } from "@transifex/react";
import { FC } from "react";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";

export interface WizardFormHeaderProps {
  currentStep: number;
  numberOfSteps: number;
  formStatus?: "saving" | "saved";
  errorMessage?: string;
  onClickSaveAndCloseButton?: () => void;
  title?: string;
  subtitle?: string;
}

const statusText = (formStatus: WizardFormHeaderProps["formStatus"]) => {
  switch (formStatus) {
    case "saving":
      return "Saving...";
    case "saved":
      return "Saved";
    case null:
      return "Unsaved";
    default:
      return "Something went wrong.";
  }
};

export const WizardFormHeader: FC<WizardFormHeaderProps> = props => {
  const t = useT();

  const subtitle =
    props.subtitle ?? t("Progress: {number} steps complete", { number: `${props.currentStep}/${props.numberOfSteps}` });

  return (
    <div className="flex border-neutral-150 bg-treesHeaderWithOverlay bg-cover bg-no-repeat px-10 py-3 md:py-8">
      <div className="mx-auto flex w-full min-w-0 max-w-[82vw] items-center gap-8">
        <div className="min-w-0 flex-grow text-white">
          {props.title && (
            <Text variant="text-36-bold" className="overflow-hidden text-ellipsis whitespace-nowrap">
              {props.title}
            </Text>
          )}
          <div className="flex">
            <Text variant="text-14-light" className="overflow-hidden text-ellipsis whitespace-nowrap">
              {subtitle}
            </Text>
            <Text variant="text-14-light" className="pl-1">
              {t(statusText(props.formStatus))}
            </Text>
          </div>
        </div>
        {props.onClickSaveAndCloseButton && (
          <Button onClick={props.onClickSaveAndCloseButton} variant="secondary">
            <T _str="Close and continue later" />
          </Button>
        )}
      </div>
    </div>
  );
};
