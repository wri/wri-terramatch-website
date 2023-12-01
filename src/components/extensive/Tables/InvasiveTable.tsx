import { useT } from "@transifex/react";
import { useState } from "react";

import { getInvasiveTableColumns } from "@/components/elements/Inputs/DataTable/RHFInvasiveTable";
import { ServerSideTable } from "@/components/elements/ServerSideTable/ServerSideTable";
import { GetV2InvasivesENTITYUUIDResponse, useGetV2InvasivesENTITYUUID } from "@/generated/apiComponents";

export interface InvasiveTableProps {
  modelName: string;
  modelUUID: string;
  collection?: string;
  hasCountColumn?: boolean;
  onFetch?: (data: GetV2InvasivesENTITYUUIDResponse) => void;
}

const InvasiveTable = ({ modelName, modelUUID, collection, onFetch }: InvasiveTableProps) => {
  const t = useT();

  const [queryParams, setQueryParams] = useState<any>();

  if (collection && queryParams) {
    queryParams["filter[collection]"] = collection;
  }

  const { data: invasives, isLoading } = useGetV2InvasivesENTITYUUID(
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

  return (
    <div>
      <ServerSideTable
        meta={invasives?.meta}
        data={invasives?.data || []}
        isLoading={isLoading}
        onQueryParamChange={setQueryParams}
        columns={getInvasiveTableColumns(t)}
      />
    </div>
  );
};

export default InvasiveTable;
