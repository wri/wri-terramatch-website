import * as yup from "yup";

import RHFDemographicsTable from "@/components/elements/Inputs/DemographicsInput/RHFDemographicsTable";
import DemographicsCollapseGrid from "@/components/extensive/DemographicsCollapseGrid/DemographicsCollapseGrid";
import { GRID_VARIANT_NARROW } from "@/components/extensive/DemographicsCollapseGrid/DemographicVariant";
import { calculateTotals } from "@/components/extensive/DemographicsCollapseGrid/hooks";
import { DemographicType } from "@/components/extensive/DemographicsCollapseGrid/types";
import { addEntryWith } from "@/components/extensive/WizardForm/FormSummaryRow/types";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { Framework } from "@/context/framework.provider";
import { DemographicEntryDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { addValidationWith } from "@/utils/yup";

export const DemographicField: FormFieldFactory = {
  addValidation: addValidationWith(({ validation, inputType }, t, framework) => {
    const type = inputType as DemographicType;
    const validator = yup
      .array()
      .min(0)
      .max(1)
      .of(
        yup.object({
          collection: yup.string().required(),
          demographics: yup
            .array()
            .of(
              yup.object({
                type: yup.string().required(),
                subtype: yup.string().nullable(),
                name: yup.string().nullable(),
                amount: yup.number()
              })
            )
            .required()
        })
      )
      .test(
        "totals-match",
        () =>
          framework === Framework.HBF
            ? t("At least one entry in gender is required")
            : t("The totals for each demographic type do not match"),
        value => {
          const { demographics } =
            value != null && value.length > 0 ? value[0] : ({} as NonNullable<typeof value>[number]);
          if (demographics == null) return true;

          return calculateTotals(demographics as DemographicEntryDto[], framework, type).complete;
        }
      );

    return validation?.required === true ? validator.required() : validator;
  }),

  renderInput: ({ inputType, collection }, sharedProps) => (
    <RHFDemographicsTable
      {...sharedProps}
      demographicType={inputType as DemographicType}
      collection={collection ?? ""}
    />
  ),

  getAnswer: () => undefined,

  appendAnswers: () => undefined,

  addFormEntries: addEntryWith(({ name, inputType }, formValues) => {
    const entries = ((formValues[name]?.[0] ?? {}).demographics ?? []) as DemographicEntryDto[];
    return (
      <DemographicsCollapseGrid type={inputType as DemographicType} entries={entries} variant={GRID_VARIANT_NARROW} />
    );
  }),

  formBuilderDefaults: ({ collection }) => ({ collection })
};
