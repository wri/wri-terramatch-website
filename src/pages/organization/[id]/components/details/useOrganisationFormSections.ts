import { useT } from "@transifex/react";
import { useMemo } from "react";

import { FormEntry } from "@/components/extensive/WizardForm/FormSummaryRow/types";

import { getMockOrganisationFormSections } from "./organizationDetails.mock";

export type OrganisationFormSection = {
  id: string;
  title: string;
  completed: boolean;
  entries: FormEntry[];
};

/**
 * The organization's form sections and their answers, shown on the Details tab and as the Overview set-up steps.
 *
 * TODO TM-4219: this is the single swap point for the Details data. Replace the mock with the organization's form
 * answers once the endpoint exists; the components only depend on the returned shape.
 */
export const useOrganisationFormSections = (): OrganisationFormSection[] => {
  const t = useT();

  return useMemo(() => getMockOrganisationFormSections(t), [t]);
};
