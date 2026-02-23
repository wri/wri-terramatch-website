import { useMemo } from "react";

import { EntityFullDto } from "@/connections/Entity";
import { useOrganisation } from "@/connections/Organisation";
import { OrgFormDetails, ProjectFormDetails } from "@/context/wizardForm.provider";
import { FinancialReportFullDto, ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { v3EntityName } from "@/helpers/entity";
import { EntityName } from "@/types/common";

export const useProjectOrgFormData = (entityName: EntityName, entity?: EntityFullDto) => {
  const [orgLoaded, { data: orgData, isLoading }] = useOrganisation(
    entity?.organisationUuid != null ? { id: entity.organisationUuid } : {}
  );
  const v3Name = v3EntityName(entityName);

  const orgDetails = useMemo(
    (): OrgFormDetails => ({
      uuid: orgData?.uuid,
      currency:
        (v3Name === "financialReports" ? (entity as FinancialReportFullDto)?.currency : orgData?.currency) ?? undefined,
      startMonth:
        (v3Name === "financialReports" ? (entity as FinancialReportFullDto)?.finStartMonth : orgData?.finStartMonth) ??
        undefined,
      type:
        (v3Name === "financialReports" ? (entity as FinancialReportFullDto)?.organisationType : orgData?.type) ??
        undefined
    }),
    [entity, orgData?.currency, orgData?.finStartMonth, orgData?.type, orgData?.uuid, v3Name]
  );

  const projectDetails = useMemo((): ProjectFormDetails => {
    if (v3Name === "projects") return { uuid: (entity as ProjectFullDto)?.uuid };
    if (v3Name === "financialReports") return { uuid: undefined };
    const uuid = (entity as Exclude<EntityFullDto, ProjectFullDto | FinancialReportFullDto>)?.projectUuid ?? undefined;
    return { uuid };
  }, [entity, v3Name]);

  return { projectDetails, orgDetails, isLoading: !orgLoaded || isLoading };
};
