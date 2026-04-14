import cn from "classnames";
import { isNumber } from "lodash";
import { type FC, useCallback, useEffect, useId, useState } from "react";
import { useController } from "react-hook-form";
import * as yup from "yup";

import Input from "@/components/elements/Inputs/Input/Input";
import InputWrapper from "@/components/elements/Inputs/InputElements/InputWrapper";
import { FormFieldFactory, SharedFieldProps } from "@/components/extensive/WizardForm/types";
import { getFormattedAnswer } from "@/components/extensive/WizardForm/utils";
import { useCurrencyContext } from "@/context/currency.provider";
import { useWizardOrgFormDetails } from "@/context/wizardForm.provider";
import {
  formatFinancialAmount,
  parseFinancialAmountInput,
  shouldFormatFinancialNumberField
} from "@/utils/financialReport";
import { addValidationWith } from "@/utils/yup";

function formatFinancialDisplayValue(value: unknown, currencyCode: string | undefined): string {
  if (value == null || value === "") {
    return "";
  }
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) {
    return "";
  }
  return formatFinancialAmount(n, currencyCode);
}

/** Locale-aware amount input for wizard number fields; keeps RHF value as a number for the API. */
const FinancialAmountInput: FC<SharedFieldProps> = props => {
  const { name, control, error, label, required, placeholder, description, feedbackRequired } = props;
  const id = useId();
  const { currency } = useCurrencyContext();
  const orgDetails = useWizardOrgFormDetails();
  const isoCurrency =
    currency != null && currency !== ""
      ? String(currency)
      : orgDetails?.currency != null && orgDetails.currency !== ""
      ? String(orgDetails.currency)
      : undefined;

  const { field } = useController({ name, control });

  const [text, setText] = useState(() => formatFinancialDisplayValue(field.value, isoCurrency));

  useEffect(() => {
    setText(formatFinancialDisplayValue(field.value, isoCurrency));
  }, [field.value, isoCurrency]);

  const inputClasses = cn(
    "w-full outline-none transition-all duration-300 ease-in-out focus:ring-transparent",
    "px-3 py-[9px] rounded-lg focus:border-primary-500",
    "border border-neutral-200",
    { ["border border-error focus:border-error"]: error != null }
  );

  const commit = useCallback(() => {
    const trimmed = text.trim();
    if (trimmed === "") {
      field.onChange(undefined);
      return;
    }
    const parsed = parseFinancialAmountInput(trimmed, isoCurrency);
    if (parsed === null) {
      setText(formatFinancialDisplayValue(field.value, isoCurrency));
      return;
    }
    field.onChange(parsed);
  }, [text, isoCurrency, field]);

  const onBlur = useCallback(() => {
    commit();
    field.onBlur();
  }, [commit, field]);

  return (
    <InputWrapper
      inputId={id}
      label={label}
      description={description}
      error={error}
      required={required}
      feedbackRequired={feedbackRequired}
    >
      <input
        id={id}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        placeholder={placeholder}
        className={inputClasses}
        value={text}
        onChange={e => setText(e.target.value)}
        onBlur={onBlur}
        aria-invalid={error != null}
        aria-errormessage={error?.message}
        aria-describedby={`${id}-description`}
      />
    </InputWrapper>
  );
};

export const NumberField: FormFieldFactory = {
  addValidation: addValidationWith((field, _t, _framework) => {
    const { validation, linkedFieldKey } = field;
    if (linkedFieldKey?.includes("-lat-") || linkedFieldKey?.includes("-long-")) {
      return yup
        .number()
        .transform((value, originalValue) => (originalValue === "" || originalValue == null ? undefined : value))
        .test("coordinates-validation", function (value) {
          if (value == null) return true;
          if (linkedFieldKey?.includes("-lat-") && (value < -90 || value > 90)) {
            return this.createError({
              message: "Latitude must be between -90 and 90 degrees"
            });
          }
          if (linkedFieldKey?.includes("-long-") && (value < -180 || value > 180)) {
            return this.createError({
              message: "Longitude must be between -180 and 180 degrees"
            });
          }
          if (!/^-?\d+(\.\d{1,2})?$/.test(`${value}`)) {
            return this.createError({ message: "Maximum 2 decimal places are allowed" });
          }
          return true;
        });
    }

    if (shouldFormatFinancialNumberField(field)) {
      let validator = yup
        .number()
        .transform((value, originalValue) => (originalValue === "" || originalValue == null ? undefined : value));
      if (isNumber(validation?.min)) validator = validator.min(validation?.min!);
      if (isNumber(validation?.max)) validator = validator.max(validation?.max!);
      return validator;
    }

    let validator = yup.number();
    if (isNumber(validation?.min)) validator = validator.min(validation?.min!);
    if (isNumber(validation?.max)) validator = validator.max(validation?.max!);
    return validator;
  }),

  renderInput: (field, sharedProps) => {
    const { linkedFieldKey, additionalProps } = field;
    if (linkedFieldKey?.includes("-lat-")) {
      return <Input {...sharedProps} type="number" min={-90} max={90} allowNegative />;
    }
    if (linkedFieldKey?.includes("-long-")) {
      return <Input {...sharedProps} type="number" min={-180} max={180} allowNegative />;
    }
    if (shouldFormatFinancialNumberField(field)) {
      return <FinancialAmountInput {...sharedProps} />;
    }
    return <Input {...sharedProps} type="number" step={additionalProps?.step} />;
  },

  addFormEntries: (entries, field, formValues, additional) => {
    const nullText = additional.nullText ?? additional.t("Answer Not Provided");
    if (shouldFormatFinancialNumberField(field)) {
      const raw = formValues[field.name];
      const num = typeof raw === "number" ? raw : raw == null || raw === "" ? NaN : Number(raw);
      const display = Number.isFinite(num) ? formatFinancialAmount(num, additional.orgDetails?.currency) : nullText;
      entries.push({
        title: field.label ?? "",
        inputType: field.inputType,
        value: display
      });
      return;
    }
    const formatted = getFormattedAnswer(field, formValues, additional.fieldsProvider);
    const value =
      formatted == null || formatted === "" ? nullText : typeof formatted === "string" ? formatted : String(formatted);
    entries.push({
      title: field.label ?? "",
      inputType: field.inputType,
      value
    });
  },

  normalizeValue: (field, formValues) => {
    if (shouldFormatFinancialNumberField(field)) {
      return formValues;
    }
    const { name, validation } = field;
    const value = formValues[name];
    formValues[name] = value == null && (validation?.min ?? 0) < 0 ? value : Number(value);
    return formValues;
  }
};
