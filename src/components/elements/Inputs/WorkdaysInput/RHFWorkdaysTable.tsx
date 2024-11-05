import { findLastIndex } from "lodash";
import { PropsWithChildren, useCallback, useMemo } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import InputWrapper from "@/components/elements/Inputs/InputElements/InputWrapper";
import { Demographic } from "@/components/extensive/WorkdayCollapseGrid/types";
import WorkdayCollapseGrid from "@/components/extensive/WorkdayCollapseGrid/WorkdayCollapseGrid";
import { GRID_VARIANT_GREEN } from "@/components/extensive/WorkdayCollapseGrid/WorkdayVariant";
import { Entity } from "@/types/common";

import { DataTableProps } from "../DataTable/DataTable";

export interface RHFWorkdaysTableProps
  extends Omit<DataTableProps<any>, "value" | "onChange" | "fields" | "addButtonCaption" | "tableColumns">,
    UseControllerProps {
  onChangeCapture?: () => void;
  formHook?: UseFormReturn;
  entity: Entity;
  collection: string;
}

const RHFWorkdaysTable = ({
  onChangeCapture,
  entity,
  collection,
  ...props
}: PropsWithChildren<RHFWorkdaysTableProps>) => {
  const {
    field: { value, onChange }
  } = useController(props);

  const demographics = useMemo(() => value?.[0]?.demographics ?? [], [value]);

  const updateDemographics = useCallback(
    (updatedDemographics: Demographic[]) => {
      // Clean up the data before calling onChange. While waiting for changes to propagate through
      // the form, it's possible for this function get called multiple times, adding the same type / subtype / name
      // set to the collection multiple times. Here, we take the last value for each combo, and discard
      // the rest. Once the changes have propagated through the form system, the risk of duplicates
      // goes away because the useSectionData hook will see the new value and provide the correct
      // data to the individual WorkdayRows
      updatedDemographics = updatedDemographics.filter(
        ({ type, subtype, name }, index) =>
          index ===
          findLastIndex(
            updatedDemographics,
            demographic => demographic.type === type && demographic.subtype === subtype && demographic.name === name
          )
      );

      onChange([{ ...value[0], collection, demographics: updatedDemographics }]);
    },
    [value, collection, onChange]
  );

  return (
    <InputWrapper {...props}>
      <WorkdayCollapseGrid demographics={demographics} variant={GRID_VARIANT_GREEN} onChange={updateDemographics} />
    </InputWrapper>
  );
};

export default RHFWorkdaysTable;
