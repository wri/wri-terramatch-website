import {
  Datagrid,
  DateField,
  EditButton,
  List,
  ReferenceField,
  SearchInput,
  SelectField,
  SelectInput,
  ShowButton,
  TextField,
  useDataProvider
} from "react-admin";

import { PitchDataProvider } from "@/admin/apiProvider/dataProviders/pitchDataProviders";
import ListActions from "@/admin/components/Actions/ListActions";
import SimpleChipFieldArray from "@/admin/components/Fields/SimpleChipFieldArray";
import { getCountriesOptions } from "@/constants/options/countries";
import { getRestorationInterventionTypeOptions } from "@/constants/options/restorationInterventionTypes";
import { optionToChoices } from "@/utils/options";

import modules from "../..";

const filters = [
  <SearchInput key="s" source="search" alwaysOn />,
  <SelectInput
    key="i"
    label="Intervention Type"
    source="restoration_intervention_types"
    choices={optionToChoices(getRestorationInterventionTypeOptions())}
  />,
  <SelectInput
    key="c"
    label="Project country"
    source="project_country"
    choices={optionToChoices(getCountriesOptions())}
  />
];

const ApplicationDataGrid = () => {
  return (
    <Datagrid rowClick="show">
      <TextField source="project_name" label="Project Name" sortable />
      <ReferenceField
        source="organisation_id"
        label="Organization"
        reference={modules.organisation.ResourceName}
        link="show"
      >
        <TextField source="name" />
      </ReferenceField>
      <SimpleChipFieldArray
        source="restoration_intervention_types"
        label="Restoration Intervention Types"
        choices={optionToChoices(getRestorationInterventionTypeOptions())}
      />
      <SelectField source="project_country" label="Countries" choices={optionToChoices(getCountriesOptions())} />
      <DateField source="created_at" label="Date Added" />
      <ShowButton />
      <EditButton />
    </Datagrid>
  );
};

export const PitchesList = () => {
  const pitchDataProvider = useDataProvider<PitchDataProvider>();

  return (
    <List
      actions={<ListActions onExport={() => pitchDataProvider.export(modules.pitch.ResourceName)} />}
      filters={filters}
    >
      <ApplicationDataGrid />
    </List>
  );
};
