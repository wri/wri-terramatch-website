import { useT } from "@transifex/react";
import _ from "lodash";
import { PropsWithChildren } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import { useDeleteV2TreeSpeciesUUID, usePatchV2TreeSpeciesUUID, usePostV2TreeSpecies } from "@/generated/apiComponents";
import { updateArrayState } from "@/utils/array";

import TreeSpeciesInput, { TreeSpeciesInputProps } from "./TreeSpeciesInput";

export interface RHFTreeSpeciesInputProps
  extends Omit<TreeSpeciesInputProps, "value" | "onChanges">,
    UseControllerProps {
  model: string;
  uuid: string;
  collection?: string;
  onChangeCapture?: () => void;
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

  const { mutate: createTreeSpecies } = usePostV2TreeSpecies({
    onSuccess(data) {
      const _tmp = [...value];
      //@ts-ignore
      _tmp.push(data.data);
      onChange(_tmp);
      props.formHook?.clearErrors(props.name);
    }
  });
  const { mutate: updateTreeSpecies } = usePatchV2TreeSpeciesUUID({
    onSuccess(data, variables) {
      //@ts-ignore
      onChange(updateArrayState(value, data.data, "uuid"));
      props.formHook?.clearErrors(props.name);
    }
  });
  const { mutate: deleteTreeSpecies } = useDeleteV2TreeSpeciesUUID({
    onSuccess(data, variables) {
      //@ts-ignore
      _.remove(value, v => v.uuid === variables.pathParams.uuid);
      onChange(value);
      props.formHook?.clearErrors(props.name);
    }
  });

  const handleUpdate = (value: any) => {
    if (value.uuid) {
      const body: any = {};
      if (value.name) body.name = value.name;
      if (value.amount) body.amount = value.amount;

      updateTreeSpecies({
        pathParams: { uuid: value.uuid },
        body
      });
    }
  };

  return (
    <TreeSpeciesInput
      {...props}
      value={value || []}
      handleCreate={value => {
        createTreeSpecies({
          //@ts-ignore
          body: {
            name: value.name || "",
            amount: value.amount,
            //@ts-ignore
            model_uuid: props.uuid,
            model_type: props.model,
            collection: props.collection
          }
        });
      }}
      handleNameUpdate={handleUpdate}
      handleAmountUpdate={handleUpdate}
      handleDelete={uuid => {
        if (uuid) {
          deleteTreeSpecies({ pathParams: { uuid } });
        }
      }}
      onError={() =>
        props.formHook?.setError(props.name, { message: t("One or more values are missing"), type: "required" })
      }
    />
  );
};

export default RHFTreeSpeciesInput;
