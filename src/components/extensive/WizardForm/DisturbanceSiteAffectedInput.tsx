import { useCallback, useMemo } from "react";
import { ControllerRenderProps } from "react-hook-form";

import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import { indexSiteConnection } from "@/connections/Entity";
import { useEntityContext } from "@/context/entity.provider";
import { useConnection } from "@/hooks/useConnection";
import { OptionValue } from "@/types/common";

export interface DisturbanceSiteAffectedInputProps {
  onChangeCapture?: () => void;
  fieldUuid: string;
  value: any[];
  field: ControllerRenderProps<any, any>;
}

export const DisturbanceSiteAffectedInput = ({
  onChangeCapture,
  fieldUuid,
  value: siteAffectedValue,
  field
}: DisturbanceSiteAffectedInputProps) => {
  const { projectUuid } = useEntityContext();
  const [, sitesData] = useConnection(indexSiteConnection, {
    filter: { projectUuid: projectUuid },
    pageSize: 100,
    pageNumber: 1,
    sortField: "name",
    sortDirection: "ASC"
  });

  const siteChoices = useMemo(() => {
    if (sitesData == null || projectUuid == null || !("data" in sitesData) || sitesData.data == null) return [];

    return sitesData.data.map((site: any) => ({
      title: site.name ?? `Site ${site.uuid}`,
      value: site.uuid,
      meta: { country: site.country ?? "" }
    }));
  }, [sitesData, projectUuid]);

  if (fieldUuid == null) {
    return null;
  }

  const fieldIndex = fieldUuid.match(/\[(\d+)\]/)?.[1];

  const currentSites = siteAffectedValue.find(f => f.name === "site-affected")?.value;
  const sitesArray = typeof currentSites === "string" ? JSON.parse(currentSites) : currentSites;
  const value = fieldIndex != null ? sitesArray[parseInt(fieldIndex)] : null;

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
          if (fieldIndex != null) {
            const newArray = [...(sitesArray ?? [])];
            newArray[parseInt(fieldIndex)] = siteData;
            const newValue = siteAffectedValue?.map(f => (f.name === "site-affected" ? { ...f, value: newArray } : f));
            field.onChange(newValue);
          }
        }
      } else {
        if (fieldIndex != null) {
          const newArray = [...(sitesArray ?? [])];
          newArray[parseInt(fieldIndex)] = "";
          const newValue = siteAffectedValue?.map(f => (f.name === "site-affected" ? { ...f, value: newArray } : f));
          field.onChange(newValue);
        }
      }
      onChangeCapture?.();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [siteChoices, fieldIndex, sitesArray, field.onChange, onChangeCapture]
  );

  const dropdownValue = useMemo(() => {
    if (value?.siteUuid != null) {
      return [value.siteUuid];
    }
    return [];
  }, [value]);

  return (
    <Dropdown
      label={`Site ${fieldIndex != null ? parseInt(fieldIndex) + 1 : 1} Affected`}
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
