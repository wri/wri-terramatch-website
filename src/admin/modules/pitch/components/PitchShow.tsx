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
import { useGadmChoices } from "@/connections/Gadm";
import { getCapacityBuildingNeedOptions } from "@/constants/options/capacityBuildingNeeds";
import { getLandTenureOptions } from "@/constants/options/landTenure";
import { getRestorationInterventionTypeOptions } from "@/constants/options/restorationInterventionTypes";
import { sustainableDevelopmentGoalsOptions } from "@/constants/options/sustainableDevelopmentGoals";
import { optionToChoices } from "@/utils/options";

import { PitchAside } from "./PitchAside";

export const PitchShow = () => {
  const countryChoices = useGadmChoices({ level: 0 });
  return (
    <Show actions={<ShowActions />} aside={<PitchAside asideType="show" />}>
      <SimpleShowLayout>
        <Typography variant="h6" component="h3">
          Objectives
        </Typography>
        <TextField source="projectObjectives" label="Objectives" emptyText="Not Provided" />
        <SelectField source="projectCountry" label="Country" choices={countryChoices} emptyText="Not Provided" />
        <TextField source="projectCountyDistrict" label="County/District" emptyText="Not Provided" />
        <NumberField source="projectBudget" label="Project Budget (USD)" emptyText="Not Provided" />
        <FileField
          source="detailedProjectBudget.url"
          title="detailedProjectBudget.fileName"
          label="Detailed Project Budget"
          target="_blank"
          download
          emptyText="Not Provided"
        />
        <NumberField
          source="totalHectares"
          label="Proposed number of hectares to be restored (ha)"
          emptyText="Not Provided"
        />
        <NumberField source="totalTrees" label="Proposed number of trees to be grown" emptyText="Not Provided" />
        <NumberField source="numJobsCreated" label="Total expected new jobs" emptyText="Not Provided" />
      </SimpleShowLayout>
      <Divider />

      <SimpleShowLayout>
        <Typography variant="h6" component="h3">
          Proposed Project Area
        </Typography>
        <MapField source="projBoundary" />
        <TextField source="projAreaDescription" label="Description of Project Area" emptyText="Not Provided" />
      </SimpleShowLayout>
      <Divider />

      <SimpleShowLayout>
        <Typography variant="h6" component="h3">
          Timeline
        </Typography>
        <DateField
          source="expectedActiveRestorationStartDate"
          label="Start Date"
          emptyText="Not Provided"
          locales="en-GB"
        />
        <DateField
          source="expectedActiveRestorationEndDate"
          label="End Date"
          emptyText="Not Provided"
          locales="en-GB"
        />
        <TextField
          source="descriptionOfProjectTimeline"
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
          source="landTenureProjArea"
          choices={optionToChoices(getLandTenureOptions())}
        />
        <FileArrayField source="proofOfLandTenureMou" label="Documentation on project area’s land tenure." />

        <TextField
          source="landholderCommEngage"
          label="Landholder & Community Engagement Strategy"
          emptyText="Not Provided"
        />
      </SimpleShowLayout>
      <Divider />

      <SimpleShowLayout>
        <Typography variant="h6" component="h3">
          More Information
        </Typography>
        <TextField source="projPartnerInfo" label="Proposed project partner information" emptyText="Not Provided" />
        <TextField source="projSuccessRisks" label="Risk + Mitigate strategy" emptyText="Not Provided" />
        <TextField source="monitorEvalPlan" label="Report, Monitor, Verification Strategy" emptyText="Not Provided" />
        <SimpleChipFieldArray
          label="Sustainable Development Goals"
          source="sustainableDevGoals"
          choices={optionToChoices(sustainableDevelopmentGoalsOptions())}
          emptyText="Not Provided"
        />

        <FileArrayField source="additional" label="Additional Documents" />

        <SimpleChipFieldArray
          label="Capacity Building Needs"
          source="capacityBuildingNeeds"
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
          source="restorationInterventionTypes"
          choices={optionToChoices(getRestorationInterventionTypeOptions())}
          emptyText="Not Provided"
        />
        <NumberField
          source="totalHectares"
          label="Proposed number of hectares to be restored"
          emptyText="Not Provided"
        />
        <NumberField source="totalTrees" label="Proposed number of trees to be grown" emptyText="Not Provided" />
        <ArrayField source="treeSpecies" label="Proposed Tree Species" emptyText="Not Provided">
          <Datagrid bulkActionButtons={false}>
            <TextField label="Tree Species" source="name" />
            <NumberField label="Total" source="amount" />
          </Datagrid>
        </ArrayField>
        <NumberField source="proposedNumSites" label="Proposed number of sites" emptyText="Not Provided" />
        <NumberField
          source="proposedNumNurseries"
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
          source="mainCausesOfDegradation"
          emptyText="Not Provided"
        />
        <TextField label="Ecological benefits of the project" source="environmentalGoals" emptyText="Not Provided" />
      </SimpleShowLayout>
      <Divider />

      <SimpleShowLayout>
        <Typography variant="h6" component="h3">
          Sources of tree seedlings for the project
        </Typography>
        <TextField label="" source="seedlingsSource" emptyText="Not Provided" />
      </SimpleShowLayout>
      <Divider />

      <SimpleShowLayout>
        <Typography variant="h6" component="h3">
          Social Impact
        </Typography>
        <Typography variant="h6" component="h4">
          New jobs breakdown
        </Typography>
        <NumberField source="numJobsCreated" label="Total expected new jobs" emptyText="Not Provided" />
        <NumberField source="pctEmployeesMen" label="% of total employees that would be men" emptyText="Not Provided" />
        <NumberField
          source="pctEmployeesWomen"
          label="% of total employees that would be women"
          emptyText="Not Provided"
        />
        <NumberField
          source="pctEmployees18to35"
          label="% of total employees that would be between the ages of 18 and 35?"
          emptyText="Not Provided"
        />
        <NumberField
          source="pctEmployeesOlder35"
          label="% of total employees that would be older than 35 years of age?"
          emptyText="Not Provided"
        />
        <Typography variant="h6" component="h4">
          Project beneficiaries breakdown
        </Typography>
        <NumberField source="projBeneficiaries" label="Project beneficiaries Total" emptyText="Not Provided" />
        <NumberField source="pctBeneficiariesWomen" label="% of female beneficiaries" emptyText="Not Provided" />
        <NumberField
          source="pctBeneficiariesSmall"
          label="% of smallholder farmers beneficiaries"
          emptyText="Not Provided"
        />
        <NumberField
          source="pctBeneficiariesLarge"
          label="% of large-scale farmers beneficiaries"
          emptyText="Not Provided"
        />
        <NumberField
          source="pctBeneficiariesYouth"
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
          source="currLandDegradation"
          emptyText="Not Provided"
        />
        <TextField
          label="How would the project impact local food security?"
          source="projImpactFoodsec"
          emptyText="Not Provided"
        />
        <TextField
          label="How would the project impact local water security?"
          source="projImpactWatersec"
          emptyText="Not Provided"
        />
        <TextField
          label="What kind of new jobs would this project create?"
          source="projImpactJobtypes"
          emptyText="Not Provided"
        />
      </SimpleShowLayout>
    </Show>
  );
};
