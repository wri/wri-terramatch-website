import { Stack } from "@mui/material";
import { FC } from "react";
import { Datagrid, FunctionField, TextField } from "react-admin";

import { AutoResetSort } from "@/admin/components/Actions/ListActions";
import { List } from "@/admin/components/AdminList";
import Text from "@/components/elements/Text/Text";
import { useFrameworkChoices } from "@/constants/options/frameworks";
import { AboutSectionDto } from "@/generated/v3/entityService/entityServiceSchemas";

const AboutSectionsList: FC = () => {
  const frameworkChoices = useFrameworkChoices();
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
          <TextField source="type" label="About Section Type" />
          <FunctionField
            source="frameworks"
            label="Override Frameworks"
            render={(record?: AboutSectionDto) => {
              return (record?.frameworks ?? [])
                .map(frameworkKey => frameworkChoices.find(({ id }) => id === frameworkKey)?.name ?? frameworkKey)
                .join(", ");
            }}
          />
        </Datagrid>
      </List>
    </>
  );
};

export default AboutSectionsList;
