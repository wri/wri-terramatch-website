import { useT } from "@transifex/react";
import { useState } from "react";

import { ServerSideTable } from "@/components/elements/ServerSideTable/ServerSideTable";
import { TableVariant } from "@/components/elements/Table/TableVariants";
import { GetV2TreeSpeciesEntityUUIDResponse, useGetV2TreeSpeciesEntityUUID } from "@/generated/apiComponents";

export interface TreeSpeciesTableProps {
  modelName: string;
  modelUUID: string;
  collection?: string;
  onFetch?: (data: GetV2TreeSpeciesEntityUUIDResponse) => void;
  variantTable?: TableVariant;
}

const TreeSpeciesTable = ({ modelName, modelUUID, collection, onFetch, variantTable }: TreeSpeciesTableProps) => {
  const t = useT();

  const [queryParams, setQueryParams] = useState<any>();

  if (collection && queryParams) {
    queryParams["filter[collection]"] = collection;
  }

  const { data: treeSpecies, isLoading } = useGetV2TreeSpeciesEntityUUID(
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

  const hasCountColumn =
    treeSpecies?.data && treeSpecies?.data?.length > 0
      ? treeSpecies?.data?.reduce((total, item) => total + (typeof item.amount === "number" ? 1 : 0), 0) > 0
      : false;

  return (
    <div>
      <ServerSideTable
        meta={treeSpecies?.meta}
        data={treeSpecies?.data?.map(item => ({ ...item, amount: item.amount ?? 0 })) || []}
        isLoading={isLoading}
        treeSpeciesShow={true}
        onQueryParamChange={setQueryParams}
        variant={variantTable}
        columns={[
          {
            accessorKey: "name",
            header: t("Name"),
            enableSorting: false
          },
          {
            accessorKey: "amount",
            header: t("Count"),
            enableSorting: false
          }
        ].filter(item => hasCountColumn || item.accessorKey !== "amount")}
      />
    </div>
  );
};

export default TreeSpeciesTable;
