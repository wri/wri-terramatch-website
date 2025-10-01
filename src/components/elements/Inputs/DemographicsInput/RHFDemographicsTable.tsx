import { findLastIndex } from "lodash";
import { PropsWithChildren, useCallback, useMemo } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import InputWrapper from "@/components/elements/Inputs/InputElements/InputWrapper";
import DemographicsCollapseGrid from "@/components/extensive/DemographicsCollapseGrid/DemographicsCollapseGrid";
import { GRID_VARIANT_GREEN } from "@/components/extensive/DemographicsCollapseGrid/DemographicVariant";
import { DemographicsCollapseGridProps, DemographicType } from "@/components/extensive/DemographicsCollapseGrid/types";
import { DemographicEntryDto } from "@/generated/v3/entityService/entityServiceSchemas";

export interface RHFDemographicsTableProps
  extends Omit<DemographicsCollapseGridProps, "onChange" | "variant" | "type" | "entries">,
    UseControllerProps {
  demographicType: DemographicType;
  onChangeCapture?: () => void;
  formHook?: UseFormReturn;
  collection: string;
}

// In TM-1681 we moved several "name" values to "subtype". This check helps make sure that
// updates from update requests afterward honor that change.
const SUBTYPE_SWAP_TYPES = ["gender", "age", "caste"];

const ensureCorrectSubtypes = (demographics: DemographicEntryDto[]) => {
  // In TM-1681 we moved several "name" values to "subtype". This check helps make sure that
  // updates from update requests afterward honor that change.
  for (let ii = 0; ii < demographics.length; ii++) {
    const { type, subtype, name } = demographics[ii];
    if (SUBTYPE_SWAP_TYPES.includes(type) && subtype == null && name != null) {
      demographics[ii] = { ...demographics[ii], subtype: name, name: undefined };
    }
  }

  return demographics;
};

const RHFDemographicsTable = ({
  demographicType,
  onChangeCapture,
  collection,
  ...props
}: PropsWithChildren<RHFDemographicsTableProps>) => {
  const {
    field: { value, onChange }
  } = useController(props);

  const demographics = useMemo(
    () => ensureCorrectSubtypes((value?.[0]?.demographics ?? []) as DemographicEntryDto[]),
    [value]
  );

  const updateDemographics = useCallback(
    (updatedDemographics: DemographicEntryDto[]) => {
      // Clean up the data before calling onChange. While waiting for changes to propagate through
      // the form, it's possible for this function get called multiple times, adding the same type / subtype / name
      // set to the collection multiple times. Here, we take the last value for each combo, and discard
      // the rest. Once the changes have propagated through the form system, the risk of duplicates
      // goes away because the useSectionData hook will see the new value and provide the correct
      // data to the individual DemographicsRows
      updatedDemographics = ensureCorrectSubtypes(updatedDemographics).filter(
        ({ type, subtype, name }, index) =>
          index ===
          findLastIndex(
            updatedDemographics,
            demographic => demographic.type === type && demographic.subtype === subtype && demographic.name === name
          )
      );

      onChange([{ ...value[0], collection, demographics: updatedDemographics }]);
      props.formHook?.trigger();
    },
    [onChange, value, collection, props.formHook]
  );

  return (
    <InputWrapper {...props}>
      <DemographicsCollapseGrid
        type={demographicType}
        entries={demographics}
        variant={GRID_VARIANT_GREEN}
        onChange={updateDemographics}
      />
    </InputWrapper>
  );
};

export default RHFDemographicsTable;
