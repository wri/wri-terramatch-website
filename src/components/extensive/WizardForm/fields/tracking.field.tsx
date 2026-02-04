import * as yup from "yup";

import RHFTrackingTable from "@/components/elements/Inputs/TrackingInput/RHFTrackingTable";
import { calculateTotals } from "@/components/extensive/TrackingCollapseGrid/hooks";
import TrackingCollapseGrid from "@/components/extensive/TrackingCollapseGrid/TrackingCollapseGrid";
import { GRID_VARIANT_NARROW } from "@/components/extensive/TrackingCollapseGrid/TrackingVariant";
import { isDemographicType, TrackingDomain, TrackingType } from "@/components/extensive/TrackingCollapseGrid/types";
import { addEntryWith } from "@/components/extensive/WizardForm/FormSummaryRow/types";
import { FieldInputType, FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { Framework } from "@/context/framework.provider";
import { TrackingEntryDto } from "@/generated/v3/entityService/entityServiceSchemas";
import Log from "@/utils/log";
import { addValidationWith } from "@/utils/yup";

const getDomain = (inputType: FieldInputType): TrackingDomain => {
  // TODO this will get more sophisticated as we add restoration
  const domain = isDemographicType(inputType) ? "demographics" : null;
  if (domain == null) {
    Log.error("Invalid type for tracking field, defaulting to demographics", { inputType });
    return "demographics";
  }

  return domain;
};

export const TrackingField: FormFieldFactory = {
  addValidation: addValidationWith(({ inputType }, t, framework) => {
    const type = inputType as TrackingType;
    return yup
      .array()
      .min(0)
      .max(1)
      .of(
        yup.object({
          collection: yup.string().required(),
          entries: yup
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
        () => (framework === Framework.HBF ? t("At least one entry in gender is required") : ""),
        value => {
          const { entries } = value != null && value.length > 0 ? value[0] : ({} as NonNullable<typeof value>[number]);
          if (entries == null) return true;

          return calculateTotals(entries as TrackingEntryDto[], framework, type).complete;
        }
      );
  }),

  renderInput: ({ inputType, collection }, sharedProps) => {
    return (
      <RHFTrackingTable
        {...sharedProps}
        domain={getDomain(inputType)}
        trackingType={inputType as TrackingType}
        collection={collection ?? ""}
      />
    );
  },

  getAnswer: () => undefined,

  appendAnswers: () => undefined,

  addFormEntries: addEntryWith(({ name, inputType }, formValues) => {
    const entries = ((formValues[name]?.[0] ?? {}).entries ?? []) as TrackingEntryDto[];
    return (
      <TrackingCollapseGrid
        domain={getDomain(inputType)}
        type={inputType as TrackingType}
        entries={entries}
        variant={GRID_VARIANT_NARROW}
      />
    );
  }),

  formBuilderDefaults: ({ collection }) => ({ collection })
};
