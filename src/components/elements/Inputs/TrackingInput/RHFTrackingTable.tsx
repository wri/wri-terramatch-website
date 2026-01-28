import { findLastIndex } from "lodash";
import { PropsWithChildren, useCallback, useMemo } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import InputWrapper from "@/components/elements/Inputs/InputElements/InputWrapper";
import TrackingCollapseGrid from "@/components/extensive/TrackingCollapseGrid/TrackingCollapseGrid";
import { GRID_VARIANT_GREEN } from "@/components/extensive/TrackingCollapseGrid/TrackingVariant";
import {
  TrackingCollapseGridProps,
  TrackingDomain,
  TrackingType
} from "@/components/extensive/TrackingCollapseGrid/types";
import { TrackingEntryDto } from "@/generated/v3/entityService/entityServiceSchemas";

export interface RHFTrackingTableProps
  extends Omit<TrackingCollapseGridProps, "onChange" | "variant" | "type" | "entries">,
    UseControllerProps {
  domain: TrackingDomain;
  trackingType: TrackingType;
  onChangeCapture?: () => void;
  formHook?: UseFormReturn;
  collection: string;
}

// In TM-1681 we moved several "name" values to "subtype". This check helps make sure that
// updates from update requests afterward honor that change.
const SUBTYPE_SWAP_TYPES = ["gender", "age", "caste"];

const ensureCorrectSubtypes = (entries: TrackingEntryDto[]) => {
  // In TM-1681 we moved several "name" values to "subtype". This check helps make sure that
  // updates from update requests afterward honor that change.
  for (let ii = 0; ii < entries.length; ii++) {
    const { type, subtype, name } = entries[ii];
    if (SUBTYPE_SWAP_TYPES.includes(type) && subtype == null && name != null) {
      entries[ii] = { ...entries[ii], subtype: name, name: null };
    }
  }

  return entries;
};

const RHFTrackingTable = ({
  domain,
  trackingType,
  onChangeCapture,
  collection,
  ...props
}: PropsWithChildren<RHFTrackingTableProps>) => {
  const {
    field: { value, onChange }
  } = useController(props);

  const entries = useMemo(() => ensureCorrectSubtypes(value?.[0]?.entries ?? []), [value]);

  const updateEntries = useCallback(
    (updatedEntries: TrackingEntryDto[]) => {
      // Clean up the data before calling onChange. While waiting for changes to propagate through
      // the form, it's possible for this function get called multiple times, adding the same type / subtype / name
      // set to the collection multiple times. Here, we take the last value for each combo, and discard
      // the rest. Once the changes have propagated through the form system, the risk of duplicates
      // goes away because the useSectionData hook will see the new value and provide the correct
      // data to the individual DemographicsRows
      updatedEntries = ensureCorrectSubtypes(updatedEntries).filter(
        ({ type, subtype, name }, index) =>
          index ===
          findLastIndex(
            updatedEntries,
            demographic => demographic.type === type && demographic.subtype === subtype && demographic.name === name
          )
      );

      onChange([{ ...value?.[0], collection, entries: updatedEntries }]);
      props.formHook?.trigger();
    },
    [onChange, value, collection, props.formHook]
  );

  return (
    <InputWrapper {...props}>
      <TrackingCollapseGrid
        domain={domain}
        type={trackingType}
        entries={entries}
        variant={GRID_VARIANT_GREEN}
        onChange={updateEntries}
      />
    </InputWrapper>
  );
};

export default RHFTrackingTable;
