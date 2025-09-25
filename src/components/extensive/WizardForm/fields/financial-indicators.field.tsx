import RHFFinancialIndicatorsDataTable from "@/components/elements/Inputs/FinancialTableInput/RHFFinancialIndicatorTable";
import { FormFieldFactory } from "@/components/extensive/WizardForm/types";

export const FinancialIndicatorsField: FormFieldFactory = {
  createValidator: () => undefined,

  renderInput: ({ years, collection }, sharedProps) => (
    <RHFFinancialIndicatorsDataTable {...sharedProps} years={years ?? undefined} collection={collection ?? undefined} />
  ),

  getAnswer: () => undefined,

  appendAnswers: () => undefined
};
