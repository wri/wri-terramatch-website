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

const ORG_TYPES = ["for-profit-organization", "non-profit-organization"];
const ORG_TYPE_CHOICES = ORG_TYPES.map(type => ({ id: type, name: type }));

const VALIDATION = {
  name: yup.string().nullable().required("Organisation ame is required"),
  type: yup.string().oneOf(ORG_TYPES).nullable().required("Organisation type is required"),
  hqStreet1: yup.string().nullable().required("HQ Street 1 is required"),
  hqStreet2: yup.string().nullable(),
  hqCity: yup.string().nullable().required("HQ City is required"),
  hqState: yup.string().nullable().required("HQ State is required"),
  hqZipcode: yup.string().nullable(),
  hqCountry: yup.string().nullable().min(3).max(3).required("HQ Country is required"),
  phone: yup.string().nullable().required("Phone is required"),
  countries: yup.array().min(1).of(yup.string().min(3).max(3)).nullable().required("Countries are required"),
  fundingProgrammeUuid: yup.string().nullable().required("Funding Programme is required"),
  currency: yup.string().nullable(),
  level0PastRestoration: yup.array().min(1).of(yup.string().min(3).max(3)).nullable(),
  level1PastRestoration: yup.array().min(1).of(yup.string().min(3)).nullable(),
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
  const [level0PastRestoration, setLevel0PastRestoration] = useState<string[]>([]);
  const level1PastRestorationChoices = useGadmChoices({ level: 1, parentCodes: level0PastRestoration });
  const [level0Proposed, setLevel0Proposed] = useState<string[]>([]);
  const level1ProposedChoices = useGadmChoices({ level: 1, parentCodes: level0Proposed });

  return (
    <Create title="Create Organisation">
      <SimpleForm validate={validateForm(yup.object(VALIDATION))}>
        <TextInput source="name" label="Organisation Name" fullWidth />
        <SelectInput source="type" label="Organisation Type" choices={ORG_TYPE_CHOICES} fullWidth />
        <TextInput source="hqStreet1" label="HQ Street 1" fullWidth />
        <TextInput source="hqStreet2" label="HQ Street 2" fullWidth />
        <TextInput source="hqCity" label="HQ City" fullWidth />
        <TextInput source="hqState" label="HQ State" fullWidth />
        <TextInput source="hqZipcode" label="HQ Zipcode" fullWidth />
        <SelectInput source="hqCountry" label="HQ Country" choices={countryChoices} fullWidth />
        <TextInput source="phone" label="Phone" fullWidth />
        <SelectArrayInput
          source="countries"
          label="Countries"
          choices={countryChoices}
          fullWidth
          onChange={event => {
            console.log("countries select", event.target.value);
          }}
        />
        <ReferenceInput
          source="fundingProgrammeUuid"
          reference={modules.fundingProgramme.ResourceName}
          label="Funding Programme"
          sort={{ field: "name", order: "DESC" }}
          perPage={1000}
        >
          <AutocompleteInput optionText="name" label="Funding Programme" fullWidth />
        </ReferenceInput>
        <TextInput source="currency" label="Currency" defaultValue="USD" fullWidth />
        <SelectArrayInput
          source="level0PastRestoration"
          label="Level 0 Past Restoration"
          choices={countryChoices}
          onChange={event => {
            setLevel0PastRestoration(event.target.value);
          }}
          fullWidth
        />
        <SelectArrayInput
          source="level1PastRestoration"
          label="Level 1 Past Restoration"
          choices={level1PastRestorationChoices}
          fullWidth
        />
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
