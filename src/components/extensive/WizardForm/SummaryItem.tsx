import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC, SetStateAction, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";

import FormStepHeader from "@/components/extensive/WizardForm/FormStepHeader";
import FormSummary from "@/components/extensive/WizardForm/FormSummary";
import { downloadAnswersCSV } from "@/components/extensive/WizardForm/utils";
import { useActions } from "@/connections/Action";
import { FormModel, FormModelsDefinition, useFieldsProvider } from "@/context/wizardForm.provider";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import ApiSlice from "@/store/apiSlice";

import { FormFooter } from "./FormFooter";

type SummaryItemProps = {
  models: FormModelsDefinition;
  title: string;
  subtitle?: string;
  formHook: UseFormReturn;
  downloadButtonText?: string;
  setSelectedStepIndex: (value: SetStateAction<number>) => void;
  onSubmitStep: (data: any) => void;
  onSaveAndExit: () => void;
  submitButtonDisable?: boolean;
  enableSaveChangesButton?: boolean;
  saveChanges: () => void;
  feedback?: string | null;
  feedbackFields?: string[] | null;
};

const SummaryItem: FC<SummaryItemProps> = ({
  models,
  title,
  subtitle,
  formHook,
  downloadButtonText,
  setSelectedStepIndex,
  onSubmitStep,
  onSaveAndExit,
  submitButtonDisable,
  enableSaveChangesButton,
  saveChanges,
  feedback,
  feedbackFields
}) => {
  const t = useT();
  const user = useIsAdmin();
  const fieldsProvider = useFieldsProvider();
  const [, { data: actions }] = useActions({
    enabled: !user
  });
  const entity = models as FormModel;
  const action = useMemo(() => {
    return actions?.find(a => {
      const target = a.target as { uuid?: string };
      return a.targetableType === entity.model && target?.uuid === entity.uuid;
    });
  }, [actions, entity]);

  const handleSubmitClick = async () => {
    await formHook.handleSubmit(onSubmitStep)();
    if (action != null) {
      ApiSlice.pruneCache("actions", [action.uuid]);
    }
  };

  return (
    <div
      className={classNames("h-full overflow-auto pr-[12px]", {
        "h-[calc(100vh-354px)] md:h-[calc(100vh-355px)] lg:h-[calc(100vh-355px)]": user
      })}
    >
      <FormStepHeader id="step" title={title} subtitle={subtitle}>
        <FormSummary
          values={formHook.getValues()}
          onEdit={setSelectedStepIndex}
          feedback={feedback}
          feedbackFieldsOptions={feedbackFields}
        />
      </FormStepHeader>
      <FormFooter
        className={classNames(
          "absolute right-0 left-0 z-20 shadow-[0_-2px_6px_-1px_rgba(0,0,0,0.10)]",
          user ? "bottom-0" : "bottom-[0px]"
        )}
        cancelButtonProps={undefined}
        primaryButtonProps={{
          children: t("Submit"),
          onClick: handleSubmitClick,
          disabled: submitButtonDisable
        }}
        secondaryButtonProps={
          entity?.model != "organisations"
            ? {
                children: t("Save and Exit"),
                onClick: saveChanges
              }
            : undefined
        }
        tertiaryButtonProps={{
          children: t("Download"),
          onClick: () => downloadAnswersCSV(fieldsProvider, formHook.getValues())
        }}
      />
    </div>
  );
};

export default SummaryItem;
