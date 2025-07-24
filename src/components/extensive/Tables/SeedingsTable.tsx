import { useT } from "@transifex/react";
import { orderBy } from "lodash";
import { useMemo } from "react";

import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_TREE_SPECIES } from "@/components/elements/Table/TableVariants";
import { SupportedEntity, usePlants } from "@/connections/EntityAssociation";
import { SeedingDto } from "@/generated/v3/entityService/entityServiceSchemas";

export interface SeedingsTableProps {
  entity: SupportedEntity;
  entityUuid: string;
}

const SeedingsTable = ({ entity, entityUuid }: SeedingsTableProps) => {
  const t = useT();

  const [, { data: seedings }] = usePlants<SeedingDto>({ entity, uuid: entityUuid });
  const sortedSeedings = useMemo(() => orderBy(seedings ?? [], ["seedsInSample"], ["desc"]), [seedings]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: t("Species"),
        enableSorting: false
      },
      {
        accessorKey: "seedsInSample",
        header: t("Seeds Per Sample"),
        enableSorting: false
      },
      {
        accessorKey: "weightOfSample",
        header: t("Sample Weight(Kg)"),
        enableSorting: false
      }
    ],
    [t]
  );

  return (
    <div>
      <Table
        data={sortedSeedings}
        columns={columns}
        variant={VARIANT_TABLE_TREE_SPECIES}
        hasPagination
        invertSelectPagination
      />
    </div>
  );
};

export default SeedingsTable;
