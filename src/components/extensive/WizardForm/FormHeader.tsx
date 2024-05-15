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
    <div className="sticky top-[74px] z-40 flex border-neutral-150 bg-treesHeaderWithOverlay bg-cover bg-no-repeat px-10 py-3 md:py-8">
      <div className="mx-auto flex w-full min-w-0 max-w-[82vw] items-center gap-8">
        <div className="min-w-0 flex-grow text-white">
          {props.title && (
            <Text variant="text-36-bold" className="overflow-hidden text-ellipsis whitespace-nowrap">
              {props.title}
            </Text>
          )}
          <div className="flex">
            <Text variant="text-14-light" className="overflow-hidden text-ellipsis whitespace-nowrap">
              <T _str="Progress: {number} steps complete" number={`${props.currentStep}/${props.numberOfSteps}`} />
            </Text>
            <Text variant="text-14-light">
              <Switch>
                <Case condition={props.formStatus === undefined}>{t("Unsaved")}</Case>
                <Case condition={props.formStatus === "saving"}>{t("Saving…")}</Case>
                <Case condition={props.formStatus === "saved"}>{t("Saved")}</Case>
                <Case condition={props.errorMessage}>{t("Something went wrong.")}</Case>
              </Switch>
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
