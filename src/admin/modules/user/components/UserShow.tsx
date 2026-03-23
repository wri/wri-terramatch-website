import {
  DateField,
  FunctionField,
  Link,
  Show,
  SimpleShowLayout,
  TextField,
  useBasename,
  useShowContext
} from "react-admin";

import ShowActions from "@/admin/components/Actions/ShowActions";
import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_TREE_SPECIES } from "@/components/elements/Table/TableVariants";
import { UserFramework } from "@/generated/v3/userService/userServiceSchemas";

import { UserShowAside } from "./UserShowAside";

const UserProjectsTable = ({ title, projectKey }: { title: string; projectKey: string }) => {
  const { isLoading: ctxLoading, record } = useShowContext();
  const basename = useBasename();

  if (ctxLoading || !record?.[projectKey]?.length) return null;

  const projects = record[projectKey]?.map(({ name, uuid }: { name: string; uuid: string }) => ({ name, uuid })) || [];

  return (
    <div className="px-4 pb-8 wide:pt-14">
      <Table
        columns={[
          {
            header: title,
            accessorKey: "name",
            enableSorting: false,
            cell: props => (
              <Link
                // @ts-ignore
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
        invertSelectPagination={true}
      />
    </div>
  );
};

const renderFrameworks = (property: string) => (record: any) => {
  const frameworks: UserFramework[] = (record[property] as UserFramework[]) ?? [];
  return frameworks.length == 0
    ? "No Frameworks"
    : frameworks.map((framework: UserFramework) => framework.name).join(", ");
};

export const UserShow = () => (
  <Show actions={<ShowActions deleteProps={{ confirmTitle: "Delete User" }} />} aside={<UserShowAside />}>
    <div className="grid-user-show p-2">
      <SimpleShowLayout className="">
        <TextField source="firstName" label="First Name" emptyText="Not Provided" />
        <TextField source="lastName" label="Last Name" emptyText="Not Provided" />
        <TextField source="emailAddress" label="Professional Email Address" emptyText="Not Provided" />
        <TextField source="primaryRole" label="Organization WhatsApp Enabled Phone Number" emptyText="Not Provided" />
        <TextField source="jobRole" label="Job Title" emptyText="Not Provided" />
        <TextField source="organisationName" label="Organisation" emptyText="Not Provided" />
        <DateField label="Last date active" source="lastLoggedInAt" locales="en-GB" />
        <FunctionField
          label="All Frameworks (includes frameworks through role and project associations)"
          render={renderFrameworks("frameworks")}
        />
        <FunctionField label="Direct Frameworks" render={renderFrameworks("directFrameworks")} />
      </SimpleShowLayout>
      <UserProjectsTable title="Monitoring Projects" projectKey="monitoring_projects" />
      <UserProjectsTable title="Managed Projects" projectKey="managed_projects" />
    </div>
  </Show>
);
