import { useMemo } from "react";
import {
  AutocompleteInput,
  Edit,
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
  localeChoices,
  userPrimaryRoleChoices
} from "@/admin/modules/user/const";
import { validateForm } from "@/admin/utils/forms";
import { useGadmChoices } from "@/connections/Gadm";

import modules from "../..";
import UserTitle from "./UserTitle";

const UserEdit = () => {
  const { isFrameworkAdmin, isSuperAdmin, role } = useGetUserRole();
  const countryChoices = useGadmChoices({ level: 0 });

  const schemaObject: any = {
    firstName: yup.string().nullable().required(),
    lastName: yup.string().nullable().required(),
    emailAddress: yup.string().nullable().required(),
    phoneNumber: yup.string().nullable().required(),
    jobRole: yup.string().nullable().required(),
    organisationUuid: yup.string().nullable().required()
  };

  const roleChoices = useMemo(() => {
    if (isSuperAdmin) {
      return userPrimaryRoleChoices;
    }

    return [...frameworkAdminPrimaryRoleChoices, userPrimaryRoleChoices.find(choice => choice.id === role)];
  }, [isSuperAdmin, role]);

  return (
    <Edit title={<UserTitle />} mutationMode="pessimistic" actions={false}>
      <SimpleForm validate={validateForm(yup.object(schemaObject))}>
        <TextInput source="firstName" label="First Name" fullWidth />
        <TextInput source="lastName" label="Last Name" fullWidth />
        <TextInput source="emailAddress" label="Professional Email Address" fullWidth type="email" />
        <TextInput source="phoneNumber" label="Professional Phone Number" fullWidth type="tel" />
        <TextInput source="jobRole" label="Job Title" fullWidth />
        <SelectInput source="locale" label="Locale" choices={localeChoices} fullWidth />
        <ReferenceInput
          label="Organisation"
          source="organisationUuid"
          reference={modules.organisation.ResourceName}
          options={{ fullWidth: true }}
        >
          <AutocompleteInput
            label="Organisation"
            optionText="name"
            fullWidth
            filterToQuery={searchText => ({ search: searchText })}
          />
        </ReferenceInput>

        {isFrameworkAdmin && <SelectInput source="primaryRole" label="Role" choices={roleChoices} fullWidth />}
        <SelectInput source="program" label="Program" choices={frameworkChoices} fullWidth />
        <SelectInput source="country" label="Country" choices={countryChoices} fullWidth />
        <SelectArrayInput source="frameworks" label="Direct Frameworks" choices={directFrameworkChoices} fullWidth />
      </SimpleForm>
    </Edit>
  );
};

export default UserEdit;
