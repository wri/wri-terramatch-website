import { useT } from "@transifex/react";
import { PropsWithChildren, useCallback } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import TreeSpeciesInput, { TreeSpeciesInputProps } from "./TreeSpeciesInput";

export interface RHFSeedingTableInputProps
  extends Omit<TreeSpeciesInputProps, "value" | "onChanges">,
    UseControllerProps {
  collection?: string;
  onChangeCapture?: () => void;
  formHook: UseFormReturn;
}

/**
 * @param props PropsWithChildren<RHFSeedingTableInputProps>
 * @returns React Hook Form Ready RHFSeedingTableInput Component
 */
const RHFSeedingTableInput = (props: PropsWithChildren<RHFSeedingTableInputProps>) => {
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
      title={t("Seed species or Mix")}
      buttonCaptionSuffix={t("Species or mix")}
      withPreviousCounts={false}
      useTaxonomicBackbone={false}
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

export default RHFSeedingTableInput;
