import { useCallback, useMemo } from "react";
import { FieldValues, useController, UseFormReturn } from "react-hook-form";

import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import { useAllSitePolygons } from "@/connections/SitePolygons";
import { OptionValue } from "@/types/common";

export interface DisturbancePolygonAffectedInputProps {
  formHook: UseFormReturn<FieldValues, any>;
  onChangeCapture?: () => void;
  siteUuid?: string;
  label?: string;
  fieldUuid: string;
}

export const DisturbancePolygonAffectedInput = ({
  formHook,
  onChangeCapture,
  siteUuid,
  label = "Polygons",
  fieldUuid
}: DisturbancePolygonAffectedInputProps) => {
  const { data: polygonsData } = useAllSitePolygons({
    entityName: "sites",
    entityUuid: siteUuid,
    enabled: !!siteUuid,
    sortField: "name",
    sortDirection: "ASC"
  });

  const polygonChoices = useMemo(() => {
    if (!polygonsData || !siteUuid) return [];

    return polygonsData
      .filter((polygon: any) => polygon.status === "approved")
      .map((polygon: any) => ({
        title: polygon.name || `Polygon ${polygon.uuid}`,
        value: polygon.uuid,
        meta: { practice: polygon.practice || "" }
      }));
  }, [polygonsData, siteUuid]);

  if (!fieldUuid) {
    return null;
  }

  const fieldIndex = fieldUuid.match(/\[(\d+)\]/)?.[1];
  const fieldName = fieldUuid.replace(/\[\d+\]$/, "");

  const {
    field: { value: arrayValue, onChange: onArrayChange }
  } = useController({
    name: fieldName,
    control: formHook.control
  });

  const value = fieldIndex ? arrayValue[parseInt(fieldIndex)] : null;

  const _onChange = useCallback(
    (selectedValues: OptionValue[]) => {
      if (selectedValues.length > 0) {
        const polygonsData = selectedValues
          .map(selectedValue => {
            const selectedPolygon = polygonChoices.find(polygon => polygon.value === selectedValue);
            if (selectedPolygon) {
              return {
                polyUuid: selectedPolygon.value,
                polyName: selectedPolygon.title,
                siteUuid: siteUuid ?? ""
              };
            }
            return null;
          })
          .filter(Boolean);

        if (fieldIndex !== undefined) {
          const newArray = [...(arrayValue ?? [])];
          newArray[parseInt(fieldIndex)] = polygonsData;
          onArrayChange(newArray);
        }
      } else {
        if (fieldIndex !== undefined) {
          const newArray = [...(arrayValue ?? [])];
          newArray[parseInt(fieldIndex)] = [];
          onArrayChange(newArray);
        }
      }
      onChangeCapture?.();
    },
    [polygonChoices, siteUuid, fieldIndex, arrayValue, onArrayChange, onChangeCapture]
  );

  const dropdownValue = useMemo(() => {
    if (Array.isArray(value) && value.length > 0) {
      return value.map(item => item.polyUuid).filter(Boolean);
    }
    return [];
  }, [value]);

  return (
    <Dropdown
      label={label}
      options={polygonChoices}
      value={dropdownValue}
      onChange={_onChange}
      placeholder={siteUuid ? "Search and select polygons..." : "Please select a site first"}
      description={
        siteUuid ? "Select the polygons where the disturbance occurred" : "Select a site first to load polygons"
      }
      className="w-full"
      multiSelect={true}
    />
  );
};
