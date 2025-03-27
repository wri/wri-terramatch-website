import {
  ArrayField,
  DateField,
  FunctionField,
  Labeled,
  ReferenceField,
  Show,
  SimpleShowLayout,
  SingleFieldList,
  TextField,
  useShowContext
} from "react-admin";
import { When } from "react-if";

import ShowActions from "@/admin/components/Actions/ShowActions";
import Table from "@/components/elements/Table/Table";
import { VARIANT_TABLE_TREE_SPECIES } from "@/components/elements/Table/TableVariants";
import ToolTip from "@/components/elements/Tooltip/Tooltip";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { V2AdminOrganisationRead } from "@/generated/apiSchemas";

import modules from "../..";
import { UserShowAside } from "./UserShowAside";

function ManagedProjects() {
  const { isLoading: ctxLoading, record } = useShowContext();

  if (ctxLoading || record.role !== "project-manager") return null;

  return (
    <Labeled>
      <ArrayField source="managed_projects" label="Managed Projects">
        <SingleFieldList className="pt-2 pb-2">
          <ReferenceField link="show" source="uuid" reference={modules.project.ResourceName}>
            <TextField source="name" />
          </ReferenceField>
        </SingleFieldList>
      </ArrayField>
    </Labeled>
  );
}

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
        <ManagedProjects />
      </SimpleShowLayout>
      <div className="px-4 pb-8">
        <Table
          columns={[
            {
              header: "Monitoring Projects",
              accessorKey: "project_name",
              enableSorting: false,
              cell: props => (
                <div className="flex items-center gap-2">
                  <span>{String(props.getValue() ?? "-")}</span>
                  <When condition={props.row.original.isNew}>
                    <ToolTip
                      content="New Project"
                      colorBackground="white"
                      placement="right"
                      textVariantContent="text-14"
                    >
                      <Icon
                        name={IconNames.NEW_TAG_TREE_SPECIES_CUSTOM}
                        className="min-h-7 min-w-7 h-7 w-7 text-blueCustom-700 opacity-50"
                      />
                    </ToolTip>
                  </When>
                </div>
              )
            }
          ]}
          variant={VARIANT_TABLE_TREE_SPECIES}
          data={[
            {
              project_name: "Project 123",
              project_uuid: "123"
            },
            {
              project_name: "Project 456",
              project_uuid: "456",
              isNew: true
            },
            {
              project_name: "Project 789",
              project_uuid: "789"
            },
            {
              project_name: "Project 101",
              project_uuid: "101"
            }
          ]}
        />
      </div>
    </div>
  </Show>
);
