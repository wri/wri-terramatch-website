import { useT } from "@transifex/react";
import { useCallback } from "react";
import { FieldValues, useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import Accordion from "@/components/elements/Accordion/Accordion";
import Dropdown from "@/components/elements/Inputs/Dropdown/Dropdown";
import Input from "@/components/elements/Inputs/Input/Input";
import InputWrapper, { InputWrapperProps } from "@/components/elements/Inputs/InputElements/InputWrapper";
import { IconNames } from "@/components/extensive/Icon/Icon";
import { DisturbanceAffectedSites } from "@/components/extensive/WizardForm/DisturbanceAffectedSites";
import { useDisturbanceExtentOption } from "@/hooks/translation/useDisturbanceExtentOptions";
import { useDisturbanceOptions } from "@/hooks/translation/useDisturbanceOptions";
import { useDisturbancePropertyAffectedOptions } from "@/hooks/translation/useDisturbancePropertyAffectedOptions";
import useDisturbanceReportDescriptions from "@/hooks/translation/useDisturbanceReportDescriptions";
import { useIntensityOptions } from "@/hooks/translation/useIntensityOptions";
import { Option, OptionValue } from "@/types/common";

const parseJsonValue = (val: any, fieldName?: string) => {
  if (typeof val === "string" && val.startsWith("[") && val.endsWith("]")) {
    try {
      const parsed = JSON.parse(val);
      if (fieldName === "polygon-affected" && Array.isArray(parsed) && parsed.length > 0 && Array.isArray(parsed[0])) {
        return parsed[0];
      }
      return parsed;
    } catch (e) {
      return val;
    }
  }
  return val;
};

const convertToOptionValues = (stringArray: string[], options: Option[]) => {
  if (!Array.isArray(stringArray)) return [];
  return stringArray
    .map(str => options.find(opt => opt.value === str)?.value)
    .filter((value): value is string => value !== undefined);
};

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
}

const RHFDisturbanceReportEntries = ({
  onChangeCapture,
  formHook,
  ...props
}: RHFDisturbanceReportEntriesDataTableProps) => {
  const { field } = useController(props);
  const { value } = field;
  const t = useT();

  const {
    DISTURBANCE_END_DATE_FIELD_DESCRIPTION,
    DISTURBANCE_EXTEND_FIELD_DESCRIPTION,
    DISTURBANCE_INTENSITY_FIELD_DESCRIPTION,
    DISTURBANCE_MONETARY_DAMAGE_FIELD_DESCRIPTION,
    DISTURBANCE_PEOPLE_AFFECTED_FIELD_DESCRIPTION,
    DISTURBANCE_PROPERTY_AFFECTED_FIELD_DESCRIPTION,
    DISTURBANCE_START_DATE_FIELD_DESCRIPTION,
    DISTURBANCE_SUBTYPE_FIELD_DESCRIPTION,
    DISTURBANCE_TYPE_FIELD_DESCRIPTION
  } = useDisturbanceReportDescriptions();

  const DISTURBANCE_INTENSITY_OPTIONS = useIntensityOptions();
  const DISTURBANCE_EXTENT_OPTIONS = useDisturbanceExtentOption();
  const DISTURBANCE_PROPERTY_AFFECTED_OPTIONS = useDisturbancePropertyAffectedOptions();

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
    [value]
  );

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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const newValue = e.target.value;
    updateFieldValue(fieldName, newValue);
  };

  return (
    <InputWrapper {...props}>
      <Accordion title={t("Add Disturbance")} variant="tertiary" defaultOpen>
        <div className="border-light rounded-b-xl p-4">
          <div className="space-y-6">
            <Dropdown
              placeholder={t("Select here")}
              label={t("Disturbance Type")}
              required
              description={DISTURBANCE_TYPE_FIELD_DESCRIPTION}
              options={disturbanceTypeOptions}
              value={getFieldValue("disturbance-type") != null ? [getFieldValue("disturbance-type")] : []}
              onChange={handleDisturbanceTypeChange}
            />

            <Dropdown
              placeholder={t("Select here")}
              label={t("Disturbance Subtype")}
              required
              description={DISTURBANCE_SUBTYPE_FIELD_DESCRIPTION}
              options={disturbanceSubtypeOptions}
              multiSelect
              value={convertToOptionValues(getFieldValue("disturbance-subtype") ?? [], disturbanceSubtypeOptions)}
              onChange={handleDisturbanceSubtypeChange}
              className="!h-auto min-h-[40px]"
              titleClassname="!whitespace-normal !break-words"
            />
            <Dropdown
              placeholder={t("Select here")}
              label={t("Intensity")}
              required
              description={DISTURBANCE_INTENSITY_FIELD_DESCRIPTION}
              options={DISTURBANCE_INTENSITY_OPTIONS}
              value={getFieldValue("intensity") != null ? [getFieldValue("intensity")] : []}
              onChange={handleIntensityChange}
            />
            <div className="grid grid-cols-2 gap-x-10 gap-y-10">
              <div>
                <Dropdown
                  placeholder={t("Select here")}
                  label={t("Extent")}
                  required
                  description={DISTURBANCE_EXTEND_FIELD_DESCRIPTION}
                  options={DISTURBANCE_EXTENT_OPTIONS}
                  value={getFieldValue("extent") != null ? [getFieldValue("extent")] : []}
                  onChange={handleExtentChange}
                />
              </div>
              <div>
                <Input
                  type="number"
                  name="people-affected"
                  placeholder={t("Enter number")}
                  label={t("People Affected")}
                  required
                  description={DISTURBANCE_PEOPLE_AFFECTED_FIELD_DESCRIPTION}
                  value={getFieldValue("people-affected") ?? ""}
                  onChange={handlePeopleAffectedChange}
                />
              </div>
              <div>
                <Input
                  type="number"
                  name="monetary-damage"
                  placeholder={t("Enter amount")}
                  label={t("Monetary Damage (USD)")}
                  required
                  description={DISTURBANCE_MONETARY_DAMAGE_FIELD_DESCRIPTION}
                  value={getFieldValue("monetary-damage") ?? ""}
                  onChange={handleMonetaryDamageChange}
                  className="pl-8"
                  iconButtonPropsLeft={{
                    iconProps: {
                      name: IconNames.DOLLAR_SIGN,
                      className: "fill-neutral-700"
                    }
                  }}
                />
              </div>
              <div>
                <Dropdown
                  placeholder={t("Select here")}
                  label={t("Property Affected")}
                  required
                  description={DISTURBANCE_PROPERTY_AFFECTED_FIELD_DESCRIPTION}
                  options={DISTURBANCE_PROPERTY_AFFECTED_OPTIONS}
                  multiSelect
                  value={convertToOptionValues(
                    getFieldValue("property-affected") ?? [],
                    DISTURBANCE_PROPERTY_AFFECTED_OPTIONS
                  )}
                  onChange={handlePropertyAffectedChange}
                  className="!h-auto min-h-[40px]"
                  titleClassname="!whitespace-normal !break-words"
                />
              </div>
              <div>
                <Input
                  lang="en-GB"
                  type="date"
                  name="disturbance-start-date"
                  placeholder={t("Select date")}
                  label={t("Disturbance Start Date")}
                  required
                  description={DISTURBANCE_START_DATE_FIELD_DESCRIPTION}
                  value={getFieldValue("disturbance-start-date") ?? ""}
                  onChange={e => handleDateChange(e, "disturbance-start-date")}
                />
              </div>
              <div>
                <Input
                  lang="en-GB"
                  type="date"
                  name="disturbance-end-date"
                  placeholder={t("Select date")}
                  label={t("Disturbance End Date")}
                  required
                  description={DISTURBANCE_END_DATE_FIELD_DESCRIPTION}
                  value={getFieldValue("disturbance-end-date") ?? ""}
                  onChange={e => handleDateChange(e, "disturbance-end-date")}
                />
              </div>
            </div>
            <div className="col-span-2 w-full border-t border-black border-opacity-12" />

            <DisturbanceAffectedSites onChange={onChangeCapture} field={field} value={value!} />
          </div>
        </div>
      </Accordion>
    </InputWrapper>
  );
};

export { RHFDisturbanceReportEntries };
