import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren, useEffect } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { twMerge } from "tailwind-merge";

import Button, { IButtonProps } from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import List from "@/components/extensive/List/List";
import FormQuestion from "@/components/extensive/WizardForm/FormQuestion";
import { useFormQuestionIds, useFormSection } from "@/connections/util/Form";

interface FormTabProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  sectionId: string;
  formHook: UseFormReturn<FieldValues, any>;
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
  className,
  formSubmissionOrg,
  ...divProps
}: PropsWithChildren<FormTabProps>) => {
  const questionIds = useFormQuestionIds(sectionId);
  const section = useFormSection(sectionId);

  useEffect(() => {
    formHook.clearErrors();
  }, [sectionId, formHook]);

  if (section == null) return null;

  return (
    <div {...divProps} className={twMerge("flex-1 bg-white px-16 pt-8 pb-11", className)}>
      <div className="flex items-center justify-between">
        <Text variant="text-heading-700">{section.title}</Text>
        {actionButtonProps == null ? null : <Button {...actionButtonProps!} />}
      </div>
      <Text variant="text-body-600" className="mt-8" containHtml>
        {section.description}
      </Text>
      <div className="my-8 h-[2px] w-full bg-neutral-200" />

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
    </div>
  );
};
