import { FunctionField } from "react-admin";

import { STATUS_MAP } from "@/components/elements/Status/constants/statusMap";
import { activeUpdateRequestStatus } from "@/helpers/entity";

type StatusRecord = {
  status?: string | null;
};

const ReadableStatusField = ({
  prop,
  ignoreUnlessChangeRequestAllowed = false
}: {
  prop: string;
  ignoreUnlessChangeRequestAllowed?: boolean;
}) => (
  <FunctionField
    source={prop}
    render={(record?: StatusRecord) => {
      if (record == null) return null;

      const rawValue = (record as Record<string, unknown>)[prop];
      const rawStatus = typeof rawValue === "string" ? rawValue : null;
      const value = ignoreUnlessChangeRequestAllowed ? activeUpdateRequestStatus(record.status, rawStatus) : rawStatus;
      return value == null ? null : STATUS_MAP[value];
    }}
  />
);

export default ReadableStatusField;
