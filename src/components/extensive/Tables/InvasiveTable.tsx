import { useT } from "@transifex/react";
import { useMemo } from "react";

import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_TREE_SPECIES } from "@/components/elements/Table/TableVariants";
import { useInvasives } from "@/connections/EntityAssocation";
import { getInvasiveTypeOptions } from "@/constants/options/invasives";
import { formatOptionsList } from "@/utils/options";

import { DemographicEntity } from "../DemographicsCollapseGrid/types";

export interface InvasiveTableProps {
  modelName: DemographicEntity;
  modelUUID: string;
  collection?: string;
  hasCountColumn?: boolean;
  onFetch?: (data: any) => void;
}

const InvasiveTable = ({ modelName, modelUUID, collection, onFetch }: InvasiveTableProps) => {
  const t = useT();

  const [, { associations: invasives }] = useInvasives({ entity: modelName, uuid: modelUUID });

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: t("Plant Species"),
        enableSorting: false
      },
      {
        accessorKey: "type",
        header: t("Type"),
        enableSorting: false,
        cell: (prop: any) => formatOptionsList(getInvasiveTypeOptions(), prop.getValue() as string)
      }
    ],
    [t]
  );

  return (
    <div>
      <Table
        data={invasives || []}
        columns={columns}
        variant={VARIANT_TABLE_TREE_SPECIES}
        hasPagination
        invertSelectPagination
      />
    </div>
  );
};

export default InvasiveTable;
