import { FunctionField } from "react-admin";

import { PLANTING_STATUS_MAP } from "@/components/elements/Status/constants/statusMap";

const ReadablePlantingStatusField = ({ prop }: { prop: string }) => (
  <FunctionField
    source={prop}
    render={(record: any) => (record[prop] == null ? null : PLANTING_STATUS_MAP[record[prop]])}
  />
);

export default ReadablePlantingStatusField;
