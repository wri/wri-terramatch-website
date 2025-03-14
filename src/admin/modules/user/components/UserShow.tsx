import {
  ArrayField,
  DateField,
  FunctionField,
  ReferenceField,
  Show,
  SimpleShowLayout,
  SingleFieldList,
  TextField,
  useShowContext
} from "react-admin";

import ShowActions from "@/admin/components/Actions/ShowActions";
import { V2AdminOrganisationRead } from "@/generated/apiSchemas";

import modules from "../..";
import { UserShowAside } from "./UserShowAside";

function ManagedProjects() {
  const { isLoading: ctxLoading, record } = useShowContext();
  if (ctxLoading || !["project-developer", "project-manager"].includes(record?.role)) return null;
  const isMonitoring = record?.role === "project-developer" ? true : false;

  return (
    <>
      <ArrayField
        source={isMonitoring ? "monitoring_projects" : "managed_projects"}
        label={isMonitoring ? "Monitoring Projects" : "Managed Projects"}
      >
        <SingleFieldList className="pb-2 pt-2">
          <ReferenceField link="show" source="uuid" reference={modules.project.ResourceName}>
            <TextField source="name" />
          </ReferenceField>
        </SingleFieldList>
      </ArrayField>
      {record.role == "project-manager" && record.monitoring_projects.length > 0 && (
        <ArrayField source="monitoring_projects" label="Monitoring Projects">
          <SingleFieldList className="pb-2 pt-2">
            <ReferenceField link="show" source="uuid" reference={modules.project.ResourceName}>
              <TextField source="name" />
            </ReferenceField>
          </SingleFieldList>
        </ArrayField>
      )}
    </>
  );
}

const renderFrameworks = (property: string) => (record: any) => {
  const frameworks: string[] = (record[property] as string[]) ?? [];
  return frameworks.length == 0 ? "No Frameworks" : frameworks.join(", ");
};

export const UserShow = () => (
  <Show actions={<ShowActions deleteProps={{ confirmTitle: "Delete User" }} />} aside={<UserShowAside />}>
    <div className="flex">
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
      </SimpleShowLayout>
      <SimpleShowLayout>
        <ManagedProjects />
      </SimpleShowLayout>
    </div>
  </Show>
);
