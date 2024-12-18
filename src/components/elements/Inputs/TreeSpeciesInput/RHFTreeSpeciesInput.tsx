import { useT } from "@transifex/react";
import { PropsWithChildren, useCallback } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import TreeSpeciesInput, { TreeSpeciesInputProps } from "./TreeSpeciesInput";

export interface RHFTreeSpeciesInputProps
  extends Omit<TreeSpeciesInputProps, "value" | "onChange" | "clearErrors">,
    UseControllerProps {
  formHook: UseFormReturn;
}

/**
 * @param props PropsWithChildren<RHFTreeSpeciesInputProps>
 * @returns React Hook Form Ready TreeSpeciesInput Component
 */
const RHFTreeSpeciesInput = (props: PropsWithChildren<RHFTreeSpeciesInputProps>) => {
  const t = useT();
  const {
    field: { onChange }
  } = useController(props);
  const { formHook, collection } = props;

  const value = formHook.watch(props.name);

  const clearErrors = useCallback(() => {
    formHook.clearErrors(props.name);
  }, [formHook, props.name]);

  return (
    <TreeSpeciesInput
      {...props}
      title={t("Tree Species")}
      buttonCaptionSuffix={t("Species")}
      withPreviousCounts={true}
      useTaxonomicBackbone={true}
      value={value ?? []}
      onChange={onChange}
      collection={collection}
      clearErrors={clearErrors}
      onError={() =>
        props.formHook.setError(props.name, { message: t("One or more values are missing"), type: "required" })
      }
    />
  );
};

export default RHFTreeSpeciesInput;
