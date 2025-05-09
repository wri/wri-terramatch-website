import React from "react";
import { Edit, NumberInput, SelectArrayInput, SelectInput, SimpleForm, TextInput } from "react-admin";
import * as yup from "yup";

import { validateForm } from "@/admin/utils/forms";
import { useGadmChoices } from "@/connections/Gadm";
import { getCapacityBuildingNeedOptions } from "@/constants/options/capacityBuildingNeeds";
import { getRestorationInterventionTypeOptions } from "@/constants/options/restorationInterventionTypes";
import { optionToChoices } from "@/utils/options";

import { PitchAside } from "./PitchAside";

const validationSchema = yup.object({
  project_name: yup.string().nullable().required(),
  project_objectives: yup.string().nullable().required(),
  project_country: yup.string().nullable().required(),
  project_county_district: yup.string().nullable().required(),
  restoration_intervention_types: yup.array().min(1).nullable().required(),
  capacity_building_needs: yup.array().min(1).nullable().required(),
  total_hectares: yup.number().nullable().required(),
  total_trees: yup.number().nullable().required()
});

const PitchEdit = () => {
  const countryChoices = useGadmChoices({ level: 0 });
  return (
    <Edit actions={false} aside={<PitchAside asideType="edit" />}>
      <SimpleForm validate={validateForm(validationSchema)}>
        <TextInput source="projectName" label="Name" fullWidth />
        <TextInput source="projectObjectives" label="Objectives" fullWidth />
        <SelectInput
          source="projectCountry"
          label="Location of Restoration Project - Country"
          choices={countryChoices}
          fullWidth
        />
        <TextInput source="projectCountyDistrict" label="Location of Restoration Project - County/District" fullWidth />
        <SelectArrayInput
          source="restorationInterventionTypes"
          label="Restoration Intervention Types"
          choices={optionToChoices(getRestorationInterventionTypeOptions())}
          fullWidth
        />
        <SelectArrayInput
          source="capacityBuildingNeeds"
          choices={optionToChoices(getCapacityBuildingNeedOptions())}
          label="Capacity Building Needs"
          fullWidth
        />
        <NumberInput source="totalHectares" label="Total Hectares to be restored" fullWidth />
        <NumberInput source="totalTrees" label="Total number of trees to be grown" fullWidth />
      </SimpleForm>
    </Edit>
  );
};

export default PitchEdit;
