import {
  DateField,
  FunctionField,
  Link,
  ReferenceField,
  Show,
  SimpleShowLayout,
  TextField,
  useBasename,
  useShowContext
} from "react-admin";

import ShowActions from "@/admin/components/Actions/ShowActions";
import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_TREE_SPECIES } from "@/components/elements/Table/TableVariants";
import { V2AdminOrganisationRead } from "@/generated/apiSchemas";

import modules from "../..";
import { UserShowAside } from "./UserShowAside";

const UserProjectsTable = ({ title, projectKey }: { title: string; projectKey: string }) => {
  const { isLoading: ctxLoading, record } = useShowContext();
  const basename = useBasename();

  if (ctxLoading || !record?.[projectKey]?.length) return null;

  const projects = record[projectKey]?.map(({ name, uuid }: { name: string; uuid: string }) => ({ name, uuid })) || [];

  return (
    <div className="px-4 pb-8">
      <Table
        columns={[
          {
            header: title,
            accessorKey: "name",
            enableSorting: false,
            cell: props => (
              // @ts-ignore
              <Link
                to={`${basename}/project/${props.row.original.uuid}/show`}
                className="!text-[#000000DD] no-underline"
              >
                {String(props.getValue() ?? "-")}
              </Link>
            )
          }
        ]}
        variant={VARIANT_TABLE_TREE_SPECIES}
        data={projects}
        hasPagination={true}
      />
    </div>
  );
};

const renderFrameworks = (property: string) => (record: any) => {
  const frameworks: string[] = (record[property] as string[]) ?? [];
  return frameworks.length == 0 ? "No Frameworks" : frameworks.join(", ");
};

export const UserShow = () => (
  <Show actions={<ShowActions deleteProps={{ confirmTitle: "Delete User" }} />} aside={<UserShowAside />}>
    <div className="grid-user-show p-2">
      <SimpleShowLayout className="">
        <TextField source="first_name" label="First Name" emptyText="Not Provided" />
        <TextField source="last_name" label="Last Name" emptyText="Not Provided" />
        <TextField source="email_address" label="Professional Email Address" emptyText="Not Provided" />
        <TextField source="phone_number" label="Organization WhatsApp Enabled Phone Number" emptyText="Not Provided" />
        <TextField source="job_role" label="Job Title" emptyText="Not Provided" />
        <ReferenceField label="Organisation" source="organisation.uuid" reference={modules.organisation.ResourceName}>
          <FunctionField render={(record: V2AdminOrganisationRead) => record.name || "No Organisation Name"} />
        </ReferenceField>
        <DateField label="Last date active" source="last_logged_in_at" />
        <FunctionField
          label="All Frameworks (includes frameworks through role and project associations)"
          render={renderFrameworks("all_frameworks")}
        />
        <FunctionField label="Direct Frameworks" render={renderFrameworks("direct_frameworks")} />
      </SimpleShowLayout>
      <UserProjectsTable title="Monitoring Projects" projectKey="monitoring_projects" />
      <UserProjectsTable title="Managed Projects" projectKey="managed_projects" />
    </div>
  </Show>
);
