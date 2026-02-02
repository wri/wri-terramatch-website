import { useT } from "@transifex/react";
import { FC, SetStateAction, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";

import { FormFooter } from "@/components/extensive/WizardForm/FormFooter";
import FormStepHeader from "@/components/extensive/WizardForm/FormStepHeader";
import FormSummary from "@/components/extensive/WizardForm/FormSummary";
import { downloadAnswersCSV } from "@/components/extensive/WizardForm/utils";
import { useActions } from "@/connections/Action";
import { FormModel, FormModelsDefinition, useFieldsProvider } from "@/context/wizardForm.provider";
import { usePutV2MyActionsUUIDComplete } from "@/generated/apiComponents";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import ApiSlice from "@/store/apiSlice";

type SummaryItemProps = {
  models: FormModelsDefinition;
  title: string;
  subtitle?: string;
  formHook: UseFormReturn;
  downloadButtonText?: string;
  setSelectedStepIndex: (value: SetStateAction<number>) => void;
  onSubmitStep: (data: any) => void;
  submitButtonDisable?: boolean;
};

const SummaryItem: FC<SummaryItemProps> = ({
  models,
  title,
  subtitle,
  formHook,
  downloadButtonText,
  setSelectedStepIndex,
  onSubmitStep,
  submitButtonDisable
}) => {
  const t = useT();
  const user = useIsAdmin();

  const fieldsProvider = useFieldsProvider();
  const { mutate } = usePutV2MyActionsUUIDComplete();
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
      mutate({ pathParams: { uuid: action.uuid } });
      ApiSlice.pruneCache("actions", [action.uuid]);
    }
  };

  return (
    <div className="overflow-auto sm:h-[calc(100vh-218px)] md:h-[calc(100vh-256px)] lg:h-[calc(100vh-268px)]">
      <FormStepHeader
        id="step"
        title={title}
        subtitle={subtitle}
        actionButtonProps={
          downloadButtonText == null
            ? undefined
            : {
                children: downloadButtonText,
                onClick: () => downloadAnswersCSV(fieldsProvider, formHook.getValues())
              }
        }
      >
        <FormSummary values={formHook.getValues()} onEdit={setSelectedStepIndex} />
      </FormStepHeader>
      <FormFooter
        variant="sticky"
        backButtonProps={{
          children: t("Back"),
          onClick: () => setSelectedStepIndex(n => n - 1)
        }}
        submitButtonProps={{
          children: t("Submit"),
          onClick: handleSubmitClick,
          disabled: submitButtonDisable,
          className: "py-3"
        }}
      />
    </div>
  );
};

export default SummaryItem;
