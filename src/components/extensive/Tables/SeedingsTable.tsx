import { useT } from "@transifex/react";
import { useState } from "react";

import { getSeedingTableColumns } from "@/components/elements/Inputs/DataTable/RHFSeedingTable";
import { ServerSideTable } from "@/components/elements/ServerSideTable/ServerSideTable";
import { GetV2TreeSpeciesEntityUUIDResponse, useGetV2SeedingsENTITYUUID } from "@/generated/apiComponents";

export interface SeedingsTableProps {
  modelName: string;
  modelUUID: string;
  collection?: string;
  onFetch?: (data: GetV2TreeSpeciesEntityUUIDResponse) => void;
  type: "count" | "weight";
}

const SeedingsTable = ({ modelName, modelUUID, collection, onFetch, type }: SeedingsTableProps) => {
  const t = useT();

  const [queryParams, setQueryParams] = useState<any>();

  if (collection && queryParams) {
    queryParams["filter[collection]"] = collection;
  }

  const { data: treeSpecies, isLoading } = useGetV2SeedingsENTITYUUID(
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
        meta={treeSpecies?.meta}
        data={treeSpecies?.data?.map(item => ({ ...item, amount: item.amount || 0 })) || []}
        isLoading={isLoading}
        onQueryParamChange={setQueryParams}
        columns={getSeedingTableColumns(t, type === "count").filter(c => c.accessorKey !== "seeds_per_kg")}
      />
    </div>
  );
};

export default SeedingsTable;
