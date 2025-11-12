import { DateInput, Edit, SelectInput, TabbedForm, TextInput } from "react-admin";
import * as yup from "yup";

import { FileUploadInput } from "@/admin/components/Inputs/FileUploadInput";
import { ImageUploadInput } from "@/admin/components/Inputs/ImageUploadInput";
import { SelectCountryInput } from "@/admin/components/Inputs/SelectCountryInput";
import { validateForm } from "@/admin/utils/forms";
import { getOrganisationTypeOptions } from "@/constants/options/organisations";
import { FileType } from "@/types/common";
import { optionToChoices } from "@/utils/options";

const validationSchema = yup.object({
  name: yup.string().nullable().required(),
  type: yup.string().nullable().required(),
  hq_street_1: yup.string().nullable().required(),
  hq_city: yup.string().nullable().required(),
  hq_state: yup.string().nullable().required(),
  hq_country: yup.string().nullable().required(),
  phone: yup.string().nullable().required(),
  description: yup.string().nullable().required(),
  logo: yup.object().nullable(),
  cover: yup.object().nullable(),
  reference: yup.array(),
  additional: yup.array(),
  legal_registration: yup.array().min(1).required(),
  web_url: yup.string().url().nullable(),
  facebook_url: yup.string().url().nullable(),
  instagram_url: yup.string().url().nullable(),
  linkedin_url: yup.string().url().nullable(),
  twitter_url: yup.string().url().nullable(),
  fin_start_month: yup.number().nullable(),
  fin_budget_3year: yup.number().nullable(),
  fin_budget_2year: yup.number().nullable(),
  fin_budget_1year: yup.number().nullable(),
  fin_budget_current_year: yup.number().nullable(),
  ha_restored_total: yup.number().nullable(),
  ha_restored_3year: yup.number().nullable(),
  trees_grown_total: yup.number().nullable(),
  trees_grown_3year: yup.number().nullable()
});

export const OrganisationEdit = () => {
  return (
    <Edit actions={false}>
      <TabbedForm validate={validateForm(validationSchema)}>
        <TabbedForm.Tab label="Organization Details">
          <TextInput source="name" label="Legal Name" fullWidth />
          <SelectInput
            source="type"
            label="Organization Type"
            choices={optionToChoices(getOrganisationTypeOptions())}
            fullWidth
          />
          <TextInput source="hq_street_1" label="Headquarters Street address" fullWidth />
          <TextInput source="hq_street_2" label="Headquarters Street address 2" fullWidth />
          <TextInput source="hq_city" label="Headquarters City" fullWidth />
          <TextInput source="hq_state" label="Headquarters address State/Province" fullWidth />
          <TextInput source="hq_zipcode" label="Headquarters address Zipcode" fullWidth />
          <SelectCountryInput source="hq_country" label="Headquarters address Country" fullWidth />
          <TextInput source="phone" label="Organization WhatsApp Enabled Phone Number" fullWidth />
          <DateInput source="founding_date" label="Date organization founded" fullWidth />
          <TextInput source="description" label="Organization Details" fullWidth multiline />
          <ImageUploadInput source="logo" label="Logo" fullWidth />
          <ImageUploadInput source="cover" label="Cover" fullWidth />

          <FileUploadInput source="reference" label="Reference Letters" multiple accept={FileType.Pdf} />
          <FileUploadInput
            source="additional"
            label="Other additional documents"
            multiple
            accept={FileType.ImagesAndDocs}
          />
          <FileUploadInput
            source="legal_registration"
            label="Proof of legal registrations"
            multiple
            accept={FileType.ImagesAndDocs}
          />
        </TabbedForm.Tab>

        <TabbedForm.Tab label="Social media">
          <TextInput source="web_url" label="Website" fullWidth />
          <TextInput source="facebook_url" label="Facebook" fullWidth />
          <TextInput source="instagram_url" label="Instagram" fullWidth />
          <TextInput source="linkedin_url" label="LinkedIn" fullWidth />
          <TextInput source="twitter_url" label="Twitter" fullWidth />
        </TabbedForm.Tab>

        <TabbedForm.Tab label="Financial Scope of Work (Historic)">
          <TextInput source="fin_start_month" label="Start of financial year (month)" type="number" fullWidth />
          <TextInput
            source="fin_budget_3year"
            label="Organization Budget in USD for (-3 years from today)"
            type="number"
            fullWidth
          />
          <TextInput
            source="fin_budget_2year"
            label="Organization Budget in USD for (-2 years from today)"
            type="number"
            fullWidth
          />
          <TextInput
            source="fin_budget_1year"
            label="Organization Budget in USD for (-1 years from today)"
            type="number"
            fullWidth
          />
          <TextInput
            source="fin_budget_current_year"
            label="Organization Budget in USD for (this year)"
            type="number"
            fullWidth
          />

          <TextInput source="ha_restored_total" label="Total Hectares Restored" type="number" fullWidth />
          <TextInput source="ha_restored_3year" label="Hecatres Restored in the last 3 years" type="number" fullWidth />
          <TextInput source="trees_grown_total" label="Total Trees Grown" type="number" fullWidth />
          <TextInput source="trees_grown_3year" label="Trees Grown in the last 3 years" type="number" fullWidth />
        </TabbedForm.Tab>
      </TabbedForm>
    </Edit>
  );
};
