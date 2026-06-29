import { Dictionary } from "lodash";
import * as yup from "yup";

import TrackingAdditionalOptions from "@/admin/modules/form/components/FormBuilder/AdditionalOptions/TrackingAdditionalOptions";
import RHFTrackingTable from "@/components/elements/Inputs/TrackingInput/RHFTrackingTable";
import { calculateTotals } from "@/components/extensive/TrackingCollapseGrid/hooks";
import TrackingCollapseGrid from "@/components/extensive/TrackingCollapseGrid/TrackingCollapseGrid";
import { GRID_VARIANT_NARROW } from "@/components/extensive/TrackingCollapseGrid/TrackingVariant";
import {
  getDefaultEntryConfigs,
  isDemographicType,
  isRestorationType,
  TrackingDomain,
  TrackingEntryConfig,
  TrackingType
} from "@/components/extensive/TrackingCollapseGrid/types";
import { addEntryWith } from "@/components/extensive/WizardForm/FormSummaryRow/types";
import { FieldInputType, FormFieldFactory } from "@/components/extensive/WizardForm/types";
import { Framework } from "@/context/framework.provider";
import { TrackingEntryDto } from "@/generated/v3/entityService/entityServiceSchemas";
import Log from "@/utils/log";
import { addValidationWith } from "@/utils/yup";

const getDomain = (inputType: FieldInputType): TrackingDomain => {
  const domain = isDemographicType(inputType)
    ? "demographics"
    : isRestorationType(inputType)
    ? "restoration"
    : undefined;
  if (domain == null) {
    Log.error("Invalid type for tracking field, defaulting to demographics", { inputType });
    return "demographics";
  }

  return domain;
};

const getEntryConfigs = (
  additionalProps: Dictionary<any> | null | undefined,
  domain: TrackingDomain,
  type: TrackingType,
  framework: Framework
) =>
  Array.isArray(additionalProps?.entryConfigs) && (additionalProps?.entryConfigs as TrackingEntryConfig[]).length > 0
    ? (additionalProps?.entryConfigs as TrackingEntryConfig[])
    : getDefaultEntryConfigs(domain, type, framework);

export const TrackingField: FormFieldFactory = {
  addValidation: addValidationWith(({ inputType, additionalProps }, t, framework) => {
    const domain = getDomain(inputType);
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
        () =>
          framework === Framework.HBF && domain === "demographics" ? t("At least one entry in gender is required") : "",
        value => {
          const { entries } = value != null && value.length > 0 ? value[0] : ({} as NonNullable<typeof value>[number]);
          if (entries == null) return true;

          return calculateTotals(
            getEntryConfigs(additionalProps, domain, type, framework),
            entries as TrackingEntryDto[]
          ).complete;
        }
      );
  }),

  renderInput: ({ inputType, collection, additionalProps }, sharedProps) => {
    return (
      <RHFTrackingTable
        {...sharedProps}
        entryConfigs={additionalProps?.entryConfigs}
        domain={getDomain(inputType)}
        trackingType={inputType as TrackingType}
        collection={collection ?? ""}
      />
    );
  },

  getAnswer: () => undefined,

  appendAnswers: () => undefined,

  addFormEntries: addEntryWith(({ name, inputType, additionalProps }, formValues) => {
    const entries = ((formValues[name]?.[0] ?? {}).entries ?? []) as TrackingEntryDto[];
    return (
      <TrackingCollapseGrid
        entryConfigs={additionalProps?.entryConfigs}
        domain={getDomain(inputType)}
        type={inputType as TrackingType}
        entries={entries}
        variant={GRID_VARIANT_NARROW}
      />
    );
  }),

  formBuilderAdditionalOptions: ({ field, getSource }) => {
    const type = field.inputType as TrackingType;
    const domain = getDomain(type);
    return <TrackingAdditionalOptions {...{ type, domain, getSource }} />;
  },

  formBuilderDefaults: ({ collection }) => ({ collection })
};
