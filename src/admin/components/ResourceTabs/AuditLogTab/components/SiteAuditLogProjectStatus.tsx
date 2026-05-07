import { useT } from "@transifex/react";
import { FC } from "react";

import Text from "@/components/elements/Text/Text";
import {
  AuditStatusDto,
  ProjectLightDto,
  ProjectReportLightDto
} from "@/generated/v3/entityService/entityServiceSchemas";

import AuditLogTable from "./AuditLogTable";

type SiteAuditLogProjectStatusProps = {
  record?: ProjectReportLightDto | ProjectLightDto | null;
  auditLogData?: { data: AuditStatusDto[] };
  auditData?: { entity: string; entityUuid: string };
  refresh?: () => void;
  viewPD?: boolean;
};

const SiteAuditLogProjectStatus: FC<SiteAuditLogProjectStatusProps> = ({
  record,
  auditLogData,
  auditData,
  refresh,
  viewPD = false
}) => {
  const t = useT();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Text variant="text-24-bold" className="mb-1">
          {t("Project Status and Comments")}
        </Text>
        <Text variant="text-14-light" className="mb-4">
          {t("Update the project status, view updates, or add comments")}
        </Text>
      </div>
      {viewPD && (
        <>
          <Text variant="text-16-bold">
            {t("History and Discussion for {name}", {
              name: record != null && "name" in record ? record.name : "Report"
            })}
          </Text>
          {auditLogData && <AuditLogTable auditLogData={auditLogData} auditData={auditData} refresh={refresh} />}
        </>
      )}
    </div>
  );
};

export default SiteAuditLogProjectStatus;
