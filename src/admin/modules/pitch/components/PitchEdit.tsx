import React from "react";
import { Edit, NumberInput, SelectArrayInput, SelectInput, SimpleForm, TextInput } from "react-admin";
import * as yup from "yup";

import { validateForm } from "@/admin/utils/forms";
import { getCapacityBuildingNeedOptions } from "@/constants/options/capacityBuildingNeeds";
import { getCountriesOptions } from "@/constants/options/countries";
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
  return (
    <Edit actions={false} aside={<PitchAside asideType="edit" />}>
      <SimpleForm validate={validateForm(validationSchema)}>
        <TextInput source="project_name" label="Name" fullWidth />
        <TextInput source="project_objectives" label="Objectives" fullWidth />
        <SelectInput
          source="project_country"
          label="Location of Restoration Project - Country"
          choices={optionToChoices(getCountriesOptions())}
          fullWidth
        />
        <TextInput
          source="project_county_district"
          label="Location of Restoration Project - County/District"
          fullWidth
        />
        <SelectArrayInput
          source="restoration_intervention_types"
          label="Restoration Intervention Types"
          choices={optionToChoices(getRestorationInterventionTypeOptions())}
          fullWidth
        />
        <SelectArrayInput
          source="capacity_building_needs"
          choices={optionToChoices(getCapacityBuildingNeedOptions())}
          label="Capacity Building Needs"
          fullWidth
        />
        <NumberInput source="total_hectares" label="Total Hectares to be restored" fullWidth />
        <NumberInput source="total_trees" label="Total number of trees to be grown" fullWidth />
      </SimpleForm>
    </Edit>
  );
};

export default PitchEdit;
