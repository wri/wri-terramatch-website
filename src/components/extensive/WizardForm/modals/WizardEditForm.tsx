import { useT } from "@transifex/react";

import IconButton from "@/components/elements/IconButton/IconButton";
import Text from "@/components/elements/Text/Text";
import { Framework } from "@/context/framework.provider";
import { useModalContext } from "@/context/modal.provider";
import { FormFieldsProvider, FormModelsDefinition } from "@/context/wizardForm.provider";

import { IconNames } from "../../Icon/Icon";
import { ModalId } from "../../Modal/ModalConst";
import WizardForm from "..";

export type WizardEditFormProps = {
  title: string;
  fieldsProvider: FormFieldsProvider;
  models: FormModelsDefinition;
  framework: Framework;
  onSave: (data: any) => void;
  defaultValues?: any;
  errors?: any;
};

const WizardEditForm = ({
  title,
  fieldsProvider,
  models,
  framework,
  onSave,
  defaultValues,
  errors
}: WizardEditFormProps) => {
  const { closeModal } = useModalContext();
  const t = useT();
  return (
    <div className="w-full bg-white">
      <div className="flex items-center justify-between bg-neutral-200 py-11 pl-8 pr-11">
        <Text variant="text-heading-2000">{title}</Text>
        <IconButton
          iconProps={{ name: IconNames.X_CIRCLE, width: 30 }}
          onClick={() => {
            closeModal(ModalId.PITCH_EDIT_MODAL);
            closeModal(ModalId.ORGANIZATION_EDIT_MODAL);
          }}
        />
      </div>
      <WizardForm
        framework={framework}
        models={models}
        fieldsProvider={fieldsProvider}
        hideBackButton
        disableAutoProgress
        errors={errors}
        submitButtonText={t("Save")}
        nextButtonText={t("Save")}
        header={{
          hide: true
        }}
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
