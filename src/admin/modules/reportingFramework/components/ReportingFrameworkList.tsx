import { Stack } from "@mui/material";
import { FC } from "react";
import { Datagrid, EditButton, List, ShowButton, TextField, WrapperField } from "react-admin";

import CustomDeleteWithConfirmButton from "@/admin/components/Buttons/CustomDeleteWithConfirmButton";
import { useGetUserRole } from "@/admin/hooks/useGetUserRole";
import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_BOTTOM_LEFT } from "@/components/elements/Menu/MenuVariant";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

export const ReportingFrameworkList: FC = () => {
  const { isSuperAdmin } = useGetUserRole();
  const tableMenu = [
    {
      id: "1",
      render: () => <EditButton />
    },
    {
      id: "2",
      render: () => <ShowButton />
    },
    {
      id: "3",
      render: () => (
        <>
          {isSuperAdmin && (
            <WrapperField>
              <CustomDeleteWithConfirmButton source="name" />
            </WrapperField>
          )}
        </>
      )
    }
  ];

  return (
    <>
      <Stack gap={1} className="pb-6">
        <Text variant="text-36-bold" className="leading-none">
          Reporting Frameworks
        </Text>
      </Stack>

      <List>
        <Datagrid bulkActionButtons={false}>
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
