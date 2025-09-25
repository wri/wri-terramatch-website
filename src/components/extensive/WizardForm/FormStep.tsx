import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren, useEffect, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";

import { IButtonProps } from "@/components/elements/Button/Button";
import List from "@/components/extensive/List/List";
import FormQuestion from "@/components/extensive/WizardForm/FormQuestion";
import FormStepHeader from "@/components/extensive/WizardForm/FormStepHeader";
import { questionDtoToDefinition } from "@/components/extensive/WizardForm/utils";
import { useFormSection, useSectionQuestions } from "@/connections/util/Form";

interface FormTabProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  stepId: string;
  formHook: UseFormReturn;
  onChange: () => void;
  actionButtonProps?: IButtonProps;
  formSubmissionOrg?: any;
}

export const FormStep = ({
  stepId,
  formHook,
  onChange,
  actionButtonProps,
  children,
  formSubmissionOrg,
  ...divProps
}: PropsWithChildren<FormTabProps>) => {
  const questions = useSectionQuestions(stepId);
  const questionDefinitions = useMemo(() => (questions ?? []).map(questionDtoToDefinition), [questions]);
  const section = useFormSection(stepId);

  useEffect(() => {
    formHook.clearErrors();
  }, [stepId, formHook]);

  if (section == null) return null;

  return (
    <FormStepHeader {...divProps} title={section.title ?? undefined} subtitle={section.description ?? undefined}>
      {questionDefinitions.length === 0 ? null : (
        <List
          items={questionDefinitions}
          uniqueId="name"
          itemClassName="mt-8"
          render={question => (
            <FormQuestion
              key={question.name}
              question={question}
              formHook={formHook}
              onChange={onChange}
              formSubmissionOrg={formSubmissionOrg}
            />
          )}
        />
      )}
      {children}
    </FormStepHeader>
  );
};
