import { useT } from "@transifex/react";
import _ from "lodash";
import { PropsWithChildren } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import { useDeleteV2SeedingsUUID, usePatchV2SeedingsUUID, usePostV2Seedings } from "@/generated/apiComponents";
import { Entity } from "@/types/common";
import { updateArrayState } from "@/utils/array";

import TreeSpeciesInput, { TreeSpeciesInputProps } from "./TreeSpeciesInput";

export interface RHFSeedingTableInputProps
  extends Omit<TreeSpeciesInputProps, "value" | "onChanges">,
    UseControllerProps {
  entity: Entity;
  collection?: string;
  onChangeCapture?: () => void;
  formHook?: UseFormReturn;
}

/**
 * @param props PropsWithChildren<RHFSeedingTableInputProps>
 * @returns React Hook Form Ready RHFSeedingTableInput Component
 */
const RHFSeedingTableInput = ({ entity, ...props }: PropsWithChildren<RHFSeedingTableInputProps>) => {
  const t = useT();
  const {
    field: { value, onChange }
  } = useController(props);

  const { mutate: createSeeding } = usePostV2Seedings({
    onSuccess(data) {
      const _tmp = [...value];
      //@ts-ignore
      _tmp.push(data.data);
      onChange(_tmp);
      props.formHook?.clearErrors(props.name);
    }
  });
  const { mutate: updateSeeding } = usePatchV2SeedingsUUID({
    onSuccess(data, variables) {
      //@ts-ignore
      onChange(updateArrayState(value, data.data, "uuid"));
      props.formHook?.clearErrors(props.name);
    }
  });
  const { mutate: deleteSeeding } = useDeleteV2SeedingsUUID({
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

      updateSeeding({
        pathParams: { uuid: value.uuid },
        //@ts-ignore
        body
      });
    }
  };

  return (
    <TreeSpeciesInput
      {...props}
      title={t("Seed species or Mix")}
      buttonCaptionSuffix={t("Species or mix")}
      value={value || []}
      handleCreate={value => {
        createSeeding({
          body: {
            name: value.name || "",
            amount: value.amount,
            model_type: entity?.entityName,
            model_uuid: entity?.entityUUID
          }
        });
      }}
      handleNameUpdate={handleUpdate}
      handleAmountUpdate={handleUpdate}
      handleDelete={uuid => {
        if (uuid) {
          deleteSeeding({ pathParams: { uuid } });
        }
      }}
      onError={() =>
        props.formHook?.setError(props.name, { message: t("One or more values are missing"), type: "required" })
      }
    />
  );
};

export default RHFSeedingTableInput;
