import { Divider, Stack, Tab, Tabs } from "@mui/material";
import { useT } from "@transifex/react";
import { Fragment, useCallback, useState } from "react";
import {
  Datagrid,
  DateField,
  EditButton,
  SearchInput,
  SelectField,
  SelectInput,
  ShowButton,
  TextField,
  useListContext
} from "react-admin";

import { AutoResetSort } from "@/admin/components/Actions/ListActions";
import ListActionsCreateFilter from "@/admin/components/Actions/ListActionsCreateFilter";
import { List } from "@/admin/components/AdminList";
import ExportProcessingAlert from "@/admin/components/Alerts/ExportProcessingAlert";
import { useGetUserRole } from "@/admin/hooks/useGetUserRole";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_BOTTOM_LEFT } from "@/components/elements/Menu/MenuVariant";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { downloadOrganisationCsv } from "@/connections/Organisation";
import { getOrganisationTypeOptions } from "@/constants/options/organisations";
import { ToastType, useToastContext } from "@/context/toast.provider";
import Log from "@/utils/log";
import { downloadFileUrl } from "@/utils/network";
import { optionToChoices } from "@/utils/options";

import { useGetOrganisationsTotals } from "../hooks/useGetOrganisationsTotal";

const tabs = [
  { id: "draft", name: "Draft" },
  { id: "pending", name: "Pending" },
  { id: "approved", name: "Approved" },
  { id: "rejected", name: "Rejected" }
];

const filters = [
  <SearchInput key="s" source="search" alwaysOn className="search-page-admin" />,
  <SelectInput
    key="c"
    label="Organisation Type"
    source="type"
    className="select-page-admin"
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
      <Datagrid rowClick={"show"}>
        <DateField source="createdAt" label="Date Created" locales="en-GB" />
        <TextField source="name" label="Organisation Name" />
        <SelectField label="Organisation Type" source="type" choices={optionToChoices(getOrganisationTypeOptions())} />
        <TextField className="capitalize" source="status" label="Organisation Status" />
        <Menu menu={tableMenu} placement={MENU_PLACEMENT_BOTTOM_LEFT}>
          <Icon name={IconNames.ELIPSES} className="h-6 w-6 rounded-full p-1 hover:bg-neutral-200"></Icon>
        </Menu>
      </Datagrid>
    </Fragment>
  );
};

export const OrganisationsList = () => {
  const t = useT();
  const [exporting, setExporting] = useState<boolean>(false);
  const { openToast } = useToastContext();
  const { isSuperAdmin } = useGetUserRole();

  const handleExport = useCallback(async () => {
    setExporting(true);

    const { data, loadFailure } = await downloadOrganisationCsv();
    if (data != null) {
      openToast(t("Successfully exported"));
      downloadFileUrl(data.url);
    } else {
      Log.error("Organisation export failed", loadFailure);
      openToast(t("Something went wrong!"), ToastType.ERROR);
    }

    setExporting(false);
  }, [openToast, t]);

  return (
    <>
      <Stack gap={1} className="pb-6">
        <Text variant="text-36-bold" className="leading-none">
          Organisations
        </Text>
      </Stack>
      <List
        actions={<ListActionsCreateFilter canCreate={isSuperAdmin} onExport={handleExport} />}
        filters={filters}
        filterDefaultValues={{ status: tabs[0].id }}
        perPage={10}
        sort={{ field: "name", order: "ASC" }}
      >
        <AutoResetSort />
        <ApplicationDataGrid />
      </List>

      <ExportProcessingAlert show={exporting} />
    </>
  );
};
