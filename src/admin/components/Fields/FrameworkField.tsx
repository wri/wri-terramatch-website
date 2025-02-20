import { FunctionField } from "react-admin";

import { useFrameworkChoices } from "@/constants/options/frameworks";

const FrameworkField = ({ prop = "framework_key" }: { prop?: string }) => {
  const frameworkChoices = useFrameworkChoices();

  return (
    <FunctionField
      source={prop}
      label="Framework"
      render={(record: any) =>
        frameworkChoices.find((framework: any) => framework.id === record?.[prop])?.name || record?.[prop]
      }
      sortable={false}
    />
  );
};

export default FrameworkField;
