import { v3Endpoint } from "@/connections/util/apiConnectionFactory";
import { treeReportCountsFind } from "@/generated/v3/entityService/entityServiceComponents";
import { TreeEntityTypes } from "@/generated/v3/entityService/entityServiceConstants";
import { TreeReportCountsDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useConnection } from "@/hooks/useConnection";

export type TreeReportCountsEntity =
  | (typeof TreeEntityTypes.REPORT_COUNT_ENTITIES)[number]
  | (typeof TreeEntityTypes.ESTABLISHMENT_ENTITIES)[number];

type TreeReportCountProps = {
  entity?: TreeReportCountsEntity;
  uuid?: string;
};

const treeReportCountsConnection = v3Endpoint("treeReportCounts", treeReportCountsFind)
  .singleByCustomId<TreeReportCountsDto, TreeReportCountProps>(
    ({ entity, uuid }) => (entity == null || uuid == null ? undefined : { pathParams: { entity, uuid } }),
    ({ entity, uuid }) => `${entity}|${uuid}`
  )
  .enabledProp()
  .buildConnection();

export const useTreeReportCounts = ({ entity, uuid, collection }: TreeReportCountProps & { collection?: string }) => {
  const enabled = collection != null && entity != null && uuid != null;
  const [isLoaded, { data }] = useConnection(treeReportCountsConnection, { entity, uuid, enabled });
  return {
    isLoaded,
    reportCounts: collection == null ? undefined : data?.reportCounts?.[collection] ?? {},
    establishmentTrees: collection == null ? undefined : data?.establishmentTrees?.[collection]
  };
};
