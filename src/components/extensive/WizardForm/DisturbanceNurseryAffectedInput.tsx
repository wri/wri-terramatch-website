import { useT } from "@transifex/react";
import { useCallback, useMemo } from "react";
import { ControllerRenderProps } from "react-hook-form";

import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import { indexNurseryConnection } from "@/connections/Entity";
import { DISTURBANCE_NURSERY_AFFECTED_FIELD_DESCRIPTION } from "@/constants/DisturbanceReportEntriesDescriptions";
import { APPROVED } from "@/constants/statuses";
import { useProjectFormDetails } from "@/context/wizardForm.provider";
import { NurseryLightDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useConnection } from "@/hooks/useConnection";
import { OptionValue } from "@/types/common";

export interface DisturbanceNurseryAffectedInputProps {
  onChangeCapture?: () => void;
  fieldUuid: string;
  value: any[];
  field: ControllerRenderProps<any, any>;
}

interface NurseryAffectedValue {
  nurseryName: string;
  nurseryUuid: string;
}

export const DisturbanceNurseryAffectedInput = ({
  onChangeCapture,
  fieldUuid,
  value: nurseryAffectedValue,
  field
}: DisturbanceNurseryAffectedInputProps) => {
  const t = useT();
  const projectUuid = useProjectFormDetails()?.uuid;
  const [, nurseriesData] = useConnection(indexNurseryConnection, {
    filter: { projectUuid: projectUuid },
    pageSize: 100,
    pageNumber: 1,
    sortField: "name",
    sortDirection: "ASC"
  });

  const nurseryChoices = useMemo(() => {
    if (nurseriesData == null || projectUuid == null || !("data" in nurseriesData) || nurseriesData.data == null)
      return [];

    return nurseriesData.data
      .filter((nursery: NurseryLightDto) => nursery.status === APPROVED)
      .map((nursery: NurseryLightDto) => ({
        title: nursery.name ?? `Nursery ${nursery.uuid}`,
        value: nursery.uuid
      }));
  }, [nurseriesData, projectUuid]);

  if (fieldUuid == null) {
    return null;
  }

  const fieldIndex = fieldUuid.match(/\[(\d+)\]/)?.[1];

  const currentNurseries = nurseryAffectedValue.find(f => f.name === "nursery-affected")?.value;
  const nurseriesArray = typeof currentNurseries === "string" ? JSON.parse(currentNurseries) : currentNurseries;
  const value = fieldIndex != null ? nurseriesArray[parseInt(fieldIndex)] : null;

  const _onChange = useCallback(
    (selectedValues: OptionValue[]) => {
      const selectedValue = selectedValues[0];

      if (selectedValue) {
        const selectedNursery = nurseryChoices.find(nursery => nursery.value === selectedValue);
        if (selectedNursery) {
          const nurseryData = {
            nurseryUuid: selectedNursery.value,
            nurseryName: selectedNursery.title
          };
          if (fieldIndex != null) {
            const newArray = [...(nurseriesArray ?? [])];
            newArray[parseInt(fieldIndex)] = nurseryData;

            const newValue = nurseryAffectedValue?.map(f => {
              if (f.name === "nursery-affected") {
                return { ...f, value: newArray };
              }

              return f;
            });
            field.onChange(newValue);
          }
        }
      } else {
        if (fieldIndex != null) {
          const newArray = [...(nurseriesArray ?? [])];
          newArray[parseInt(fieldIndex)] = "";
          const newValue = nurseryAffectedValue?.map(f => {
            if (f.name === "nursery-affected") {
              return { ...f, value: newArray };
            }

            return f;
          });

          field.onChange(newValue);
        }
      }
      onChangeCapture?.();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [nurseryChoices, fieldIndex, nurseriesArray, field.onChange, onChangeCapture, value?.nurseryUuid]
  );

  const dropdownValue = useMemo(() => {
    if (value?.nurseryUuid != null) {
      return [value.nurseryUuid];
    }
    return [];
  }, [value]);

  const optionsForDropdown = useMemo(() => {
    const currentSelectedUuid = value?.nurseryUuid != null ? String(value.nurseryUuid) : null;

    const selectedUuidsAcrossRows = new Set<string>(
      (Array.isArray(nurseriesArray) ? nurseriesArray : [])
        .map((n: NurseryAffectedValue) => n?.nurseryUuid)
        .filter((uuid: string) => uuid != null)
        .map((uuid: string) => String(uuid))
        .filter((uuid: string) => uuid !== currentSelectedUuid)
    );

    const selectedOptionForThisRow = currentSelectedUuid
      ? nurseryChoices.find(o => String(o.value) === currentSelectedUuid)
      : undefined;

    const availableOptions = nurseryChoices.filter(o => !selectedUuidsAcrossRows.has(String(o.value)));

    if (selectedOptionForThisRow) {
      const withoutDup = availableOptions.filter(o => String(o.value) !== currentSelectedUuid);
      return [selectedOptionForThisRow, ...withoutDup];
    }
    return availableOptions;
  }, [nurseryChoices, nurseriesArray, value?.nurseryUuid]);

  return (
    <Dropdown
      label={`Nursery ${fieldIndex != null ? parseInt(fieldIndex) + 1 : 1} Affected`}
      options={optionsForDropdown}
      value={dropdownValue}
      onChange={_onChange}
      placeholder={projectUuid ? "Search and select nurseries..." : "Please select a project first"}
      description={t(DISTURBANCE_NURSERY_AFFECTED_FIELD_DESCRIPTION)}
      className="w-full"
    />
  );
};
