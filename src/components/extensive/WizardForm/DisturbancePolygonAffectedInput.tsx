import { useT } from "@transifex/react";
import { useCallback, useMemo } from "react";
import { ControllerRenderProps } from "react-hook-form";

import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import { useAllSitePolygons } from "@/connections/SitePolygons";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import useDisturbanceReportDescriptions from "@/hooks/translation/useDisturbanceReportDescriptions";
import { OptionValue } from "@/types/common";

export interface DisturbancePolygonAffectedInputProps {
  onChangeCapture?: () => void;
  siteUuid?: string;
  label?: string;
  fieldUuid: string;
  value: any[];
  field: ControllerRenderProps<any, any>;
}

export const DisturbancePolygonAffectedInput = ({
  onChangeCapture,
  siteUuid,
  label = "Polygons",
  fieldUuid,
  value: polygonAffectedValue,
  field
}: DisturbancePolygonAffectedInputProps) => {
  const t = useT();
  const { data: polygonsData, isLoading: isLoadingPolygons } = useAllSitePolygons({
    entityName: "sites",
    entityUuid: siteUuid,
    enabled: siteUuid != null && siteUuid !== "",
    filter: {
      "polygonStatus[]": ["approved"]
    },
    sortField: "name",
    sortDirection: "ASC"
  });
  const { DISTURBANCE_POLYGONS_FIELD_DESCRIPTION } = useDisturbanceReportDescriptions();

  const polygonChoices = useMemo(() => {
    if (polygonsData == null || siteUuid == null) return [];

    return polygonsData.map((polygon: SitePolygonLightDto) => ({
      title: polygon.name || `Polygon ${polygon.uuid}`,
      value: polygon.uuid,
      meta: { practice: polygon.practice ?? "" }
    }));
  }, [polygonsData, siteUuid]);

  const hasSite = siteUuid != null && siteUuid !== "";
  const hasNoApprovedPolygons = hasSite && !isLoadingPolygons && polygonChoices.length === 0;

  const fieldIndex = fieldUuid?.match(/\[(\d+)\]/)?.[1];
  const currentPolygons = polygonAffectedValue.find(f => f.name === "polygon-affected")?.value;
  const polygonsArray = typeof currentPolygons === "string" ? JSON.parse(currentPolygons) : currentPolygons;
  const value = fieldIndex != null ? polygonsArray[parseInt(fieldIndex)] : null;

  const _onChange = useCallback(
    (selectedValues: OptionValue[]) => {
      if (selectedValues.length > 0) {
        const polygonsData = selectedValues
          .map(selectedValue => {
            const selectedPolygon = polygonChoices.find(polygon => polygon.value === selectedValue);
            if (selectedPolygon != null) {
              return {
                polyUuid: selectedPolygon.value,
                polyName: selectedPolygon.title,
                siteUuid: siteUuid ?? ""
              };
            }
            return null;
          })
          .filter(Boolean);

        if (fieldIndex != null) {
          const newArray = [...(polygonsArray ?? [])];
          newArray[parseInt(fieldIndex)] = polygonsData;
          const newValue = polygonAffectedValue?.map(f =>
            f.name === "polygon-affected" ? { ...f, value: newArray } : f
          );
          field.onChange(newValue);
        }
      } else {
        if (fieldIndex != null) {
          const newArray = [...(polygonsArray ?? [])];
          newArray[parseInt(fieldIndex)] = [];
          const newValue = polygonAffectedValue?.map(f =>
            f.name === "polygon-affected" ? { ...f, value: newArray } : f
          );
          field.onChange(newValue);
        }
      }
      onChangeCapture?.();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [polygonChoices, siteUuid, fieldIndex, polygonAffectedValue, field.onChange, onChangeCapture]
  );

  const dropdownValue = useMemo(() => {
    if (Array.isArray(value) && value.length > 0) {
      return value.map(item => item.polyUuid).filter(Boolean);
    }
    return [];
  }, [value]);

  if (fieldUuid == null || hasNoApprovedPolygons) {
    return null;
  }

  return (
    <Dropdown
      label={label}
      options={polygonChoices}
      value={dropdownValue}
      onChange={_onChange}
      placeholder={
        siteUuid != null && siteUuid !== "" ? t("Search and select polygons...") : t("Please select a site first")
      }
      description={DISTURBANCE_POLYGONS_FIELD_DESCRIPTION}
      className="w-full"
      multiSelect={true}
    />
  );
};
