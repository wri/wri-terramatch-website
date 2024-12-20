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

import ShowActions from "@/admin/components/Actions/ShowActions";
import ShowTitle from "@/admin/components/ShowTitle";
import { V2AdminOrganisationRead } from "@/generated/apiSchemas";

import modules from "../..";
import { UserShowAside } from "./UserShowAside";

function ManagedProjects() {
  const { isLoading: ctxLoading, record } = useShowContext();

  if (ctxLoading || record.role !== "project-manager") return null;

  return (
    <Labeled>
      <ArrayField source="managed_projects" label="Managed Projects">
        <SingleFieldList className="pb-2 pt-2">
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
  <Show
    actions={
      <ShowActions
        getTitle={record => `${record?.first_name} ${record?.last_name}`}
        deleteProps={{ confirmTitle: "Delete User" }}
      />
    }
    title={<ShowTitle moduleName="User" getTitle={record => `${record?.first_name} ${record?.last_name}`} />}
    aside={<UserShowAside />}
  >
    <SimpleShowLayout>
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
  </Show>
);
