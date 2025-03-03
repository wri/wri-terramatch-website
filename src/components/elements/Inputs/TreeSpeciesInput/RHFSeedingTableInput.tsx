import { useT } from "@transifex/react";
import { PropsWithChildren, useCallback } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import TreeSpeciesInput, { TreeSpeciesInputProps } from "./TreeSpeciesInput";

export interface RHFSeedingTableInputProps
  extends Omit<TreeSpeciesInputProps, "value" | "onChanges" | "collection">,
    UseControllerProps {
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
  const { formHook } = props;

  const value = formHook.watch(props.name);

  const clearErrors = useCallback(() => {
    formHook.clearErrors(props.name);
  }, [formHook, props.name]);

  // The Seedings table doesn't have a collection field. When fetching previous count data from the API,
  // the seedings data gets included in the "seeds" collection name, so we fake that collection on
  // the input props below.
  return (
    <TreeSpeciesInput
      {...props}
      title={t("Seed species or Mix")}
      buttonCaptionSuffix={t("Species or mix")}
      withPreviousCounts={true}
      useTaxonomicBackbone={false}
      value={value ?? []}
      onChange={onChange}
      collection={"seeds"}
      clearErrors={clearErrors}
      onError={() =>
        props.formHook.setError(props.name, { message: t("One or more values are missing"), type: "required" })
      }
    />
  );
};

export default RHFSeedingTableInput;
