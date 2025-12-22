import { useMemo } from "react";

import { EntityFullDto } from "@/connections/Entity";
import { OrgFormDetails, ProjectFormDetails } from "@/context/wizardForm.provider";
import { useGetV2OrganisationsUUID } from "@/generated/apiComponents";
import { V2OrganisationRead } from "@/generated/apiSchemas";
import { FinancialReportFullDto, ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { v3EntityName } from "@/helpers/entity";
import { EntityName } from "@/types/common";

export const useProjectOrgFormData = (entityName: EntityName, entity?: EntityFullDto) => {
  const { data: orgData, isLoading } = useGetV2OrganisationsUUID<{ data: V2OrganisationRead }>(
    { pathParams: { uuid: entity?.organisationUuid ?? "" } },
    { enabled: entity?.organisationUuid != null }
  );
  const v3Name = v3EntityName(entityName);

  const orgDetails = useMemo(
    (): OrgFormDetails => ({
      uuid: orgData?.data.uuid,
      currency:
        (v3Name === "financialReports" ? (entity as FinancialReportFullDto)?.currency : orgData?.data.currency) ??
        undefined,
      startMonth:
        (v3Name === "financialReports"
          ? (entity as FinancialReportFullDto)?.finStartMonth
          : orgData?.data.fin_start_month) ?? undefined,
      type:
        (v3Name === "financialReports" ? (entity as FinancialReportFullDto)?.organisationType : orgData?.data.type) ??
        undefined
    }),
    [entity, orgData?.data.currency, orgData?.data.fin_start_month, orgData?.data.type, orgData?.data.uuid, v3Name]
  );

  const projectDetails = useMemo((): ProjectFormDetails => {
    if (v3Name === "projects") return { uuid: (entity as ProjectFullDto)?.uuid };
    if (v3Name === "financialReports") return { uuid: undefined };
    const uuid = (entity as Exclude<EntityFullDto, ProjectFullDto | FinancialReportFullDto>)?.projectUuid ?? undefined;
    return { uuid };
  }, [entity, v3Name]);

  return { projectDetails, orgDetails, isLoading };
};
