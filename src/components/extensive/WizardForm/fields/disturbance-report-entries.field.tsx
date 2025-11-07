import { RHFDisturbanceReportEntries } from "@/components/elements/Inputs/DataTable/RHFDisturbanceReportEntries";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { formatOptions } from "@/constants/options/disturbanceReports";
import { addValidationWith, arrayValidator } from "@/utils/yup";

export const DisturbanceReportEntriesField: FormFieldFactory = {
  addValidation: addValidationWith(arrayValidator),

  renderInput: ({ name }, sharedProps) => <RHFDisturbanceReportEntries inputId={name} {...sharedProps} />,

  addFormEntries: (entries, field, formValues, { t }) => {
    const rawValue = formValues?.[field.name];
    const modValue = rawValue?.map((v: any) => {
      const parsedValue =
        typeof v.value === "string" && v.value.startsWith("[") && v.value.endsWith("]") ? JSON.parse(v.value) : v.value;
      if (v.name == "site-affected") {
        const valueArray = parsedValue;
        if (Array.isArray(valueArray) && valueArray.length > 0) {
          const sitesAffectedArray = valueArray.map((site: any) => `-${site?.siteName ?? ""}.`);
          return `${v.title}:<br/> ${sitesAffectedArray.join("<br/>")}`;
        }
        return `${v.title}: ${t("Answer Not Provided")}`;
      } else if (v.name == "polygon-affected") {
        const valueArray = parsedValue;
        if (Array.isArray(valueArray) && valueArray.length > 0) {
          return `${v.title}:<br/> ${valueArray
            .map((batch: any) => {
              const batchPolygons = batch.map((p: any) => p?.polyName ?? "").join(", ");
              return `-${batchPolygons}.`;
            })
            .join("<br/>")}`;
        }
        return `${v.title}: ${t("Answer Not Provided")}`;
      }

      if (v.name === "disturbance-subtype" || v.name === "property-affected") {
        if (Array.isArray(parsedValue)) {
          return `${v.title}: ${formatOptions(parsedValue).join(", ")}`;
        }
      }

      if (v.name === "intensity" || v.name === "disturbance-type") {
        return `${v.title}: ${formatOptions(v.value ?? "")}`;
      }

      if (v.name === "monetary-damage") {
        return `${v.title}: ${v.value ? `$${Number(v.value)}` : t("Answer Not Provided")}`;
      }

      return `${v.title}: ${v.value ?? t("Answer Not Provided")}`;
    });

    entries.push({
      title: field.label,
      inputType: field.inputType,
      value: modValue?.join("<br/>") ?? t("Answer Not Provided")
    });
  }
};
