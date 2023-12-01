import { FC } from "react";
import { FunctionField } from "react-admin";

import { frameworkChoices } from "@/constants/options/frameworks";

const FrameworkField: FC = () => {
  return (
    <FunctionField
      source="framework_key"
      label="Framework"
      render={(record: any) =>
        frameworkChoices.find(framework => framework.id === record?.framework_key)?.name || record?.framework_key
      }
      sortable={false}
    />
  );
};

export default FrameworkField;
