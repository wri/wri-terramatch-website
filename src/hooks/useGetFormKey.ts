import {
  GetV2ReportingFrameworksFrameworkKeyResponse,
  useGetV2ReportingFrameworksFrameworkKey
} from "@/generated/apiComponents";
import { EntityName } from "@/types/common";

/**
 * To fetch reporting framework custom form uuid
 * @param frameworkKey UUID
 * @param entity EntityName
 * @returns custom form UUID
 */
export const useGetReportingFrameworkFormKey = (frameworkKey: string, entity: EntityName) => {
  const { data } = useGetV2ReportingFrameworksFrameworkKey(
    { pathParams: { frameworkKey } },
    {
      staleTime: process.env.NODE_ENV === "development" ? 0 : 30_000
    }
  );
  //@ts-ignore
  const frameworkData = (data?.data || {}) as GetV2ReportingFrameworksFrameworkKeyResponse;

  switch (entity) {
    case "projects":
      return frameworkData.project_form_uuid;

    case "sites":
      return frameworkData.site_form_uuid;

    case "nurseries":
      return frameworkData.nursery_form_uuid;

    case "project-reports":
      return frameworkData.project_report_form_uuid;

    case "site-reports":
      return frameworkData.site_report_form_uuid;

    case "nursery-reports":
      return frameworkData.nursery_report_form_uuid;
  }
};
