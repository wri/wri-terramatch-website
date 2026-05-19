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
import type { To } from "react-router-dom";

import ShowActions from "@/admin/components/Actions/ShowActions";
import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_TREE_SPECIES } from "@/components/elements/Table/TableVariants";
import { UserDto, UserFramework } from "@/generated/v3/userService/userServiceSchemas";

import { UserShowAside } from "./UserShowAside";

type UserShowRecord = UserDto & { id: string };

type MonitoringPartnerProjectTableRow = Pick<
  NonNullable<UserDto["monitoringPartnerProjects"]>[number],
  "uuid" | "name"
>;

function userShowMonitoringProjectRows(record: UserDto | undefined): MonitoringPartnerProjectTableRow[] {
  const raw = record?.monitoringPartnerProjects;
  if (!Array.isArray(raw)) return [];

  const out: MonitoringPartnerProjectTableRow[] = [];
  for (const item of raw) {
    if (item?.uuid == null || item.name == null) continue;
    out.push({ uuid: item.uuid, name: item.name });
  }
  return out;
}

const MonitoringPartnerProjectsTable = ({ title }: { title: string }) => {
  const { isLoading: ctxLoading, record } = useShowContext<UserShowRecord>();
  const basename = useBasename();

  if (ctxLoading || record == null) return null;

  const projects = userShowMonitoringProjectRows(record);
  if (projects.length === 0) return null;

  return (
    <div className="px-4 pb-8 wide:pt-14">
      <Table
        columns={[
          {
            header: title,
            accessorKey: "name",
            enableSorting: false,
            cell: props => {
              const to = `${basename}/project/${props.row.original.uuid}/show` as To;
              return (
                <Link to={to} className="!text-[#000000DD] no-underline">
                  {String(props.getValue() ?? "-")}
                </Link>
              );
            }
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

const renderFrameworks = (property: "frameworks" | "directFrameworks") => (record?: UserDto) => {
  const frameworks: UserFramework[] = record?.[property] ?? [];
  return frameworks.length == 0 ? "No Frameworks" : frameworks.map(framework => framework.name).join(", ");
};

export const UserShow = () => (
  <Show actions={<ShowActions deleteProps={{ confirmTitle: "Delete User" }} />} aside={<UserShowAside />}>
    <div className="grid-user-show p-2">
      <SimpleShowLayout className="">
        <TextField source="firstName" label="First Name" emptyText="Not Provided" />
        <TextField source="lastName" label="Last Name" emptyText="Not Provided" />
        <TextField source="emailAddress" label="Professional Email Address" emptyText="Not Provided" />
        <TextField source="phoneNumber" label="Organization WhatsApp Enabled Phone Number" emptyText="Not Provided" />
        <TextField source="jobRole" label="Job Title" emptyText="Not Provided" />
        <TextField source="organisationName" label="Organisation" emptyText="Not Provided" />
        <DateField label="Last date active" source="lastLoggedInAt" locales="en-GB" />
        <FunctionField
          label="All Frameworks (includes frameworks through role and project associations)"
          render={renderFrameworks("frameworks")}
        />
        <FunctionField label="Direct Frameworks" render={renderFrameworks("directFrameworks")} />
      </SimpleShowLayout>
      <MonitoringPartnerProjectsTable title="Monitoring Partner Affiliations" />
    </div>
  </Show>
);
