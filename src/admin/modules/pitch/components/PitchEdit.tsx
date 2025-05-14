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
  projectName: yup.string().nullable().required(),
  projectObjectives: yup.string().nullable().required(),
  projectCountry: yup.string().nullable().required(),
  projectCountyDistrict: yup.string().nullable().required(),
  restorationInterventionTypes: yup.array().min(1).nullable().required(),
  capacityBuildingNeeds: yup.array().min(1).nullable().required(),
  totalHectares: yup.number().nullable().required(),
  totalTrees: yup.number().nullable().required()
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
