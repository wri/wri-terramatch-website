import { Stack } from "@mui/material";
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
import { Choice } from "@/admin/types/common";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_BOTTOM_LEFT } from "@/components/elements/Menu/MenuVariant";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { useGadmChoices } from "@/connections/Gadm";
import { getRestorationInterventionTypeOptions } from "@/constants/options/restorationInterventionTypes";
import { optionToChoices } from "@/utils/options";

import modules from "../..";

const filters = (countryChoices: Choice[]) => [
  <SearchInput key="s" source="search" alwaysOn className="search-page-admin" />,
  <SelectInput
    key="i"
    label="Intervention Type"
    className="select-page-admin"
    source="restorationInterventionTypes"
    choices={optionToChoices(getRestorationInterventionTypeOptions())}
  />,
  <SelectInput
    key="c"
    label="Project country"
    className="select-page-admin"
    source="projectCountry"
    choices={countryChoices}
  />
];

const tableMenu = [
  {
    id: "1",
    render: () => <EditButton />
  },
  {
    id: "2",
    render: () => <ShowButton />
  }
];

const ApplicationDataGrid = () => {
  const countryChoices = useGadmChoices({ level: 0 });
  return (
    <Datagrid rowClick={"show"}>
      <TextField source="projectName" label="Project Name" sortable />
      <ReferenceField
        source="organisationId"
        label="Organization"
        reference={modules.organisation.ResourceName}
        link="show"
      >
        <TextField source="name" />
      </ReferenceField>
      <SimpleChipFieldArray
        source="restorationInterventionTypes"
        label="Restoration Intervention Types"
        choices={optionToChoices(getRestorationInterventionTypeOptions())}
      />
      <SelectField source="projectCountry" label="Countries" choices={countryChoices} />
      <DateField source="createdAt" label="Date Added" locales="en-GB" />
      <Menu menu={tableMenu} placement={MENU_PLACEMENT_BOTTOM_LEFT}>
        <Icon name={IconNames.ELIPSES} className="h-6 w-6 rounded-full p-1 hover:bg-neutral-200"></Icon>
      </Menu>
    </Datagrid>
  );
};

export const PitchesList = () => {
  const [exporting, setExporting] = useState<boolean>(false);
  const countryChoices = useGadmChoices({ level: 0 });

  const pitchDataProvider = useDataProvider<PitchDataProvider>();

  const handleExport = () => {
    setExporting(true);

    pitchDataProvider.export(modules.pitch.ResourceName).finally(() => setExporting(false));
  };

  return (
    <>
      <Stack gap={1} className="pb-6">
        <Text variant="text-36-bold" className="leading-none">
          Pitches
        </Text>
      </Stack>

      <List actions={<ListActions onExport={handleExport} />} filters={filters(countryChoices)}>
        <ApplicationDataGrid />
      </List>

      <ExportProcessingAlert show={exporting} />
    </>
  );
};
