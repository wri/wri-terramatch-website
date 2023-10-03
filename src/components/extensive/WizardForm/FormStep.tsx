import { PropsWithChildren } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { When } from "react-if";

import Button, { IButtonProps } from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import List from "@/components/extensive/List/List";

import { FieldMapper } from "./FieldMapper";
import { FormField } from "./types";

interface FormTabProps {
  title: string;
  subtitle?: string;
  fields?: FormField[];
  formHook: UseFormReturn<FieldValues, any>;
  onChange: () => void;
  actionButtonProps?: IButtonProps;
}

export const FormStep = (props: PropsWithChildren<FormTabProps>) => {
  return (
    <div className="flex-1 bg-white px-16 pt-8 pb-15">
      <div className="flex items-center justify-between">
        <Text variant="text-heading-700">{props.title}</Text>
        <When condition={!!props.actionButtonProps}>
          <Button {...props.actionButtonProps!} />
        </When>
      </div>
      <Text variant="text-body-600" className="mt-8" containHtml>
        {props.subtitle}
      </Text>
      <div className="my-8 h-[2px] w-full bg-neutral-200" />

      <When condition={!!props.fields}>
        <List
          items={props.fields!}
          uniqueId="name"
          itemClassName="mt-8"
          render={field => <FieldMapper field={field} formHook={props.formHook} onChange={props.onChange} />}
        />
      </When>
      {props.children}
    </div>
  );
};
