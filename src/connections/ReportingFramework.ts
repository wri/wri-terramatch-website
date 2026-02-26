import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook, connectionLoader } from "@/connections/util/connectionShortcuts";
import { deleterAsync } from "@/connections/util/resourceDeleter";
import { resourceCreator, resourceUpdater } from "@/connections/util/resourceMutator";
import {
  reportingFrameworkCreate,
  reportingFrameworkDelete,
  reportingFrameworkGet,
  reportingFrameworksIndex,
  reportingFrameworkUpdate
} from "@/generated/v3/entityService/entityServiceComponents";
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
  .update(reportingFrameworkUpdate, props => (props as ReportingFrameworkProps).frameworkKey ?? "")
  .buildConnection();

const reportingFrameworksConnection = v3Resource("reportingFrameworks", reportingFrameworksIndex)
  .index<ReportingFrameworkDto>()
  .addProps<{ translated?: boolean }>(({ translated }) => ({ queryParams: { translated } }))
  .buildConnection();

const createReportingFrameworkConnection = v3Resource("reportingFrameworks", reportingFrameworkCreate)
  .create<ReportingFrameworkDto>()
  .buildConnection();

export const useReportingFramework = connectionHook(reportingFrameworkConnection);
export const useReportingFrameworks = connectionHook(reportingFrameworksConnection);
export const loadReportingFramework = connectionLoader(reportingFrameworkConnection);
export const loadReportingFrameworks = connectionLoader(reportingFrameworksConnection);

export const createReportingFramework = resourceCreator(createReportingFrameworkConnection);

export const updateReportingFramework = resourceUpdater(reportingFrameworkConnection);

export const deleteReportingFramework = deleterAsync("reportingFrameworks", reportingFrameworkDelete, frameworkKey => ({
  pathParams: { frameworkKey }
}));
