import { fetchPostV2AuditStatus, fetchPutV2AdminSitesUUID } from "@/generated/apiComponents";

import ComentarySection from "../../PolygonReviewTab/components/ComentarySection/ComentarySection";
import StatusDisplay from "../../PolygonReviewTab/components/PolygonStatus/StatusDisplay ";

const SiteAuditLogSiteStatusSide = ({
  record,
  refresh,
  auditLogData
}: {
  record?: any;
  refresh?: any;
  auditLogData?: any;
}) => {
  const mutate = fetchPutV2AdminSitesUUID;
  const mutateComment = fetchPostV2AuditStatus;
  return (
    <div className="flex flex-col gap-6">
      <StatusDisplay titleStatus="Site" name={record.name} refresh={refresh} record={record} mutate={mutate} />
      <ComentarySection
        record={record}
        entity={"Site"}
        auditLogData={auditLogData}
        mutate={mutateComment}
        refresh={refresh}
      />
    </div>
  );
};

export default SiteAuditLogSiteStatusSide;
