import { FunctionField } from "react-admin";

import { STATUS_MAP } from "@/components/elements/Status/constants/statusMap";

const ReadableStatusField = ({ prop }: { prop: string }) => (
  <FunctionField source={prop} render={(record: any) => (record[prop] == null ? null : STATUS_MAP[record[prop]])} />
);

export default ReadableStatusField;
