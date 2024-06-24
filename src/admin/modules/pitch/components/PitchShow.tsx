import { Divider, Typography } from "@mui/material";
import {
  ArrayField,
  Datagrid,
  DateField,
  FileField,
  NumberField,
  SelectField,
  Show,
  SimpleShowLayout,
  TextField
} from "react-admin";

import ShowActions from "@/admin/components/Actions/ShowActions";
import { FileArrayField } from "@/admin/components/Fields/FileArrayField";
import MapField from "@/admin/components/Fields/MapField";
import SimpleChipFieldArray from "@/admin/components/Fields/SimpleChipFieldArray";
import ShowTitle from "@/admin/components/ShowTitle";
import { getCapacityBuildingNeedOptions } from "@/constants/options/capacityBuildingNeeds";
import { getCountriesOptions } from "@/constants/options/countries";
import { getLandTenureOptions } from "@/constants/options/landTenure";
import { getRestorationInterventionTypeOptions } from "@/constants/options/restorationInterventionTypes";
import { sustainableDevelopmentGoalsOptions } from "@/constants/options/sustainableDevelopmentGoals";
import { optionToChoices } from "@/utils/options";

import { PitchAside } from "./PitchAside";

export const PitchShow = () => {
  return (
    <Show
      title={<ShowTitle moduleName="Pitch" getTitle={record => record?.project_name} />}
      actions={<ShowActions titleSource="project_name" />}
      aside={<PitchAside asideType="show" />}
    >
      <SimpleShowLayout>
        <Typography variant="h6" component="h3">
          Objectives
        </Typography>
        <TextField source="project_objectives" label="Objectives" emptyText="Not Provided" />
        <SelectField
          source="project_country"
          label="Country"
          choices={optionToChoices(getCountriesOptions())}
          emptyText="Not Provided"
        />
        <TextField source="project_county_district" label="County/District" emptyText="Not Provided" />
        <NumberField source="project_budget" label="Project Budget (USD)" emptyText="Not Provided" />
        <FileField
          source="detailed_project_budget.url"
          title="detailed_project_budget.file_name"
          label="Detailed Project Budget"
          target="_blank"
          download
          emptyText="Not Provided"
        />
        <NumberField
          source="total_hectares"
          label="Proposed number of hectares to be restored (ha)"
          emptyText="Not Provided"
        />
        <NumberField source="total_trees" label="Proposed number of trees to be grown" emptyText="Not Provided" />
        <NumberField source="num_jobs_created" label="Total expected new jobs" emptyText="Not Provided" />
      </SimpleShowLayout>
      <Divider />

      <SimpleShowLayout>
        <Typography variant="h6" component="h3">
          Proposed Project Area
        </Typography>
        <MapField source="proj_boundary" />
        <TextField source="proj_area_description" label="Description of Project Area" emptyText="Not Provided" />
      </SimpleShowLayout>
      <Divider />

      <SimpleShowLayout>
        <Typography variant="h6" component="h3">
          Timeline
        </Typography>
        <DateField
          source="expected_active_restoration_start_date"
          label="Start Date"
          emptyText="Not Provided"
          locales="en-GB"
        />
        <DateField
          source="expected_active_restoration_end_date"
          label="End Date"
          emptyText="Not Provided"
          locales="en-GB"
        />
        <TextField
          source="description_of_project_timeline"
          label="Key stages of this project’s implementation"
          emptyText="Not Provided"
        />
      </SimpleShowLayout>
      <Divider />

      <SimpleShowLayout>
        <Typography variant="h6" component="h3">
          Land Tenure Strategy
        </Typography>
        <SimpleChipFieldArray
          label="Land Tenure"
          source="land_tenure_proj_area"
          choices={optionToChoices(getLandTenureOptions())}
        />
        <FileArrayField source="proof_of_land_tenure_mou" label="Documentation on project area’s land tenure." />

        <TextField
          source="landholder_comm_engage"
          label="Landholder & Community Engagement Strategy"
          emptyText="Not Provided"
        />
      </SimpleShowLayout>
      <Divider />

      <SimpleShowLayout>
        <Typography variant="h6" component="h3">
          More Information
        </Typography>
        <TextField source="proj_partner_info" label="Proposed project partner information" emptyText="Not Provided" />
        <TextField source="proj_success_risks" label="Risk + Mitigate strategy" emptyText="Not Provided" />
        <TextField source="monitor_eval_plan" label="Report, Monitor, Verification Strategy" emptyText="Not Provided" />
        <SimpleChipFieldArray
          label="Sustainable Development Goals"
          source="sustainable_dev_goals"
          choices={optionToChoices(sustainableDevelopmentGoalsOptions())}
          emptyText="Not Provided"
        />

        <FileArrayField source="additional" label="Additional Documents" />

        <SimpleChipFieldArray
          label="Capacity Building Needs"
          source="capacity_building_needs"
          choices={optionToChoices(getCapacityBuildingNeedOptions())}
          emptyText="Not Provided"
        />
      </SimpleShowLayout>
      <Divider />

      <SimpleShowLayout>
        <Typography variant="h6" component="h3">
          Environmental Impact
        </Typography>
        <SimpleChipFieldArray
          label="Proposed Restoration Intervention Methods"
          source="restoration_intervention_types"
          choices={optionToChoices(getRestorationInterventionTypeOptions())}
          emptyText="Not Provided"
        />
        <NumberField
          source="total_hectares"
          label="Proposed number of hectares to be restored"
          emptyText="Not Provided"
        />
        <NumberField source="total_trees" label="Proposed number of trees to be grown" emptyText="Not Provided" />
        <ArrayField source="tree_species" label="Proposed Tree Species" emptyText="Not Provided">
          <Datagrid bulkActionButtons={false}>
            <TextField label="Tree Species" source="name" />
            <NumberField label="Total" source="amount" />
          </Datagrid>
        </ArrayField>
        <NumberField source="proposed_num_sites" label="Proposed number of sites" emptyText="Not Provided" />
        <NumberField
          source="proposed_num_nurseries"
          label="Proposed number of nurseries expanded or created"
          emptyText="Not Provided"
        />
      </SimpleShowLayout>
      <Divider />

      <SimpleShowLayout>
        <Typography variant="h6" component="h3">
          Biophysical characteristics of the project area Sources of tree seedlings for the project
        </Typography>
        <TextField
          label="Main causes of degradation in the project area"
          source="main_causes_of_degradation"
          emptyText="Not Provided"
        />
        <TextField label="Ecological benefits of the project" source="environmental_goals" emptyText="Not Provided" />
      </SimpleShowLayout>
      <Divider />

      <SimpleShowLayout>
        <Typography variant="h6" component="h3">
          Sources of tree seedlings for the project
        </Typography>
        <TextField label="" source="seedlings_source" emptyText="Not Provided" />
      </SimpleShowLayout>
      <Divider />

      <SimpleShowLayout>
        <Typography variant="h6" component="h3">
          Social Impact
        </Typography>
        <Typography variant="h6" component="h4">
          New jobs breakdown
        </Typography>
        <NumberField source="num_jobs_created" label="Total expected new jobs" emptyText="Not Provided" />
        <NumberField
          source="pct_employees_men"
          label="% of total employees that would be men"
          emptyText="Not Provided"
        />
        <NumberField
          source="pct_employees_women"
          label="% of total employees that would be women"
          emptyText="Not Provided"
        />
        <NumberField
          source="pct_employees_18to35"
          label="% of total employees that would be between the ages of 18 and 35?"
          emptyText="Not Provided"
        />
        <NumberField
          source="pct_employees_older35"
          label="% of total employees that would be older than 35 years of age?"
          emptyText="Not Provided"
        />
        <Typography variant="h6" component="h4">
          Project beneficiaries breakdown
        </Typography>
        <NumberField source="proj_beneficiaries" label="Project beneficiaries Total" emptyText="Not Provided" />
        <NumberField source="pct_beneficiaries_women" label="% of female beneficiaries" emptyText="Not Provided" />
        <NumberField
          source="pct_beneficiaries_small"
          label="% of smallholder farmers beneficiaries"
          emptyText="Not Provided"
        />
        <NumberField
          source="pct_beneficiaries_large"
          label="% of large-scale farmers beneficiaries"
          emptyText="Not Provided"
        />
        <NumberField
          source="pct_beneficiaries_youth"
          label="% of beneficiaries younger than 36"
          emptyText="Not Provided"
        />
      </SimpleShowLayout>
      <Divider />

      <SimpleShowLayout>
        <Typography variant="h6" component="h3">
          More Details on Social Impact of Project
        </Typography>
        <TextField
          label="Land degradation impact on the livelihoods of the communities living in the project area"
          source="curr_land_degradation"
          emptyText="Not Provided"
        />
        <TextField
          label="How would the project impact local food security?"
          source="proj_impact_foodsec"
          emptyText="Not Provided"
        />
        <TextField
          label="How would the project impact local water security?"
          source="proj_impact_watersec"
          emptyText="Not Provided"
        />
        <TextField
          label="What kind of new jobs would this project create?"
          source="proj_impact_jobtypes"
          emptyText="Not Provided"
        />
      </SimpleShowLayout>
    </Show>
  );
};
