import { FC } from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import { ProjectLiteRead } from "@/generated/apiSchemas";
import { AuditStatusDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { ProjectLightDto } from "@/generated/v3/entityService/entityServiceSchemas";

import AuditLogTable from "./AuditLogTable";

export interface SiteAuditLogProjectStatusProps {
  record?: ProjectLiteRead | ProjectLightDto | null;
  auditLogData?: { data: AuditStatusDto[] };
  auditData?: { entity: string; entityUuid: string };
  refresh?: () => void;
  viewPD?: boolean;
}

const SiteAuditLogProjectStatus: FC<SiteAuditLogProjectStatusProps> = ({
  record,
  auditLogData,
  auditData,
  refresh,
  viewPD = false
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
    <When condition={viewPD}>
      <Text variant="text-16-bold">History and Discussion for {record?.name}</Text>
      {auditLogData && <AuditLogTable auditLogData={auditLogData} auditData={auditData} refresh={refresh} />}
    </When>
  </div>
);

export default SiteAuditLogProjectStatus;
