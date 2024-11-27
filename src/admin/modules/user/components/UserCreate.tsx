import {
  AutocompleteInput,
  Create,
  ReferenceInput,
  SelectArrayInput,
  SelectInput,
  SimpleForm,
  TextInput
} from "react-admin";
import * as yup from "yup";

import { useGetUserRole } from "@/admin/hooks/useGetUserRole";
import {
  countriesChoices,
  directFrameworkChoices,
  frameworkChoices,
  userPrimaryRoleChoices
} from "@/admin/modules/user/const";
import { validateForm } from "@/admin/utils/forms";

import modules from "../..";

const UserCreate = () => {
  const { isSuperAdmin } = useGetUserRole();

  const schemaObject: any = {
    first_name: yup.string().nullable().required("First Name is required"),
    last_name: yup.string().nullable().required("Last Name is required"),
    email_address: yup.string().nullable().required("Email Address is required").email("Invalid email format"),
    phone_number: yup.string().nullable(),
    job_role: yup.string().nullable(),
    organisation: yup.object().nullable(),
    program: yup.string().nullable(),
    country: yup.string().nullable()
  };

  if (isSuperAdmin) {
    schemaObject.role = yup.string().required("Role is required");
  }

  return (
    <Create title="Create User">
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

        {isSuperAdmin && <SelectInput source="role" label="Role" choices={userPrimaryRoleChoices} fullWidth />}

        <SelectInput source="program" label="Program" choices={frameworkChoices} fullWidth />

        <SelectInput source="country" label="Country" choices={countriesChoices} fullWidth />

        <SelectArrayInput
          source="direct_frameworks"
          label="Direct Frameworks"
          choices={directFrameworkChoices}
          fullWidth
        />
      </SimpleForm>
    </Create>
  );
};

export default UserCreate;
