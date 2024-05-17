import { fetchPutV2AdminSitesUUID } from "@/generated/apiComponents";

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
  const status = record?.readable_status === "Unknown" ? "Planting in progress" : record?.readable_status;
  return (
    <div className="flex flex-col gap-6">
      <StatusDisplay
        titleStatus="Site"
        name={record.name}
        status={status}
        refresh={refresh}
        record={record}
        mutate={mutate}
      />
      <ComentarySection record={record} auditLogData={auditLogData} mutate={mutate} refresh={refresh} />
    </div>
  );
};

export default SiteAuditLogSiteStatusSide;
