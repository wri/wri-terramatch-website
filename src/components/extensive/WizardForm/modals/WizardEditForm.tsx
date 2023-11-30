import { useT } from "@transifex/react";

import IconButton from "@/components/elements/IconButton/IconButton";
import Text from "@/components/elements/Text/Text";
import { useModalContext } from "@/context/modal.provider";

import { IconNames } from "../../Icon/Icon";
import WizardForm from "..";
import { FormStepSchema } from "../types";

export type WizardEditFormProps = {
  title: string;
  steps: FormStepSchema[];
  onSave: (data: any, step: FormStepSchema) => void;
  defaultValues?: any;
  errors?: any;
};

const WizardEditForm = ({ title, steps, onSave, defaultValues, errors }: WizardEditFormProps) => {
  const { closeModal } = useModalContext();
  const t = useT();

  return (
    <div className="w-full bg-white">
      <div className="flex items-center justify-between bg-neutral-200 py-11 pl-8 pr-11">
        <Text variant="text-heading-2000">{title}</Text>
        <IconButton iconProps={{ name: IconNames.X_CIRCLE, width: 30 }} onClick={() => closeModal()} />
      </div>
      <WizardForm
        hideBackButton
        disableAutoProgress
        errors={errors}
        submitButtonText={t("Save")}
        nextButtonText={t("Save")}
        header={{
          hide: true
        }}
        steps={steps}
        defaultValues={defaultValues || {}}
        onStepChange={onSave}
        onBackFirstStep={() => null}
        hideSaveAndCloseButton
        tabOptions={{
          markDone: false,
          disableFutureTabs: false
        }}
        className="max-w-none p-0"
      />
    </div>
  );
};

export default WizardEditForm;
