import { createSelector } from "reselect";

import { treeReportCountsFind } from "@/generated/v3/entityService/entityServiceComponents";
import { TreeEntityTypes } from "@/generated/v3/entityService/entityServiceConstants";
import { treeReportCountsFindFetchFailed } from "@/generated/v3/entityService/entityServicePredicates";
import { TreeReportCountsDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { ApiDataStore } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionHook } from "@/utils/connectionShortcuts";
import { selectorCache } from "@/utils/selectorCache";

export type TreeReportCountsEntity = (typeof TreeEntityTypes.REPORT_COUNT_ENTITIES)[number];

type TreeReportCountsConnection = {
  reportCounts?: Exclude<TreeReportCountsDto["reportCounts"], null>[string];

  reportCountsFailed: boolean;
};

type TreeReportCountProps = {
  entity?: TreeReportCountsEntity;
  uuid?: string;
  collection?: string;
};

const treeReportCountsSelector = (entity?: TreeReportCountsEntity, uuid?: string) => (store: ApiDataStore) =>
  entity == null || uuid == null ? undefined : store.treeReportCounts?.[`${entity}|${uuid}`];
const treeReportCountsLoadFailed = (entity?: TreeReportCountsEntity, uuid?: string) => (store: ApiDataStore) =>
  entity == null || uuid == null
    ? false
    : treeReportCountsFindFetchFailed({ pathParams: { entity, uuid } })(store) != null;

const connectionIsLoaded = (
  { reportCounts, reportCountsFailed }: TreeReportCountsConnection,
  { entity, uuid, collection }: TreeReportCountProps
) =>
  collection == null ||
  entity == null ||
  // Prevents this connection from issuing an API request with an invalid entity type.
  !TreeEntityTypes.REPORT_COUNT_ENTITIES.includes(entity) ||
  uuid == null ||
  reportCounts != null ||
  reportCountsFailed;

const treeReportCountsConnection: Connection<TreeReportCountsConnection, TreeReportCountProps> = {
  load: (connection, props) => {
    if (!connectionIsLoaded(connection, props)) {
      treeReportCountsFind({ pathParams: { entity: props.entity!, uuid: props.uuid! } });
    }
  },

  isLoaded: connectionIsLoaded,

  selector: selectorCache(
    ({ entity, uuid, collection }) => `${entity}|${uuid}|${collection}`,
    ({ entity, uuid, collection }) =>
      createSelector(
        [treeReportCountsSelector(entity, uuid), treeReportCountsLoadFailed(entity, uuid)],
        (countsDto, reportCountsFailed) => {
          const loadComplete = countsDto?.attributes?.reportCounts != null;
          const reportCounts =
            collection == null || !loadComplete ? undefined : countsDto.attributes.reportCounts[collection] ?? {};
          return { reportCounts, reportCountsFailed };
        }
      )
  )
};

export const useTreeReportCounts = connectionHook(treeReportCountsConnection);
