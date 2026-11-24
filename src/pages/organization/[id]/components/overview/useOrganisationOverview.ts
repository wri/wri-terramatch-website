import { useMemo } from "react";

import { OrganisationFullDto } from "@/generated/v3/userService/userServiceSchemas";

import { useOrganisationFormSections } from "../details/useOrganisationFormSections";
import { MOCK_LATEST_FINANCIAL_REPORT, MOCK_ORGANISATION_PROJECTS } from "./organizationOverview.mock";
import { OrganisationLatestFinancialReport, OrganisationProjectTotals, OrganisationSetUpStep } from "./types";

export type OrganisationOverview = {
  description: string | null;
  type: string | null;
  projects: OrganisationProjectTotals[];
  /** `null` when the organization has no financial report yet. */
  latestFinancialReport: OrganisationLatestFinancialReport | null;
  setUpSteps: OrganisationSetUpStep[];
};

/**
 * Everything the Overview tab renders, in one place.
 *
 * `description` and `type` already come from the organization. TODO TM-4219: `projects` and
 * `latestFinancialReport` are mocked until their endpoints exist; this hook is the single swap point, so the
 * Overview components don't need to change when they are connected.
 */
export const useOrganisationOverview = (organization?: OrganisationFullDto): OrganisationOverview => {
  const formSections = useOrganisationFormSections();

  const setUpSteps = useMemo(
    () => formSections.map(({ id, title, completed }) => ({ id, title, completed })),
    [formSections]
  );

  return useMemo(
    () => ({
      description: organization?.description ?? null,
      type: organization?.type ?? null,
      projects: MOCK_ORGANISATION_PROJECTS,
      latestFinancialReport: MOCK_LATEST_FINANCIAL_REPORT,
      setUpSteps
    }),
    [organization?.description, organization?.type, setUpSteps]
  );
};
