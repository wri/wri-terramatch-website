import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook, connectionLoader } from "@/connections/util/connectionShortcuts";
import { getAggregateReports } from "@/generated/v3/entityService/entityServiceComponents";
import { AggregateReportsDto } from "@/generated/v3/entityService/entityServiceSchemas";

export type AggregateReportsEntity = "projects" | "sites";

export type AggregateReportsProps = {
  entity: AggregateReportsEntity;
  uuid: string;
  enabled?: boolean;
};

const aggregateReportsConnection = v3Resource("aggregateReports", getAggregateReports)
  .singleByCustomId<AggregateReportsDto, AggregateReportsProps>(
    ({ entity, uuid }) => (entity == null || uuid == null ? undefined : { pathParams: { entity, uuid } }),
    ({ entity, uuid }) => `${entity}|${uuid}`
  )
  .enabledProp()
  .loadFailure()
  .buildConnection();

export const useAggregateReports = connectionHook(aggregateReportsConnection);
export const loadAggregateReports = connectionLoader(aggregateReportsConnection);
