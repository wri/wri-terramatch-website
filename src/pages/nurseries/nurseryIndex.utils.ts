import { APPROVED, PENDING_APPROVAL } from "@/constants/statuses";
import type { NurseryLightDto, ProjectLightDto } from "@/generated/v3/entityService/entityServiceSchemas";

import type { NurseryIndexProjectSection, NurseryIndexRow } from "./nurseryIndex.types";

type NurseryWithProjectUuid = NurseryLightDto & { projectUuid?: string | null };

const normalize = (value?: string | null) => value?.trim().toLocaleLowerCase() ?? "";

const getProjectMatch = (nursery: NurseryWithProjectUuid, projects: ProjectLightDto[]) => {
  if (nursery.projectUuid != null) {
    const projectByUuid = projects.find(project => project.uuid === nursery.projectUuid);
    if (projectByUuid != null) return projectByUuid;
  }

  const projectName = normalize(nursery.projectName);
  const candidates = projects.filter(project => normalize(project.name) === projectName);
  if (candidates.length <= 1) return candidates[0];

  const organisationUuidMatches = candidates.filter(
    project =>
      nursery.organisationUuid != null &&
      project.organisationUuid != null &&
      project.organisationUuid === nursery.organisationUuid
  );
  if (organisationUuidMatches.length === 1) return organisationUuidMatches[0];

  const organisationNameMatches = candidates.filter(
    project =>
      normalize(nursery.organisationName) !== "" &&
      normalize(project.organisationName) === normalize(nursery.organisationName)
  );
  return organisationNameMatches.length === 1 ? organisationNameMatches[0] : undefined;
};

const getFallbackSectionId = (nursery: NurseryLightDto) =>
  [nursery.organisationUuid ?? normalize(nursery.organisationName), normalize(nursery.projectName)].join(":");

export const buildNurseryProjectSections = (
  nurseries: NurseryLightDto[],
  projects: ProjectLightDto[]
): NurseryIndexProjectSection[] => {
  const sectionsById = new Map<string, NurseryIndexProjectSection>();

  nurseries.forEach(nursery => {
    const project = getProjectMatch(nursery, projects);
    const sectionId = project?.uuid ?? getFallbackSectionId(nursery);
    const row: NurseryIndexRow = {
      ...nursery,
      id: nursery.uuid,
      projectUuid: project?.uuid ?? (nursery as NurseryWithProjectUuid).projectUuid ?? null,
      projectFrameworkKey: project?.frameworkKey ?? nursery.frameworkKey
    };
    const existingSection = sectionsById.get(sectionId);

    if (existingSection != null) {
      existingSection.nurseries.push(row);
      return;
    }

    sectionsById.set(sectionId, {
      id: sectionId,
      projectUuid: row.projectUuid,
      projectName: project?.name ?? nursery.projectName ?? "Project",
      organisationName: project?.organisationName ?? nursery.organisationName,
      frameworkKey: row.projectFrameworkKey,
      nurseries: [row]
    });
  });

  return Array.from(sectionsById.values())
    .map(section => ({
      ...section,
      nurseries: [...section.nurseries].sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
    }))
    .sort((a, b) => a.projectName.localeCompare(b.projectName));
};

export const filterNurseryProjectSections = (
  sections: NurseryIndexProjectSection[],
  query: string,
  projectId?: string,
  statuses: string[] = []
) => {
  const normalizedQuery = normalize(query);

  return sections
    .filter(section => projectId == null || section.projectUuid === projectId)
    .map(section => {
      const projectMatches = [section.projectName, section.organisationName].some(value =>
        normalize(value).includes(normalizedQuery)
      );

      return {
        ...section,
        nurseries: section.nurseries.filter(nursery => {
          const matchesStatus = statuses.length === 0 || (nursery.status != null && statuses.includes(nursery.status));
          const matchesQuery =
            normalizedQuery === "" || projectMatches || normalize(nursery.name).includes(normalizedQuery);
          return matchesStatus && matchesQuery;
        })
      };
    })
    .filter(section => section.nurseries.length > 0);
};

export type NurseryApprovalLockReason = "approved" | "pending-approval";

export const getNurseryApprovalLockReason = (nursery: {
  status?: string | null;
  updateRequestStatus?: string | null;
}): NurseryApprovalLockReason | null => {
  if (nursery.status === APPROVED) return "approved";
  if (nursery.status === PENDING_APPROVAL || nursery.updateRequestStatus === PENDING_APPROVAL) {
    return "pending-approval";
  }
  return null;
};

export const getSelectionApprovalLockReason = (
  nurseries: Array<{ status?: string | null; updateRequestStatus?: string | null }>
): NurseryApprovalLockReason | "mixed" | null => {
  const reasons = new Set(
    nurseries.map(getNurseryApprovalLockReason).filter((reason): reason is NurseryApprovalLockReason => reason != null)
  );

  if (reasons.size === 0) return null;
  if (reasons.size > 1) return "mixed";
  return Array.from(reasons)[0] ?? null;
};
