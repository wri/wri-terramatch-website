import { AutocompleteInput, Edit, ReferenceInput, SelectInput, SimpleForm, TextInput } from "react-admin";
import * as yup from "yup";

import { useGetUserRole } from "@/admin/hooks/useGetUserRole";
import { userPrimaryRoleChoices } from "@/admin/modules/user/const";
import { validateForm } from "@/admin/utils/forms";

import modules from "../..";
import UserTitle from "./UserTitle";

const UserEdit = () => {
  const { isSuperAdmin } = useGetUserRole();
  const schemaObject: any = {
    first_name: yup.string().nullable().required(),
    last_name: yup.string().nullable().required(),
    email_address: yup.string().nullable().required(),
    phone_number: yup.string().nullable().required(),
    job_role: yup.string().nullable().required(),
    organisation: yup.object()
  };

  if (isSuperAdmin) schemaObject.primary_role = yup.string().required();

  return (
    <Edit title={<UserTitle />} mutationMode="pessimistic" actions={false}>
      <SimpleForm validate={validateForm(yup.object(schemaObject))}>
        <TextInput source="first_name" label="First Name" fullWidth />
        <TextInput source="last_name" label="Last Name" fullWidth />
        <TextInput source="email_address" label="Professional Email Address" fullWidth type="email" />
        <TextInput source="phone_number" label="Professional Phone Number" fullWidth type="tel" />
        <TextInput source="job_role" label="Job Title" fullWidth />
        <ReferenceInput
          label="Organisation"
          source="organisation.uuid"
          reference={modules.organisation.ResourceName}
          options={{ fullWidth: true }}
        >
          <AutocompleteInput label="Organisation" optionText="name" fullWidth />
        </ReferenceInput>

        {isSuperAdmin && <SelectInput source="primary_role" label="Role" choices={userPrimaryRoleChoices} fullWidth />}
      </SimpleForm>
    </Edit>
  );
};

export default UserEdit;
