import { Divider, Tab, Tabs } from "@mui/material";
import { Fragment, useCallback } from "react";
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
import FundingProgrammesArrayField from "@/admin/components/Fields/FundingProgrammesArrayField";
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
  <SearchInput key="s" source="search" alwaysOn />,
  <SelectInput
    key="c"
    label="Organisation Type"
    source="type"
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
        <DateField source="created_at" label="Date Created" />
        <TextField source="name" label="Organisation Name" />
        <SelectField label="Organisation Type" source="type" choices={optionToChoices(getOrganisationTypeOptions())} />
        <TextField source="readable_status" label="Organisation Status" />
        <FundingProgrammesArrayField label="Funding Programmes" />
        <ShowButton />
        <EditButton />
      </Datagrid>
    </Fragment>
  );
};

export const OrganisationsList = () => {
  const organisationDataProvider = useDataProvider<OrganisationDataProvider>();

  return (
    <List
      actions={<ListActions onExport={() => organisationDataProvider.export(modules.organisation.ResourceName)} />}
      filters={filters}
      filterDefaultValues={{ status: tabs[0].id }}
    >
      <ApplicationDataGrid />
    </List>
  );
};
