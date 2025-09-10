import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren, useEffect } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { When } from "react-if";
import { twMerge } from "tailwind-merge";

import Button, { IButtonProps } from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import List from "@/components/extensive/List/List";
import { EntityName } from "@/types/common";

import { DisturbanceFieldsContainer } from "./DisturbanceFieldsContainer";
import { FieldMapper } from "./FieldMapper";
import { FormField } from "./types";

interface FormTabProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title: string;
  subtitle?: string;
  fields?: FormField[];
  formHook: UseFormReturn<FieldValues, any>;
  onChange: () => void;
  actionButtonProps?: IButtonProps;
  formSubmissionOrg?: any;
  entity?: EntityName;
  projectUuid?: string;
}

export const FormStep = ({
  title,
  subtitle,
  fields,
  formHook,
  onChange,
  actionButtonProps,
  children,
  className,
  formSubmissionOrg,
  entity,
  projectUuid,
  ...divProps
}: PropsWithChildren<FormTabProps>) => {
  useEffect(() => {
    formHook.clearErrors();
  }, [fields, formHook, title]);

  return (
    <div {...divProps} className={twMerge("flex-1 bg-white px-16 pt-8 pb-11", className)}>
      <div className="flex items-center justify-between">
        <Text variant="text-heading-700">{title}</Text>
        <When condition={!!actionButtonProps}>
          <Button {...actionButtonProps!} />
        </When>
      </div>
      <Text variant="text-body-600" className="mt-8" containHtml>
        {subtitle}
      </Text>
      <div className="my-8 h-[2px] w-full bg-neutral-200" />

      <When condition={!!fields}>
        <List
          items={fields!}
          uniqueId="name"
          itemClassName="mt-8"
          render={field => {
            if (entity === "disturbance-reports") {
              const disturbanceFields = fields!.filter(f => (f as any).linked_field_key?.startsWith("dis-rep-"));
              const currentIndex = disturbanceFields.findIndex(f => f.name === field.name);

              if (currentIndex === 0) {
                return (
                  <DisturbanceFieldsContainer
                    fields={disturbanceFields}
                    formHook={formHook}
                    onChange={onChange}
                    projectUuid={projectUuid}
                  />
                );
              }
              return null;
            } else {
              return (
                <FieldMapper
                  field={field}
                  formHook={formHook}
                  onChange={onChange}
                  formSubmissionOrg={formSubmissionOrg}
                />
              );
            }
          }}
        />
      </When>
      {children}
    </div>
  );
};
