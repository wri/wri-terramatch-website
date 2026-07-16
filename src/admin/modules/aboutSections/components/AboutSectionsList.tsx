import { Stack } from "@mui/material";
import { FC } from "react";
import { Datagrid, TextField } from "react-admin";

import { AutoResetSort } from "@/admin/components/Actions/ListActions";
import { List } from "@/admin/components/AdminList";
import Text from "@/components/elements/Text/Text";

const AboutSectionsList: FC = () => {
  return (
    <>
      <Stack gap={1} className="pb-6">
        <Text variant="text-36-bold" className="leading-none">
          About Sections
        </Text>
      </Stack>

      <List actions={<></>}>
        <AutoResetSort />
        <Datagrid>
          <TextField source="type" label="About Story Type" />
          <TextField source="frameworks" label="Frameworks (empty is default)" />
        </Datagrid>
      </List>
    </>
  );
};

export default AboutSectionsList;
