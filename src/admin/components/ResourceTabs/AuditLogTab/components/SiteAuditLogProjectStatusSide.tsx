import { fetchPutV2AdminProjectsUUID } from "@/generated/apiComponents";

import ComentarySection from "../../PolygonReviewTab/components/ComentarySection/ComentarySection";
import StatusDisplay from "../../PolygonReviewTab/components/PolygonStatus/StatusDisplay ";

const SiteAuditLogProjectStatusSide = ({
  record,
  refresh,
  auditLogData
}: {
  record?: any;
  refresh?: any;
  auditLogData?: any;
}) => {
  const mutate = fetchPutV2AdminProjectsUUID;
  console.log("record", record);
  return (
    <div className="flex flex-col gap-6">
      <StatusDisplay
        titleStatus="Project"
        status={record?.status}
        record={record}
        name={record?.name}
        mutate={mutate}
        refresh={refresh}
      />
      <ComentarySection record={record} auditLogData={auditLogData} mutate={mutate} refresh={refresh} />
    </div>
  );
};

export default SiteAuditLogProjectStatusSide;
