import { useCallback, useMemo } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import { indexSiteConnection } from "@/connections/Entity";
import { useConnection } from "@/hooks/useConnection";
import { OptionValue } from "@/types/common";

interface SiteReferenceInputProps {
  formHook: UseFormReturn<FieldValues, any>;
  onChange: () => void;
  projectUuid?: string;
  label?: string;
  fieldUuid: string;
}

export const SiteReferenceInput = ({
  formHook,
  onChange,
  projectUuid,
  label = "Site",
  fieldUuid
}: SiteReferenceInputProps) => {
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
  const arrayValue = formHook.watch(fieldName) || [];
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
            const newArray = [...arrayValue];
            newArray[parseInt(fieldIndex)] = siteData;
            formHook.setValue(fieldName, newArray);
          }
        }
      } else {
        if (fieldIndex !== undefined && fieldName) {
          const newArray = [...arrayValue];
          newArray[parseInt(fieldIndex)] = "";
          formHook.setValue(fieldName, newArray);
        }
      }
      onChange();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [siteChoices]
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
