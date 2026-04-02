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
import { UserFramework } from "@/generated/v3/userService/userServiceSchemas";

import modules from "../..";
import UserTitle from "./UserTitle";

function directFrameworksToSlugs(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(item => {
    if (item != null && typeof item === "object" && "slug" in item) {
      return String((item as UserFramework).slug);
    }
    return String(item);
  });
}

const normalizeFrameworksForApi = (frameworks: unknown): string[] => directFrameworksToSlugs(frameworks);

const transformUserSave = (data: Record<string, unknown>) => ({
  ...data,
  directFrameworks: normalizeFrameworksForApi(data.directFrameworks)
});

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
    <Edit title={<UserTitle />} mutationMode="pessimistic" actions={false} transform={transformUserSave}>
      <SimpleForm validate={validateForm(yup.object(schemaObject))}>
        <TextInput source="firstName" label="First Name" fullWidth />
        <TextInput source="lastName" label="Last Name" fullWidth />
        <TextInput source="emailAddress" label="Professional Email Address" fullWidth type="email" />
        <TextInput source="phoneNumber" label="Professional Phone Number" fullWidth type="tel" />
        <TextInput source="jobRole" label="Job Title" fullWidth />
        <SelectInput source="locale" label="Locale" choices={localeChoices} fullWidth />
        <ReferenceInput label="Organisation" source="organisationUuid" reference={modules.organisation.ResourceName}>
          <AutocompleteInput
            source="organisationUuid"
            label="Organisation"
            optionText="name"
            optionValue="uuid"
            fullWidth
            filterToQuery={searchText => ({ search: searchText })}
          />
        </ReferenceInput>

        {isFrameworkAdmin && <SelectInput source="primaryRole" label="Role" choices={roleChoices} fullWidth />}
        <SelectInput source="program" label="Program" choices={frameworkChoices} fullWidth />
        <SelectInput source="country" label="Country" choices={countryChoices} fullWidth />
        <SelectArrayInput
          source="directFrameworks"
          label="Direct Frameworks"
          choices={directFrameworkChoices}
          fullWidth
          format={(value: unknown) => {
            if (!Array.isArray(value)) {
              return [];
            }
            return value
              .map((item: unknown) => {
                if (typeof item === "string") {
                  return item;
                }
                if (item != null && typeof item === "object" && "slug" in item) {
                  return String((item as { slug: string }).slug);
                }
                return "";
              })
              .filter(Boolean);
          }}
          parse={(slugs: string[]) =>
            slugs.map(slug => {
              const choice = directFrameworkChoices.find(c => c.id === slug);
              return { slug, name: typeof choice?.name === "string" ? choice.name : slug };
            })
          }
        />
      </SimpleForm>
    </Edit>
  );
};

export default UserEdit;
