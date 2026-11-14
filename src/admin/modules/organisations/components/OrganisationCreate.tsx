import { FC, useState } from "react";
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

import modules from "@/admin/modules";
import { frameworkAdminPrimaryRoleChoices, localeChoices } from "@/admin/modules/user/const";
import { validateForm } from "@/admin/utils/forms";
import { useGadmChoices } from "@/connections/Gadm";

const VALIDATION = {
  fundingProgrammeUuid: yup.string().nullable().required("Funding Programme is required"),
  level0Proposed: yup.array().min(1).of(yup.string().min(3).max(3)).nullable(),
  level1Proposed: yup.array().min(1).of(yup.string().min(3)).nullable(),
  userFirstName: yup.string().nullable().required("User First Name is required"),
  userLastName: yup.string().nullable().required("User Last Name is required"),
  userEmailAddress: yup.string().nullable().required("User Email Address is required"),
  userLocale: yup.string().nullable().required("User Locale is required"),
  userRole: yup.string().nullable().required("User Role is required")
};

const OrganisationCreate: FC = () => {
  const countryChoices = useGadmChoices({ level: 0 });
  const [level0Proposed, setLevel0Proposed] = useState<string[]>([]);
  const level1ProposedChoices = useGadmChoices({ level: 1, parentCodes: level0Proposed });

  return (
    <Create title="Create Organisation" redirect="show">
      <SimpleForm validate={validateForm(yup.object(VALIDATION))}>
        <ReferenceInput
          source="fundingProgrammeUuid"
          reference={modules.fundingProgramme.ResourceName}
          label="Funding Programme"
          sort={{ field: "name", order: "DESC" }}
          perPage={100}
        >
          <AutocompleteInput optionText="name" label="Funding Programme" fullWidth />
        </ReferenceInput>
        <SelectArrayInput
          source="level0Proposed"
          label="Level 0 Proposed"
          choices={countryChoices}
          onChange={event => {
            setLevel0Proposed(event.target.value);
          }}
          fullWidth
        />
        <SelectArrayInput source="level1Proposed" label="Level 1 Proposed" choices={level1ProposedChoices} fullWidth />
        <TextInput source="userFirstName" label="User First Name" fullWidth />
        <TextInput source="userLastName" label="User Last Name" fullWidth />
        <TextInput source="userEmailAddress" label="User Email Address" fullWidth />
        <SelectInput source="userLocale" label="User Locale" choices={localeChoices} fullWidth />
        <SelectInput
          source="userRole"
          label="User Role"
          choices={frameworkAdminPrimaryRoleChoices}
          defaultValue="project-developer"
          fullWidth
        />
      </SimpleForm>
    </Create>
  );
};

export default OrganisationCreate;
