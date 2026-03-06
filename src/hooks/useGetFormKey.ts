import { useReportingFramework } from "@/connections/ReportingFramework";
import { EntityName } from "@/types/common";

/**
 * To fetch reporting framework custom form uuid
 * @param frameworkKey Framework slug/key
 * @param entity EntityName
 * @returns custom form UUID
 */
export const useGetReportingFrameworkFormKey = (
  frameworkKey: string,
  entity: EntityName
): string | null | undefined => {
  const [, { data: frameworkData }] = useReportingFramework({ frameworkKey });

  if (frameworkData == null) {
    return undefined;
  }

  switch (entity) {
    case "projects":
      return frameworkData.projectFormUuid;

    case "sites":
      return frameworkData.siteFormUuid;

    case "nurseries":
      return frameworkData.nurseryFormUuid;

    case "project-reports":
      return frameworkData.projectReportFormUuid;

    case "site-reports":
      return frameworkData.siteReportFormUuid;

    case "nursery-reports":
      return frameworkData.nurseryReportFormUuid;

    default:
      return undefined;
  }
};
