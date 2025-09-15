import { useCallback, useMemo } from "react";
import { FieldValues, useController, UseFormReturn } from "react-hook-form";

import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import { indexSiteConnection } from "@/connections/Entity";
import { useConnection } from "@/hooks/useConnection";
import { OptionValue } from "@/types/common";

export interface DisturbanceSiteAffectedInputProps {
  formHook: UseFormReturn<FieldValues, any>;
  onChangeCapture?: () => void;
  projectUuid?: string;
  label?: string;
  fieldUuid: string;
}

export const DisturbanceSiteAffectedInput = ({
  formHook,
  onChangeCapture,
  projectUuid,
  label = "Site",
  fieldUuid
}: DisturbanceSiteAffectedInputProps) => {
  const [, sitesData] = useConnection(indexSiteConnection, {
    filter: { projectUuid: projectUuid },
    pageSize: 100,
    pageNumber: 1,
    sortField: "name",
    sortDirection: "ASC"
  });

  const siteChoices = useMemo(() => {
    if (!sitesData || !projectUuid || !("data" in sitesData) || !sitesData.data) return [];

    return sitesData.data.map((site: any) => ({
      title: site.name || `Site ${site.uuid}`,
      value: site.uuid,
      meta: { country: site.country || "" }
    }));
  }, [sitesData, projectUuid]);

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
      const selectedValue = selectedValues[0];
      if (selectedValue) {
        const selectedSite = siteChoices.find(site => site.value === selectedValue);
        if (selectedSite) {
          const siteData = {
            siteUuid: selectedSite.value,
            siteName: selectedSite.title
          };
          if (fieldIndex !== undefined) {
            const newArray = [...(arrayValue ?? [])];
            newArray[parseInt(fieldIndex)] = siteData;
            onArrayChange(newArray);
          }
        }
      } else {
        if (fieldIndex !== undefined) {
          const newArray = [...(arrayValue ?? [])];
          newArray[parseInt(fieldIndex)] = "";
          onArrayChange(newArray);
        }
      }
      onChangeCapture?.();
    },
    [siteChoices, fieldIndex, arrayValue, onArrayChange, onChangeCapture]
  );

  const dropdownValue = useMemo(() => {
    if (value && typeof value === "object" && value.siteUuid) {
      return [value.siteUuid];
    }
    return [];
  }, [value]);

  return (
    <Dropdown
      label={label}
      options={siteChoices}
      value={dropdownValue}
      onChange={_onChange}
      placeholder={projectUuid ? "Search and select sites..." : "Please select a project first"}
      description={
        projectUuid ? "Select the sites where the disturbance occurred" : "Select a project first to load sites"
      }
      className="w-full"
    />
  );
};
