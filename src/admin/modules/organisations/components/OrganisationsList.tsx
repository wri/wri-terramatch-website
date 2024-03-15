import { Divider, Stack, Tab, Tabs } from "@mui/material";
import { Fragment, useCallback, useState } from "react";
import {
  Datagrid,
  DateField,
  EditButton,
  List,
  SearchInput,
  SelectField,
  SelectInput,
  ShowButton,
  TextField,
  useDataProvider,
  useListContext
} from "react-admin";

import { OrganisationDataProvider } from "@/admin/apiProvider/dataProviders/organisationDataProvider";
import ListActions from "@/admin/components/Actions/ListActions";
import ExportProcessingAlert from "@/admin/components/Alerts/ExportProcessingAlert";
import FundingProgrammesArrayField from "@/admin/components/Fields/FundingProgrammesArrayField";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_BOTTOM_LEFT } from "@/components/elements/Menu/MenuVariant";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { getOrganisationTypeOptions } from "@/constants/options/organisations";
import { optionToChoices } from "@/utils/options";

import modules from "../..";
import { useGetOrganisationsTotals } from "../hooks/useGetOrganisationsTotal";

const tabs = [
  { id: "draft", name: "Draft" },
  { id: "pending", name: "Pending" },
  { id: "approved", name: "Approved" },
  { id: "rejected", name: "Rejected" }
];

const filters = [
  <SearchInput key="s" source="search" alwaysOn className="search-pa" />,
  <SelectInput
    key="c"
    label="Organisation Type"
    source="type"
    className="select-pa"
    choices={optionToChoices(getOrganisationTypeOptions())}
  />
];

const ApplicationDataGrid = () => {
  const listContext = useListContext();
  const { filterValues, setFilters, displayedFilters } = listContext;

  const totals = useGetOrganisationsTotals(filterValues);

  const handleChange = useCallback(
    (event: React.ChangeEvent<{}>, value: any) => {
      setFilters &&
        setFilters(
          { ...filterValues, status: value },
          displayedFilters,
          false // no debounce, we want the filter to fire immediately
        );
    },
    [displayedFilters, filterValues, setFilters]
  );

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

  return (
    <Fragment>
      <Tabs variant="fullWidth" centered value={filterValues.status} indicatorColor="primary" onChange={handleChange}>
        {tabs.map(choice => (
          <Tab
            key={choice.id}
            label={
              //@ts-ignore
              totals[choice.id]
                ? //@ts-ignore
                  `${choice.name} (${totals[choice.id]})`
                : choice.name
            }
            value={choice.id}
          />
        ))}
      </Tabs>
      <Divider />
      <Datagrid>
        <DateField source="created_at" label="Date Created" locales="en-GB" />
        <TextField source="name" label="Organisation Name" />
        <SelectField label="Organisation Type" source="type" choices={optionToChoices(getOrganisationTypeOptions())} />
        <TextField source="readable_status" label="Organisation Status" />
        <FundingProgrammesArrayField label="Funding Programmes" />
        <Menu menu={tableMenu} placement={MENU_PLACEMENT_BOTTOM_LEFT}>
          <Icon name={IconNames.ELIPSES} className="h-6 w-6 rounded-full p-1 hover:bg-neutral-200"></Icon>
        </Menu>
      </Datagrid>
    </Fragment>
  );
};

export const OrganisationsList = () => {
  const [exporting, setExporting] = useState<boolean>(false);

  const organisationDataProvider = useDataProvider<OrganisationDataProvider>();

  const handleExport = () => {
    setExporting(true);

    organisationDataProvider.export(modules.organisation.ResourceName).finally(() => setExporting(false));
  };

  return (
    <>
      <Stack gap={1} className="pb-6">
        <Text variant="text-36-bold" className="leading-none">
          Organisations
        </Text>
      </Stack>
      <List
        actions={<ListActions onExport={handleExport} />}
        filters={filters}
        filterDefaultValues={{ status: tabs[0].id }}
      >
        <ApplicationDataGrid />
      </List>

      <ExportProcessingAlert show={exporting} />
    </>
  );
};
