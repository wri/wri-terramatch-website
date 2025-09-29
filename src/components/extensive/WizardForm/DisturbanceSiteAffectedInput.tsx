import { useCallback, useMemo } from "react";
import { ControllerRenderProps } from "react-hook-form";

import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import { indexSiteConnection } from "@/connections/Entity";
import { APPROVED, RESTORATION_IN_PROGRESS } from "@/constants/statuses";
import { useEntityContext } from "@/context/entity.provider";
import { SiteLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useConnection } from "@/hooks/useConnection";
import { OptionValue } from "@/types/common";

export interface DisturbanceSiteAffectedInputProps {
  onChangeCapture?: () => void;
  fieldUuid: string;
  value: any[];
  field: ControllerRenderProps<any, any>;
}

interface SiteAffectedValue {
  siteName: string;
  siteUuid: string;
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

    return sitesData.data
      .filter((site: SiteLightDto) => site.status === APPROVED || site.status === RESTORATION_IN_PROGRESS)
      .map((site: SiteLightDto) => ({
        title: site.name ?? `Site ${site.uuid}`,
        value: site.uuid
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
      const prevSiteUuid = value?.siteUuid;

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

            const isDifferentSite = String(prevSiteUuid ?? "") !== String(selectedSite.value);

            const newValue = siteAffectedValue?.map(f => {
              if (f.name === "site-affected") {
                return { ...f, value: newArray };
              }

              if (isDifferentSite && f.name === "polygons-affected") {
                const polysArray = typeof f.value === "string" ? JSON.parse(f.value) : f.value;
                const polysNew = Array.isArray(polysArray) ? [...polysArray] : [];
                polysNew[parseInt(fieldIndex)] = [];
                return { ...f, value: polysNew };
              }

              return f;
            });

            field.onChange(newValue);
          }
        }
      } else {
        if (fieldIndex != null) {
          const newArray = [...(sitesArray ?? [])];
          newArray[parseInt(fieldIndex)] = "";

          const newValue = siteAffectedValue?.map(f => {
            if (f.name === "site-affected") {
              return { ...f, value: newArray };
            }

            if (f.name === "polygons-affected") {
              const polysArray = typeof f.value === "string" ? JSON.parse(f.value) : f.value;
              const polysNew = Array.isArray(polysArray) ? [...polysArray] : [];
              polysNew[parseInt(fieldIndex)] = [];
              return { ...f, value: polysNew };
            }

            return f;
          });

          field.onChange(newValue);
        }
      }
      onChangeCapture?.();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [siteChoices, fieldIndex, sitesArray, field.onChange, onChangeCapture, value?.siteUuid]
  );

  const dropdownValue = useMemo(() => {
    if (value?.siteUuid != null) {
      return [value.siteUuid];
    }
    return [];
  }, [value]);

  const optionsForDropdown = useMemo(() => {
    const currentSelectedUuid = value?.siteUuid != null ? String(value.siteUuid) : null;

    const selectedUuidsAcrossRows = new Set<string>(
      (Array.isArray(sitesArray) ? sitesArray : [])
        .map((s: SiteAffectedValue) => s?.siteUuid)
        .filter((uuid: string) => uuid != null)
        .map((uuid: string) => String(uuid))
        .filter((uuid: string) => uuid !== currentSelectedUuid)
    );

    const selectedOptionForThisRow = currentSelectedUuid
      ? siteChoices.find(o => String(o.value) === currentSelectedUuid)
      : undefined;

    const availableOptions = siteChoices.filter(o => !selectedUuidsAcrossRows.has(String(o.value)));

    if (selectedOptionForThisRow) {
      const withoutDup = availableOptions.filter(o => String(o.value) !== currentSelectedUuid);
      return [selectedOptionForThisRow, ...withoutDup];
    }
    return availableOptions;
  }, [siteChoices, sitesArray, value?.siteUuid]);

  return (
    <Dropdown
      label={`Site ${fieldIndex != null ? parseInt(fieldIndex) + 1 : 1} Affected`}
      options={optionsForDropdown}
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
