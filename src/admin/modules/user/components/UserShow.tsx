import { DateField, FunctionField, ReferenceField, Show, SimpleShowLayout, TextField } from "react-admin";

import { V2AdminOrganisationRead } from "@/generated/apiSchemas";

import modules from "../..";
import { UserShowAside } from "./UserShowAside";
import UserTitle from "./UserTitle";

export const UserShow = () => {
  return (
    <Show title={<UserTitle />} actions={false} aside={<UserShowAside />}>
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
      </SimpleShowLayout>
    </Show>
  );
};
