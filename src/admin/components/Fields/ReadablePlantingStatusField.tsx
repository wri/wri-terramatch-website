import { FunctionField } from "react-admin";

import { PLANTING_STATUS_MAP } from "@/components/elements/Status/constants/statusMap";

interface ReadablePlantingStatusFieldProps {
  prop?: string;
  value?: string | null;
}

const ReadablePlantingStatusField = ({ prop, value }: ReadablePlantingStatusFieldProps) => {
  // If value is provided directly, use it; otherwise use the prop from record
  if (value !== undefined) {
    return <>{value == null ? null : PLANTING_STATUS_MAP[value]}</>;
  }

  if (!prop) {
    return null;
  }

  return (
    <FunctionField
      source={prop}
      render={(record: any) => (record[prop] == null ? null : PLANTING_STATUS_MAP[record[prop]])}
    />
  );
};

export default ReadablePlantingStatusField;
