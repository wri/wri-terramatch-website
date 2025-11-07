import { Stack } from "@mui/material";
import { FC } from "react";
import { Datagrid, EditButton, List, ShowButton, TextField, WrapperField } from "react-admin";

import { AutoResetSort } from "@/admin/components/Actions/ListActions";
import ListActionsCreate from "@/admin/components/Actions/ListActionsCreate";
import CustomDeleteWithConfirmButton from "@/admin/components/Buttons/CustomDeleteWithConfirmButton";
import { useGetUserRole } from "@/admin/hooks/useGetUserRole";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_BOTTOM_LEFT } from "@/components/elements/Menu/MenuVariant";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

export const ReportingFrameworkList: FC = () => {
  const { isSuperAdmin } = useGetUserRole();

  const commonMenu = [
    {
      id: "1",
      render: () => <EditButton />
    },
    {
      id: "2",
      render: () => <ShowButton />
    }
  ];

  const tableMenu = isSuperAdmin
    ? [
        ...commonMenu,
        {
          id: "3",
          render: () => (
            <WrapperField>
              <CustomDeleteWithConfirmButton source="name" />
            </WrapperField>
          )
        }
      ]
    : commonMenu;

  return (
    <>
      <Stack gap={1} className="pb-6">
        <Text variant="text-36-bold" className="leading-none">
          Reporting Frameworks
        </Text>
      </Stack>

      <List actions={<ListActionsCreate />}>
        <AutoResetSort />
        <Datagrid bulkActionButtons={false} rowClick={"show"}>
          <TextField source="name" label="Framework" />
          <TextField source="access_code" label="Access Code" />
          <TextField source="total_projects_count" label="Enrolled Projects" />
          <Menu menu={tableMenu} placement={MENU_PLACEMENT_BOTTOM_LEFT}>
            <Icon name={IconNames.ELIPSES} className="h-6 w-6 rounded-full p-1 hover:bg-neutral-200"></Icon>
          </Menu>
        </Datagrid>
      </List>
    </>
  );
};
