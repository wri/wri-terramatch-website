import { useMemo } from "react";
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
  directFrameworkChoices,
  frameworkAdminPrimaryRoleChoices,
  frameworkChoices,
  userPrimaryRoleChoices
} from "@/admin/modules/user/const";
import { validateForm } from "@/admin/utils/forms";
import { useGadmChoices } from "@/connections/Gadm";

import modules from "../..";

const UserCreate = () => {
  const { isFrameworkAdmin, isSuperAdmin, role } = useGetUserRole();
  const countryChoices = useGadmChoices({ level: 0 });

  const schemaObject: any = {
    firstName: yup.string().nullable().required("First Name is required"),
    lastName: yup.string().nullable().required("Last Name is required"),
    emailAddress: yup.string().nullable().required("Email Address is required").email("Invalid email format"),
    phoneNumber: yup.string().nullable(),
    jobRole: yup.string().nullable(),
    organisationUuid: yup.string().nullable(),
    program: yup.string().nullable(),
    country: yup.string().nullable()
  };

  if (isFrameworkAdmin) {
    schemaObject.role = yup.string().required("Role is required");
  }

  const roleChoices = useMemo(() => {
    if (isSuperAdmin) {
      return userPrimaryRoleChoices;
    }

    return [...frameworkAdminPrimaryRoleChoices, userPrimaryRoleChoices.find(choice => choice.id === role)];
  }, [isSuperAdmin, role]);

  return (
    <Create title="Create User">
      <SimpleForm validate={validateForm(yup.object(schemaObject))}>
        <TextInput source="firstName" label="First Name" fullWidth />
        <TextInput source="lastName" label="Last Name" fullWidth />
        <TextInput source="emailAddress" label="Professional Email Address" fullWidth type="email" />
        <TextInput source="phoneNumber" label="Professional Phone Number" fullWidth type="tel" />
        <TextInput source="jobRole" label="Job Title" fullWidth />

        <ReferenceInput
          label="Organisation"
          source="organisationUuid"
          reference={modules.organisation.ResourceName}
          options={{ fullWidth: true }}
        >
          <AutocompleteInput label="Organisation" optionText="name" fullWidth />
        </ReferenceInput>

        {isFrameworkAdmin && <SelectInput source="role" label="Role" choices={roleChoices} fullWidth />}

        <SelectInput source="program" label="Program" choices={frameworkChoices} fullWidth />

        <SelectInput source="country" label="Country" choices={countryChoices} fullWidth />

        <SelectArrayInput
          source="directFrameworks"
          label="Direct Frameworks"
          choices={directFrameworkChoices}
          defaultValue={[]}
          fullWidth
        />
      </SimpleForm>
    </Create>
  );
};

export default UserCreate;
