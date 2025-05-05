import { useT } from "@transifex/react";
import { useMemo } from "react";

import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_TREE_SPECIES } from "@/components/elements/Table/TableVariants";
import { useInvasives } from "@/connections/EntityAssociation";
import { getInvasiveTypeOptions } from "@/constants/options/invasives";
import { formatOptionsList } from "@/utils/options";

export type InvasiveEntity = "projectReports" | "siteReports" | "sites" | "projects";

export interface InvasiveTableProps {
  modelName: InvasiveEntity;
  modelUUID: string;
  hasCountColumn?: boolean;
}

const InvasiveTable = ({ modelName, modelUUID }: InvasiveTableProps) => {
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
        data={invasives ?? []}
        columns={columns}
        variant={VARIANT_TABLE_TREE_SPECIES}
        hasPagination
        invertSelectPagination
      />
    </div>
  );
};

export default InvasiveTable;
