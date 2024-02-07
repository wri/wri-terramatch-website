import { Divider, Stack, Typography } from "@mui/material";
import { useState } from "react";
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
import ExportProcessingAlert from "@/admin/components/Alerts/ExportProcessingAlert";
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
      <DateField source="created_at" label="Date Added" locales="en-GB" />
      <ShowButton />
      <EditButton />
    </Datagrid>
  );
};

export const PitchesList = () => {
  const [exporting, setExporting] = useState<boolean>(false);

  const pitchDataProvider = useDataProvider<PitchDataProvider>();

  const handleExport = () => {
    setExporting(true);

    pitchDataProvider.export(modules.pitch.ResourceName).finally(() => setExporting(false));
  };

  return (
    <>
      <Stack gap={1} py={2}>
        <Typography variant="h5">Pitches</Typography>

        <Divider />
      </Stack>

      <List actions={<ListActions onExport={handleExport} />} filters={filters}>
        <ApplicationDataGrid />
      </List>

      <ExportProcessingAlert show={exporting} />
    </>
  );
};
