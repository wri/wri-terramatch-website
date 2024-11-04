import { findLastIndex } from "lodash";
import { PropsWithChildren, useCallback, useMemo } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import InputWrapper from "@/components/elements/Inputs/InputElements/InputWrapper";
import DemographicsCollapseGrid from "@/components/extensive/DemographicsCollapseGrid/DemographicsCollapseGrid";
import { GRID_VARIANT_GREEN } from "@/components/extensive/DemographicsCollapseGrid/DemographicVariant";
import { Demographic, DemographicalType } from "@/components/extensive/DemographicsCollapseGrid/types";
import { Entity } from "@/types/common";

import { DataTableProps } from "../DataTable/DataTable";

export interface RHFDemographicsTableProps
  extends Omit<DataTableProps<any>, "value" | "onChange" | "fields" | "addButtonCaption" | "tableColumns">,
    UseControllerProps {
  demographicalType: DemographicalType;
  onChangeCapture?: () => void;
  formHook?: UseFormReturn;
  entity: Entity;
  collection: string;
}

const RHFDemographicsTable = ({
  demographicalType,
  onChangeCapture,
  entity,
  collection,
  ...props
}: PropsWithChildren<RHFDemographicsTableProps>) => {
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
      // data to the individual DemographicsRows
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
    <InputWrapper error={props.error}>
      <DemographicsCollapseGrid
        title={props.label ?? ""}
        demographicalType={demographicalType}
        demographics={demographics}
        variant={GRID_VARIANT_GREEN}
        onChange={updateDemographics}
      />
    </InputWrapper>
  );
};

export default RHFDemographicsTable;
