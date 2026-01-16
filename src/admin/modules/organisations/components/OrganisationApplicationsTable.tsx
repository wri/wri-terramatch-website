import { Typography } from "@mui/material";
import { ColumnDef } from "@tanstack/react-table";
import { FC, useMemo } from "react";
import { Link, useCreatePath, useShowContext } from "react-admin";

import modules from "@/admin/modules";
import { statusChoices } from "@/admin/modules/application/components/ApplicationList";
import { ConnectionTable } from "@/components/elements/ServerSideTable/ConnectionTable";
import { VARIANT_TABLE_PRIMARY } from "@/components/elements/Table/TableVariants";
import { applicationsConnection } from "@/connections/Application";
import { ApplicationDto } from "@/generated/v3/entityService/entityServiceSchemas";

const createColumns = (createPath: ReturnType<typeof useCreatePath>): ColumnDef<ApplicationDto>[] => [
  {
    accessorKey: "fundingProgrammeUuid",
    header: "Funding Programme",
    enableSorting: false,
    cell: props => {
      const fundingProgrammeUuid = props.getValue() as string;
      const name = props.row.original.fundingProgrammeName;
      return (
        <Link
          to={createPath({
            resource: modules.fundingProgramme.ResourceName,
            type: "show",
            id: fundingProgrammeUuid
          })}
        >
          {name}
        </Link>
      );
    }
  },
  {
    accessorKey: "submissions",
    header: "Stage",
    enableSorting: false,
    cell: props => {
      const submissions = (props.getValue() ?? []) as ApplicationDto["submissions"];
      const submission = submissions.length === 0 ? undefined : submissions[submissions.length - 1];
      return submission?.stageName ?? "<no stage>";
    }
  },
  {
    accessorKey: "submissions",
    header: "Status",
    enableSorting: false,
    cell: props => {
      const submissions = (props.getValue() ?? []) as ApplicationDto["submissions"];
      const submission = submissions.length === 0 ? undefined : submissions[submissions.length - 1];
      return statusChoices.find(status => status.id === submission?.status)?.name ?? "<no status>";
    }
  }
];

const OrganisationApplicationsTable: FC = () => {
  const organisationUuid = useShowContext().record?.uuid;
  const createPath = useCreatePath();

  const columns = useMemo(() => createColumns(createPath), [createPath]);

  return (
    <div>
      <Typography variant="h6" component="h3" mb={2}>
        Applications
      </Typography>
      <ConnectionTable
        connection={applicationsConnection}
        connectionProps={{ filter: { organisationUuid } }}
        variant={VARIANT_TABLE_PRIMARY}
        columns={columns}
      />
    </div>
  );
};

export default OrganisationApplicationsTable;
