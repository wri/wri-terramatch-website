import { T, useT } from "@transifex/react";
import { Case, Switch } from "react-if";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";

export interface WizardFormHeaderProps {
  currentStep: number;
  numberOfSteps: number;
  formStatus?: "saving" | "saved";
  errorMessage?: string;
  onClickSaveAndCloseButton?: () => void;
  title?: string;
}

export const WizardFormHeader = (props: WizardFormHeaderProps) => {
  const t = useT();

  return (
    <div className="sticky top-[74px] z-10 flex border-b-[40px] border-primary-50 bg-leavesWithOverlay bg-cover bg-center p-6">
      <div className="mx-auto flex w-full min-w-0 max-w-[1200px] items-center gap-8">
        <div className="min-w-0 flex-grow text-white">
          {props.title && (
            <Text variant="text-bold-subtitle-600" className="overflow-hidden text-ellipsis whitespace-nowrap">
              {props.title}
            </Text>
          )}
          <Text variant="text-bold-body-300" className="overflow-hidden text-ellipsis whitespace-nowrap">
            <T _str="Progress: {number} steps complete" number={`${props.currentStep}/${props.numberOfSteps}`} />
          </Text>
          <Text variant="text-bold-caption-200">
            <Switch>
              <Case condition={props.formStatus === undefined}>{t("Unsaved")}</Case>
              <Case condition={props.formStatus === "saving"}>{t("Saving…")}</Case>
              <Case condition={props.formStatus === "saved"}>{t("Saved")}</Case>
              <Case condition={props.errorMessage}>{t("Something went wrong.")}</Case>
            </Switch>
          </Text>
        </div>
        {props.onClickSaveAndCloseButton && (
          <Button onClick={props.onClickSaveAndCloseButton}>
            <T _str="Close and continue later" />
          </Button>
        )}
      </div>
    </div>
  );
};
