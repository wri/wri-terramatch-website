import { Stack } from "@mui/material";
import { isEmpty } from "lodash";
import { FC } from "react";
import {
  CreateButton,
  Datagrid,
  DeleteWithConfirmButton,
  EditButton,
  FilterButton,
  FunctionField,
  SelectInput,
  TextField,
  TopToolbar,
  useRecordContext,
  WrapperField
} from "react-admin";

import { AutoResetSort } from "@/admin/components/Actions/ListActions";
import { List } from "@/admin/components/AdminList";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_BOTTOM_LEFT } from "@/components/elements/Menu/MenuVariant";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { useFrameworkChoices } from "@/constants/options/frameworks";
import { AboutSectionConstants } from "@/generated/v3/entityService/entityServiceConstants";
import { AboutSectionDto } from "@/generated/v3/entityService/entityServiceSchemas";

const ListActionsAboutSections: FC = () => (
  <TopToolbar>
    <FilterButton className="filter-button-page-admin" />
    <CreateButton className="filter-button-page-admin-blue" label="Add About Section" />
  </TopToolbar>
);

const DeleteAboutSectionButton: FC = () => {
  const section = useRecordContext() as AboutSectionDto;
  return (
    <WrapperField>
      <DeleteWithConfirmButton
        disabled={isEmpty(section.frameworks)}
        confirmTitle="Delete About Section"
        confirmContent={`You are about to delete the "${
          section.type
        }" About Section for frameworks: ${section.frameworks?.join(", ")}`}
      />
    </WrapperField>
  );
};

const TABLE_MENU = [
  {
    id: "1",
    render: () => <EditButton />
  },
  {
    id: "2",
    render: () => <DeleteAboutSectionButton />
  }
];

const FILTERS = [
  <SelectInput
    key="type"
    label="Type"
    source="type"
    choices={AboutSectionConstants.TYPES.map(type => ({ id: type, name: type }))}
    className="select-page-admin"
  />
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
        <Datagrid bulkActionButtons={false}>
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
          <Menu menu={TABLE_MENU} placement={MENU_PLACEMENT_BOTTOM_LEFT}>
            <Icon name={IconNames.ELIPSES} className="h-6 w-6 rounded-full p-1 hover:bg-neutral-200" />
          </Menu>
        </Datagrid>
      </List>
    </>
  );
};

export default AboutSectionsList;
