import { Stack } from "@mui/material";
import { FC } from "react";
import { CreateButton, Datagrid, FilterButton, FunctionField, SelectInput, TextField, TopToolbar } from "react-admin";

import { AutoResetSort } from "@/admin/components/Actions/ListActions";
import { List } from "@/admin/components/AdminList";
import { SECTION_TYPE_CHOICES } from "@/admin/modules/aboutSections/util";
import Text from "@/components/elements/Text/Text";
import { useFrameworkChoices } from "@/constants/options/frameworks";
import { AboutSectionDto } from "@/generated/v3/entityService/entityServiceSchemas";

const ListActionsAboutSections: FC = () => (
  <TopToolbar>
    <FilterButton className="filter-button-page-admin" />
    <CreateButton className="filter-button-page-admin-blue" label="Add About Section" />
  </TopToolbar>
);

const FILTERS = [
  <SelectInput key="type" label="Type" source="type" choices={SECTION_TYPE_CHOICES} className="select-page-admin" />
];

const AboutSectionsList: FC = () => {
  const frameworkChoices = useFrameworkChoices();

  return (
    <>
      <Stack gap={1} className="pb-6">
        <Text variant="text-36-bold" className="leading-none">
          About Sections
        </Text>
      </Stack>

      <List actions={<ListActionsAboutSections />} filters={FILTERS}>
        <AutoResetSort />
        <Datagrid rowClick="show" bulkActionButtons={false}>
          <TextField source="type" label="Type" />
          <FunctionField
            source="frameworks"
            label="Override Frameworks"
            render={(record?: AboutSectionDto) =>
              (record?.frameworks ?? [])
                .map(frameworkKey => frameworkChoices.find(({ id }) => id === frameworkKey)?.name ?? frameworkKey)
                .join(", ")
            }
          />
        </Datagrid>
      </List>
    </>
  );
};

export default AboutSectionsList;
