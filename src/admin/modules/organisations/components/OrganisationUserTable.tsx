import { Typography } from "@mui/material";
import { Datagrid, DateField, FunctionField, ReferenceManyField, TextField } from "react-admin";

import Menu from "@/components/elements/Menu/Menu";
import { MENU_PLACEMENT_RIGHT_BOTTOM } from "@/components/elements/Menu/MenuVariant";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { V2AdminUserRead } from "@/generated/apiSchemas";

import modules from "../..";

const OrganisationUserTable = () => {
  const tableItemMenu = () => [
    {
      id: "1",
      render: () => (
        <div className="flex items-center gap-2" onClick={() => {}}>
          <Text variant="text-12-bold" className="pr-2">
            Approved
          </Text>
        </div>
      )
    },
    {
      id: "2",
      render: () => (
        <div className="flex items-center gap-2" onClick={() => {}}>
          <Text variant="text-12-bold" className="pr-2">
            Rejected
          </Text>
        </div>
      )
    }
  ];
  return (
    <div>
      <Typography variant="h6" component="h3" mb={2}>
        Users
      </Typography>
      <ReferenceManyField
        reference={modules.user.ResourceName}
        target="organisation_uuid"
        label={false}
        emptyText="Not Provided"
      >
        <Datagrid bulkActionButtons={false} rowClick="show">
          <FunctionField label="Name" render={(user: V2AdminUserRead) => `${user.first_name} ${user.last_name}`} />
          <TextField source="email_address" />
          <DateField label="Last login date" source="last_logged_in_at" locales="en-GB" />
          <DateField label="Status" source="status" locales="en-GB" />
          <FunctionField
            label=""
            render={() => (
              <Menu menu={tableItemMenu()} placement={MENU_PLACEMENT_RIGHT_BOTTOM}>
                <div className="rounded p-1 hover:bg-primary-200">
                  <Icon
                    name={IconNames.ELIPSES}
                    className="roudn h-4 w-4 rounded-sm text-grey-720 hover:bg-primary-200"
                  />
                </div>
              </Menu>
            )}
          />
        </Datagrid>
      </ReferenceManyField>
    </div>
  );
};

export default OrganisationUserTable;
