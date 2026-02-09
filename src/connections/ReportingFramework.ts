import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook, connectionLoader } from "@/connections/util/connectionShortcuts";
import { reportingFrameworkGet, reportingFrameworksIndex } from "@/generated/v3/entityService/entityServiceComponents";
import { ReportingFrameworkDto } from "@/generated/v3/entityService/entityServiceSchemas";

type ReportingFrameworkProps = {
  frameworkKey?: string;
};

const reportingFrameworkConnection = v3Resource("reportingFrameworks", reportingFrameworkGet)
  .singleByCustomId<ReportingFrameworkDto, ReportingFrameworkProps>(
    ({ frameworkKey }) => (frameworkKey == null ? undefined : { pathParams: { frameworkKey } }),
    ({ frameworkKey }) => frameworkKey ?? ""
  )
  .enabledProp()
  .buildConnection();

const reportingFrameworksConnection = v3Resource("reportingFrameworks", reportingFrameworksIndex)
  .index<ReportingFrameworkDto>()
  .addProps<{ translated?: boolean }>(({ translated }) => ({ queryParams: { translated } }))
  .buildConnection();

export const useReportingFramework = connectionHook(reportingFrameworkConnection);
export const useReportingFrameworks = connectionHook(reportingFrameworksConnection);
export const loadReportingFramework = connectionLoader(reportingFrameworkConnection);
export const loadReportingFrameworks = connectionLoader(reportingFrameworksConnection);
