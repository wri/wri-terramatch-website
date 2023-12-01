import { V2OrganisationRead } from "@/generated/apiSchemas";
import { getSteps } from "@/pages/organization/[id]/components/edit/getEditOrganisationSteps";

export const orgProfileCompletionStatus = (
  org?: V2OrganisationRead | null
): { status: "empty" | "incomplete" | "complete"; progress: number } => {
  if (!org) return { status: "empty", progress: 0 };

  const attributeKeys = [];
  // Get list of all attributes existing on an org from org edit steps
  for (const step of getSteps((t: any) => t, "")) {
    for (const field of step.fields) {
      attributeKeys.push(field.name);
    }
  }

  for (const key of attributeKeys) {
    //@ts-ignore
    const value = org[key];
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return { status: "incomplete", progress: getOrgCompletionProgress(org, attributeKeys) };
    }
  }

  return { status: "complete", progress: 100 };
};

/**
 * to calculate completion percentage of an organisation
 * @param org V2OrganisationRead
 * @returns number between 0-100
 */
const getOrgCompletionProgress = (org: V2OrganisationRead, attributeKeys: string[]) => {
  const countAll = attributeKeys.length;
  let count = countAll;

  for (const key of attributeKeys) {
    //@ts-ignore
    const value = org[key];
    if (!value || (Array.isArray(value) && value.length === 0)) {
      count--;
    }
  }

  return Math.round((count / countAll) * 100);
};
