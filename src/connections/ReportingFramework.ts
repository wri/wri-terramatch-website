import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook, connectionLoader } from "@/connections/util/connectionShortcuts";
import { deleterAsync } from "@/connections/util/resourceDeleter";
import { resourceCreator } from "@/connections/util/resourceMutator";
import {
  reportingFrameworkCreate,
  reportingFrameworkDelete,
  reportingFrameworkGet,
  reportingFrameworksIndex,
  reportingFrameworkUpdate
} from "@/generated/v3/entityService/entityServiceComponents";
import {
  ReportingFrameworkDto,
  UpdateReportingFrameworkAttributes
} from "@/generated/v3/entityService/entityServiceSchemas";
import { resolveUrl } from "@/generated/v3/utils";
import ApiSlice from "@/store/apiSlice";

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

const createReportingFrameworkConnection = v3Resource("reportingFrameworks", reportingFrameworkCreate)
  .create<ReportingFrameworkDto>()
  .buildConnection();

export const useReportingFramework = connectionHook(reportingFrameworkConnection);
export const useReportingFrameworks = connectionHook(reportingFrameworksConnection);
export const loadReportingFramework = connectionLoader(reportingFrameworkConnection);
export const loadReportingFrameworks = connectionLoader(reportingFrameworksConnection);

export const createReportingFramework = resourceCreator(createReportingFrameworkConnection);

export const deleteReportingFramework = deleterAsync("reportingFrameworks", reportingFrameworkDelete, uuid => ({
  pathParams: { uuid }
}));

export async function updateReportingFramework(
  uuid: string,
  attributes: UpdateReportingFrameworkAttributes
): Promise<void> {
  const pathParams = { uuid };
  const variables = {
    pathParams,
    body: {
      data: {
        type: "reportingFrameworks" as const,
        id: uuid,
        attributes
      }
    }
  };

  const selectorVariables = { pathParams };
  const selector = (state: typeof ApiSlice.currentState) => {
    const isFetching = reportingFrameworkUpdate.isFetchingSelector(selectorVariables)(state);
    const failure = reportingFrameworkUpdate.fetchFailedSelector(selectorVariables)(state);
    return { isFetching, failure };
  };

  if (selector(ApiSlice.currentState).failure != null) {
    ApiSlice.clearPending(resolveUrl(reportingFrameworkUpdate.url, variables), reportingFrameworkUpdate.method);
  }

  reportingFrameworkUpdate.fetch(variables);

  await new Promise<void>((resolve, reject) => {
    const unsubscribe = ApiSlice.redux.subscribe(() => {
      const { isFetching, failure } = selector(ApiSlice.currentState);
      if (!isFetching) {
        unsubscribe();
        if (failure != null) reject(failure);
        else resolve();
      }
    });
  });
}
