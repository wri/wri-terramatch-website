import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren, useEffect, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";

import { IButtonProps } from "@/components/elements/Button/Button";
import List from "@/components/extensive/List/List";
import FormQuestion from "@/components/extensive/WizardForm/FormQuestion";
import FormStepHeader from "@/components/extensive/WizardForm/FormStepHeader";
import { useFormSection, useSectionQuestions } from "@/connections/util/Form";

interface FormTabProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  sectionId: string;
  formHook: UseFormReturn;
  onChange: () => void;
  actionButtonProps?: IButtonProps;
  formSubmissionOrg?: any;
}

export const FormStep = ({
  sectionId,
  formHook,
  onChange,
  actionButtonProps,
  children,
  formSubmissionOrg,
  ...divProps
}: PropsWithChildren<FormTabProps>) => {
  const questions = useSectionQuestions(sectionId);
  const questionIds = useMemo(() => (questions ?? []).map(({ uuid }) => uuid), [questions]);
  const section = useFormSection(sectionId);

  useEffect(() => {
    formHook.clearErrors();
  }, [sectionId, formHook]);

  if (section == null) return null;

  return (
    <FormStepHeader {...divProps} title={section.title ?? undefined} subtitle={section.description ?? undefined}>
      {questionIds.length === 0 ? null : (
        <List
          items={questionIds}
          uniqueId="name"
          itemClassName="mt-8"
          render={questionId => (
            <FormQuestion
              key={questionId}
              questionId={questionId}
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
