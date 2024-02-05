import { FC, useEffect, useState } from "react";
import { FunctionField } from "react-admin";

import { useFrameworkChoices } from "@/constants/options/frameworks";

const FrameworkField: FC = () => {
  const [frameworkChoices, setFrameworkChoices] = useState<any>([]);
  const fetchData = async () => {
    try {
      const choices = await useFrameworkChoices();
      setFrameworkChoices(choices);
    } catch (error) {
      console.error("Error fetching framework choices:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <FunctionField
      source="framework_key"
      label="Framework"
      render={(record: any) =>
        frameworkChoices.find((framework: any) => framework.id === record?.framework_key)?.name || record?.framework_key
      }
      sortable={false}
    />
  );
};

export default FrameworkField;
