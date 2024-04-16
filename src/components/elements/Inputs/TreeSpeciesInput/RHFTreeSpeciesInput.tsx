import { useT } from "@transifex/react";
import _ from "lodash";
import { PropsWithChildren, useCallback } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import { updateArrayState } from "@/utils/array";

import TreeSpeciesInput, { TreeSpeciesInputProps, TreeSpeciesValue } from "./TreeSpeciesInput";

export interface RHFTreeSpeciesInputProps
  extends Omit<TreeSpeciesInputProps, "value" | "onChanges">,
    UseControllerProps {
  model: string;
  uuid: string;
  collection?: string;
  onChangeCapture: () => void;
  formHook?: UseFormReturn;
}

/**
 * @param props PropsWithChildren<RHFTreeSpeciesInputProps>
 * @returns React Hook Form Ready TreeSpeciesInput Component
 */
const RHFTreeSpeciesInput = (props: PropsWithChildren<RHFTreeSpeciesInputProps>) => {
  const t = useT();

  const {
    field: { value, onChange }
  } = useController(props);
  const { formHook } = props;

  const createTreeSpecies = useCallback(
    (treeValue: TreeSpeciesValue) => {
      onChange([...(value ?? []), treeValue]);
      // Specifically avoiding `onChangeCapture()` here because it's too easy to lose progress
      // typing a name or amount when the server response comes back.
      formHook?.clearErrors(props.name);
    },
    [value, onChange, formHook]
  );

  const updateTreeSpecies = useCallback(
    (treeValue: TreeSpeciesValue) => {
      onChange(updateArrayState(value, treeValue, "uuid"));
      formHook?.clearErrors(props.name);
    },
    [value, onChange, formHook]
  );

  const deleteTreeSpecies = useCallback(
    (uuid: string | undefined) => {
      if (uuid != null) {
        _.remove(value, (v: TreeSpeciesValue) => v.uuid == uuid);
        onChange(value);
        formHook?.clearErrors(props.name);
      }
    },
    [value, onChange, formHook]
  );

  return (
    <TreeSpeciesInput
      {...props}
      title={t("Tree Species")}
      buttonCaptionSuffix={t("Species")}
      value={value || []}
      handleCreate={createTreeSpecies}
      handleNameUpdate={updateTreeSpecies}
      handleAmountUpdate={updateTreeSpecies}
      handleDelete={deleteTreeSpecies}
      onError={() =>
        props.formHook?.setError(props.name, { message: t("One or more values are missing"), type: "required" })
      }
    />
  );
};

export default RHFTreeSpeciesInput;
