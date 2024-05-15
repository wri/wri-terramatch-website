import { useT } from "@transifex/react";
import { useState } from "react";

import { getDisturbanceTableColumns } from "@/components/elements/Inputs/DataTable/RHFDisturbanceTable";
import { ServerSideTable } from "@/components/elements/ServerSideTable/ServerSideTable";
import { GetV2DisturbancesENTITYUUIDResponse, useGetV2DisturbancesENTITYUUID } from "@/generated/apiComponents";
import { useProcessRecordData } from "@/hooks/useProcessRecordData";

export interface DisturbancesTableProps {
  modelName: string;
  modelUUID: string;
  collection?: string;
  hasCountColumn?: boolean;
  onFetch?: (data: GetV2DisturbancesENTITYUUIDResponse) => void;
}

const DisturbancesTable = ({ modelName, modelUUID, collection, onFetch }: DisturbancesTableProps) => {
  const t = useT();

  const [queryParams, setQueryParams] = useState<any>();

  if (collection && queryParams) {
    queryParams["filter[collection]"] = collection;
  }

  const { data: disturbances, isLoading } = useGetV2DisturbancesENTITYUUID(
    {
      queryParams,
      pathParams: { entity: modelName, uuid: modelUUID }
    },
    {
      enabled: !!modelUUID,
      keepPreviousData: true,
      onSuccess: data => onFetch?.(data)
    }
  );

  const hasAllHeaders = !!disturbances?.data?.[0]?.extent && !!disturbances?.data?.[0].intensity;
  const showDisturbance = useProcessRecordData(modelUUID, modelName, "disturbances");
  return (
    <div>
      <ServerSideTable
        meta={disturbances?.meta}
        data={((showDisturbance && disturbances?.data) || []) ?? []}
        isLoading={isLoading}
        onQueryParamChange={setQueryParams}
        columns={getDisturbanceTableColumns({ hasExtent: hasAllHeaders, hasIntensity: hasAllHeaders }, t)}
      />
    </div>
  );
};

export default DisturbancesTable;
