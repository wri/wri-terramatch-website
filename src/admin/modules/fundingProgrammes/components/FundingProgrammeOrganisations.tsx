import { ColumnDef } from "@tanstack/react-table";
import { ShowButton, SimpleShowLayout, useShowContext } from "react-admin";

import modules from "@/admin/modules";
import { ConnectionTable } from "@/components/elements/ServerSideTable/ConnectionTable";
import { VARIANT_TABLE_AIRTABLE } from "@/components/elements/Table/TableVariants";
import { indexOrgsConnection } from "@/connections/Organisation";
import { OrganisationDto } from "@/generated/v3/userService/userServiceSchemas";

const COLUMNS: ColumnDef<OrganisationDto>[] = [
  { accessorKey: "name", header: "Name", enableSorting: false },
  {
    accessorKey: "uuid",
    header: "Show",
    cell: props => (
      <ShowButton resource={modules.organisation.ResourceName} record={{ id: props.getValue() as string }} />
    ),
    enableSorting: false
  }
];

const FundingProgrammeOrganisations = () => {
  const fundingProgrammeUuid = useShowContext().record?.uuid;

  return (
    <SimpleShowLayout>
      <ConnectionTable
        connection={indexOrgsConnection}
        connectionProps={{ filter: { fundingProgrammeUuid } }}
        variant={VARIANT_TABLE_AIRTABLE}
        columns={COLUMNS}
        defaultPageSize={15}
      />
    </SimpleShowLayout>
  );
};

export default FundingProgrammeOrganisations;
