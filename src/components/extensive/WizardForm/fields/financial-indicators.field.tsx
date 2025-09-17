import RHFFinancialIndicatorsDataTable from "@/components/elements/Inputs/FinancialTableInput/RHFFinancialIndicatorTable";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";

export const FinancialIndicatorsField: FormFieldFactory = {
  createValidator: () => undefined,

  renderInput: ({ years, collection }, sharedProps) => (
    <RHFFinancialIndicatorsDataTable
      {...sharedProps}
      formSubmissionOrg={formSubmissionOrg}
      years={years ?? undefined}
      model={collection ?? undefined}
    />
  )
};
