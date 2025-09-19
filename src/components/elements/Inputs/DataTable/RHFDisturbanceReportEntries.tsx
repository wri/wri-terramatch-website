import { useCallback } from "react";
import { FieldValues, useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import Accordion from "@/components/elements/Accordion/Accordion";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import Input from "@/components/elements/Inputs/Input/Input";
import InputWrapper, { InputWrapperProps } from "@/components/elements/Inputs/InputElements/InputWrapper";
import { DisturbanceAffectedSites } from "@/components/extensive/WizardForm/DisturbanceAffectedSites";
import {
  DISTURBANCE_EXTENT_OPTIONS,
  DISTURBANCE_INTENSITY_OPTIONS,
  DISTURBANCE_PROPERTY_AFFECTED_OPTIONS
} from "@/constants/options/disturbanceReports";
import { useDisturbanceOptions } from "@/hooks/useDisturbanceOptions";
import { Option, OptionValue } from "@/types/common";

export interface RHFDisturbanceReportEntriesProps extends InputWrapperProps {
  inputId?: string;
  containerClassName?: string;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
  required?: boolean;
  value?: string;
  onChange: (value: string) => void;
  feedbackRequired?: boolean;
  formHook: UseFormReturn<FieldValues, any>;
}

export interface RHFDisturbanceReportEntriesDataTableProps
  extends Omit<RHFDisturbanceReportEntriesProps, "defaultValue" | "value" | "onChange">,
    UseControllerProps {
  onChangeCapture?: () => void;
  optionsFilterFieldName?: string;
  formHook: UseFormReturn<FieldValues, any>;
  projectUuid?: string;
}

const RHFDisturbanceReportEntries = ({
  onChangeCapture,
  formHook,
  projectUuid,
  ...props
}: RHFDisturbanceReportEntriesDataTableProps) => {
  const { field } = useController(props);
  const { value } = field;

  const updateFieldValue = useCallback(
    (fieldName: string, newValue: any) => {
      if (!Array.isArray(value)) {
        return;
      }

      const updatedValue = value?.map(field => {
        if (field.name === fieldName) {
          return { ...field, value: newValue };
        }
        return field;
      });
      field.onChange(updatedValue);
      onChangeCapture?.();
    },
    [value, field, onChangeCapture]
  );

  const parseJsonValue = useCallback((val: any, fieldName?: string) => {
    if (typeof val === "string" && val.startsWith("[") && val.endsWith("]")) {
      try {
        const parsed = JSON.parse(val);
        if (
          fieldName === "polygon-affected" &&
          Array.isArray(parsed) &&
          parsed.length > 0 &&
          Array.isArray(parsed[0])
        ) {
          return parsed[0];
        }
        return parsed;
      } catch (e) {
        return val;
      }
    }
    return val;
  }, []);

  const getFieldValue = useCallback(
    (fieldName: string) => {
      if (!Array.isArray(value)) {
        return null;
      }

      const field = value?.find(f => f.name === fieldName);
      const rawValue = field?.value ?? null;

      if (
        fieldName === "site-affected" ||
        fieldName === "polygon-affected" ||
        fieldName === "disturbance-subtype" ||
        fieldName === "property-affected"
      ) {
        return parseJsonValue(rawValue, fieldName);
      }

      return rawValue;
    },
    [value, parseJsonValue]
  );

  const convertToOptionValues = useCallback((stringArray: string[], options: Option[]) => {
    if (!Array.isArray(stringArray)) return [];
    return stringArray
      .map(str => options.find(opt => opt.value === str)?.value)
      .filter((value): value is string => value !== undefined);
  }, []);

  const disturbanceTypeOptions = useDisturbanceOptions("type");
  const currentDisturbanceType = getFieldValue("disturbance-type");

  const mockFormHook = {
    watch: (fieldName: string) => {
      if (fieldName === "disturbance-type") {
        return currentDisturbanceType;
      }
      return undefined;
    }
  } as UseFormReturn;

  const disturbanceSubtypeOptions = useDisturbanceOptions("subtype", mockFormHook, "disturbance-type");

  const handleDisturbanceTypeChange = useCallback(
    (selectedValues: OptionValue[]) => {
      const newValue = selectedValues[0] ?? null;

      if (!Array.isArray(value)) {
        return;
      }

      const updatedValue = value.map(field => {
        if (field.name === "disturbance-type") {
          return { ...field, value: newValue };
        }
        if (field.name === "disturbance-subtype") {
          return { ...field, value: [] };
        }
        return field;
      });

      field.onChange(updatedValue);
      onChangeCapture?.();
    },
    [value, field, onChangeCapture]
  );

  const handleDisturbanceSubtypeChange = useCallback(
    (selectedValues: OptionValue[]) => {
      updateFieldValue("disturbance-subtype", selectedValues);
    },
    [updateFieldValue]
  );

  const handleIntensityChange = useCallback(
    (selectedValues: OptionValue[]) => {
      const newValue = selectedValues[0] || null;
      updateFieldValue("intensity", newValue);
    },
    [updateFieldValue]
  );

  const handleExtentChange = useCallback(
    (selectedValues: OptionValue[]) => {
      const newValue = selectedValues[0] || null;
      updateFieldValue("extent", newValue);
    },
    [updateFieldValue]
  );

  const handlePropertyAffectedChange = useCallback(
    (selectedValues: OptionValue[]) => {
      updateFieldValue("property-affected", selectedValues);
    },
    [updateFieldValue]
  );

  const handlePeopleAffectedChange = useCallback(
    (e: any) => {
      const newValue = e.target.value;
      updateFieldValue("people-affected", newValue);
    },
    [updateFieldValue]
  );

  const handleMonetaryDamageChange = useCallback(
    (e: any) => {
      const newValue = e.target.value;
      updateFieldValue("monetary-damage", newValue);
    },
    [updateFieldValue]
  );

  const handleDateChange = useCallback(
    (e: any) => {
      const newValue = e.target.value;
      updateFieldValue("date-of-disturbance", newValue);
    },
    [updateFieldValue]
  );

  return (
    <InputWrapper {...props}>
      <Accordion title="Add Disturbance" variant="tertiary" defaultOpen>
        <div className="border-light rounded-b-xl p-4">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-x-10 gap-y-10">
              <div>
                <Dropdown
                  placeholder="Select here"
                  label="Disturbance Type"
                  required
                  options={disturbanceTypeOptions}
                  value={getFieldValue("disturbance-type") ? [getFieldValue("disturbance-type")] : []}
                  onChange={handleDisturbanceTypeChange}
                />
              </div>
              <div>
                <Dropdown
                  placeholder="Select here"
                  label="Disturbance Subtype"
                  required
                  options={disturbanceSubtypeOptions}
                  multiSelect
                  value={convertToOptionValues(getFieldValue("disturbance-subtype") || [], disturbanceSubtypeOptions)}
                  onChange={handleDisturbanceSubtypeChange}
                />
              </div>
              <div>
                <Dropdown
                  placeholder="Select here"
                  label="Intensity"
                  required
                  options={DISTURBANCE_INTENSITY_OPTIONS}
                  value={getFieldValue("intensity") ? [getFieldValue("intensity")] : []}
                  onChange={handleIntensityChange}
                />
              </div>
              <div>
                <Dropdown
                  placeholder="Select here"
                  label="Extent"
                  required
                  options={DISTURBANCE_EXTENT_OPTIONS}
                  value={getFieldValue("extent") ? [getFieldValue("extent")] : []}
                  onChange={handleExtentChange}
                />
              </div>
              <div>
                <Input
                  type="number"
                  name="people-affected"
                  placeholder="Enter number"
                  label="People Affected"
                  required
                  value={getFieldValue("people-affected") ?? ""}
                  onChange={handlePeopleAffectedChange}
                />
              </div>
              <div>
                <Input
                  type="number"
                  name="monetary-damage"
                  placeholder="Enter amount"
                  label="Monetary Damage"
                  required
                  value={getFieldValue("monetary-damage") ?? ""}
                  onChange={handleMonetaryDamageChange}
                />
              </div>
              <div>
                <Dropdown
                  placeholder="Select here"
                  label="Property Affected"
                  required
                  options={DISTURBANCE_PROPERTY_AFFECTED_OPTIONS}
                  multiSelect
                  value={convertToOptionValues(
                    getFieldValue("property-affected") ?? [],
                    DISTURBANCE_PROPERTY_AFFECTED_OPTIONS
                  )}
                  onChange={handlePropertyAffectedChange}
                />
              </div>
              <div>
                <Input
                  type="date"
                  name="date-of-disturbance"
                  placeholder="Select date"
                  label="Date of Disturbance"
                  required
                  value={getFieldValue("date-of-disturbance") || ""}
                  onChange={handleDateChange}
                />
              </div>
            </div>
            <div className="col-span-2 w-full border-t border-black border-opacity-12" />

            <DisturbanceAffectedSites
              onChange={onChangeCapture}
              field={field}
              value={value!}
              projectUuid={projectUuid}
            />
          </div>
        </div>
      </Accordion>
    </InputWrapper>
  );
};

export { RHFDisturbanceReportEntries };
