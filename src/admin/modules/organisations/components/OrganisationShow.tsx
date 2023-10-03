import { Box, Card, Divider, Typography } from "@mui/material";
import {
  ArrayField,
  Datagrid,
  DateField,
  ImageField,
  NumberField,
  SelectField,
  Show,
  ShowBase,
  SimpleShowLayout,
  TabbedShowLayout,
  TextField,
  UrlField
} from "react-admin";

import ShowActions from "@/admin/components/Actions/ShowActions";
import { FileArrayField } from "@/admin/components/Fields/FileArrayField";
import MapField from "@/admin/components/Fields/MapField";
import SimpleChipFieldArray from "@/admin/components/Fields/SimpleChipFieldArray";
import ShowTitle from "@/admin/components/ShowTitle";
import { getCountriesOptions } from "@/constants/options/countries";
import {
  getFarmersEngagementStrategyOptions,
  getWomenEngagementStrategyOptions,
  getYoungerThan35EngagementStrategyOptions
} from "@/constants/options/engagementStrategy";
import { getOrganisationTypeOptions } from "@/constants/options/organisations";
import { getRestorationInterventionTypeOptions } from "@/constants/options/restorationInterventionTypes";
import { optionToChoices } from "@/utils/options";

import OrganisationApplicationsTable from "./OrganisationApplicationsTable";
import OrganisationFundingProgrammesTable from "./OrganisationFundingProgrammesTable";
import OrganisationPitchesTable from "./OrganisationPitchesTable";
import { OrganisationShowAside } from "./OrganisationShowAside";
import OrganisationUserTable from "./OrganisationUserTable";

export const OrganisationShow = () => (
  <>
    <Show
      actions={<ShowActions titleSource="name" />}
      title={<ShowTitle moduleName="Organization" getTitle={record => record?.name} />}
      aside={<OrganisationShowAside />}
    >
      <TabbedShowLayout>
        <TabbedShowLayout.Tab label="Organization Details">
          <TextField source="name" label="Legal Name" emptyText="Not Provided" />
          <TextField source="readable_status" label="Status" emptyText="Not Provided" />
          <SelectField
            source="type"
            label="Organization Type"
            choices={optionToChoices(getOrganisationTypeOptions())}
            emptyText="Not Provided"
          />
          <TextField source="hq_street_1" label="Headquarters Street address" emptyText="Not Provided" />
          <TextField source="hq_street_2" label="Headquarters Street address 2" emptyText="Not Provided" />
          <TextField source="hq_city" label="Headquarters City" emptyText="Not Provided" />
          <TextField source="hq_state" label="Headquarters address State/Province" emptyText="Not Provided" />
          <TextField source="hq_zipcode" label="Headquarters address Zipcode" emptyText="Not Provided" />
          <SelectField
            source="hq_country"
            label="Headquarters address Country"
            choices={optionToChoices(getCountriesOptions())}
            emptyText="Not Provided"
          />
          <TextField source="phone" label="Organization WhatsApp Enabled Phone Number" emptyText="Not Provided" />
          <DateField source="founding_date" label="Date organization founded" emptyText="Not Provided" />
          <TextField source="description" label="Organization Details" emptyText="Not Provided" />
          <ImageField source="logo.url" label="Logo" title="logo.file_name" emptyText="Not Provided" />
          <ImageField source="cover.url" label="Cover" title="cover.file_name" emptyText="Not Provided" />

          <FileArrayField source="reference" label="Reference Letters" />
          <FileArrayField source="additional" label="Other additional documents" />
          <FileArrayField source="legal_registration" label="Proof of legal registrations" />
          <Divider />

          <Typography variant="h6" component="h3">
            Social Media
          </Typography>
          <UrlField source="web_url" label="Website" emptyText="Not Provided" target="_blank" />
          <UrlField source="facebook_url" label="Facebook" emptyText="Not Provided" target="_blank" />
          <UrlField source="instagram_url" label="Instagram" emptyText="Not Provided" target="_blank" />
          <UrlField source="linkedin_url" label="LinkedIn" emptyText="Not Provided" target="_blank" />
          <UrlField source="twitter_url" label="Twitter" emptyText="Not Provided" target="_blank" />
        </TabbedShowLayout.Tab>

        <TabbedShowLayout.Tab label="Financial History">
          <NumberField source="fin_start_month" label="Start of financial year (month)" emptyText="Not Provided" />
          <NumberField
            source="fin_budget_3year"
            label="Organization Budget in USD for (-3 years from today)"
            emptyText="Not Provided"
          />
          <NumberField
            source="fin_budget_2year"
            label="Organization Budget in USD for (-2 years from today)"
            emptyText="Not Provided"
          />
          <NumberField
            source="fin_budget_1year"
            label="Organization Budget in USD for (-1 years from today)"
            emptyText="Not Provided"
          />
          <NumberField
            source="fin_budget_current_year"
            label=" Organization Budget in USD for (this year)"
            emptyText="Not Provided"
          />
          <NumberField
            source="fin_budget_current_year"
            label=" Organization Budget in USD for (this year)"
            emptyText="Not Provided"
          />
        </TabbedShowLayout.Tab>

        <TabbedShowLayout.Tab label="Community Engagement">
          <SimpleChipFieldArray
            source="engagement_farmers"
            label="Enagement: Farmers"
            choices={optionToChoices(getFarmersEngagementStrategyOptions())}
            emptyText="Not Provided"
          />
          <SimpleChipFieldArray
            source="engagement_women"
            label="Enagement: Women"
            choices={optionToChoices(getWomenEngagementStrategyOptions())}
            emptyText="Not Provided"
          />
          <SimpleChipFieldArray
            source="engagement_youth"
            label="Engagement: Youth"
            choices={optionToChoices(getYoungerThan35EngagementStrategyOptions())}
            emptyText="Not Provided"
          />
          <TextField
            source="community_experience"
            label="Community Engagement Experience/Approach"
            emptyText="Not Provided"
          />
          <TextField
            source="total_engaged_community_members_3yr"
            label="Community Engagement Numbers"
            emptyText="Not Provided"
          />
        </TabbedShowLayout.Tab>

        <TabbedShowLayout.Tab label="Restoration Experience">
          <NumberField
            source="relevant_experience_years"
            label="Years of relevant restoration experience"
            emptyText="Not Provided"
          />
          <NumberField source="ha_restored_total" label="Total Hectares Restored" emptyText="Not Provided" />
          <NumberField
            source="ha_restored_3year"
            label="Hectares Restored in the last 3 years"
            emptyText="Not Provided"
          />
          <NumberField source="trees_grown_total" label="Total Trees Grown" emptyText="Not Provided" />
          <NumberField source="trees_grown_3year" label="Trees Grown in the last 3 years" emptyText="Not Provided" />
          <ArrayField source="tree_species" label="Tree Species Grown" emptyText="Not Provided">
            <Datagrid
              bulkActionButtons={false}
              empty={
                <Typography component="span" variant="body2">
                  Not Provided
                </Typography>
              }
            >
              <TextField label={false} source="name" />
            </Datagrid>
          </ArrayField>
          <NumberField source="avg_tree_survival_rate" label="Average Tree Survival Rate" emptyText="Not Provided" />
          <SimpleChipFieldArray
            source="restoration_types_implemented"
            label="Restoration Intervention Types Implemented"
            choices={optionToChoices(getRestorationInterventionTypeOptions())}
            emptyText="Not Provided"
          />
          <TextField
            source="tree_maintenance_aftercare_approach"
            label="Tree Maintenance & After Care Approach"
            emptyText="Not Provided"
          />
          <TextField
            source="restored_areas_description"
            label="Description of areas restored"
            emptyText="Not Provided"
          />
          <TextField
            source="monitoring_evaluation_experience"
            label="Monitoring and evaluation experience"
            emptyText="Not Provided"
          />
          <MapField
            label="Historic monitoring shapefile"
            source="historic_monitoring_geojson"
            emptyText="Not Provided"
          />
          <FileArrayField
            source="previous_annual_reports"
            label="Previous Annual Reports for Monitored Restoration Projects"
            emptyText="Not Provided"
          />
          <FileArrayField
            source="historic_restoration"
            label="Photos of past restoration work"
            emptyText="Not Provided"
          />
        </TabbedShowLayout.Tab>
      </TabbedShowLayout>
    </Show>
    <ShowBase>
      <Box mr="366px">
        <Card sx={{ marginTop: 2, marginBottom: 2 }}>
          <SimpleShowLayout>
            <OrganisationFundingProgrammesTable />
          </SimpleShowLayout>
        </Card>
        <Card sx={{ marginTop: 2, marginBottom: 2 }}>
          <SimpleShowLayout>
            <OrganisationPitchesTable />
          </SimpleShowLayout>
        </Card>
        <Card sx={{ marginTop: 2, marginBottom: 2 }}>
          {/* WIP waiting on a fix from bed */}
          <SimpleShowLayout>
            <OrganisationApplicationsTable />
          </SimpleShowLayout>
        </Card>
        <Card sx={{ marginTop: 2, marginBottom: 2 }}>
          <SimpleShowLayout>
            <OrganisationUserTable />
          </SimpleShowLayout>
        </Card>
      </Box>
    </ShowBase>
  </>
);
