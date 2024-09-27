import { FC } from "react";

import Text from "@/components/elements/Text/Text";
import { AuditStatusResponse, ProjectLiteRead } from "@/generated/apiSchemas";

import AuditLogTable from "./AuditLogTable";

export interface SiteAuditLogProjectStatusProps {
  record?: ProjectLiteRead | null;
  auditLogData?: { data: AuditStatusResponse[] };
  auditData?: { entity: string; entity_uuid: string };
  refresh?: () => void;
}

const SiteAuditLogProjectStatus: FC<SiteAuditLogProjectStatusProps> = ({
  record,
  auditLogData,
  auditData,
  refresh
}) => (
  <div className="flex flex-col gap-6">
    <div>
      <Text variant="text-24-bold" className="mb-1">
        Project Status and Comments
      </Text>
      <Text variant="text-14-light" className="mb-4">
        Update the project status, view updates, or add comments
      </Text>
    </div>
    <Text variant="text-16-bold">History and Discussion for {record && record?.name}</Text>
    {auditLogData && <AuditLogTable auditLogData={auditLogData} auditData={auditData} refresh={refresh} />}
  </div>
);

export default SiteAuditLogProjectStatus;
