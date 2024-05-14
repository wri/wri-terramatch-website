import { fetchPutV2AdminProjectsUUID } from "@/generated/apiComponents";

import ComentarySection from "../../PolygonReviewTab/components/ComentarySection/ComentarySection";
import StatusDisplay from "../../PolygonReviewTab/components/PolygonStatus/StatusDisplay ";

const SiteAuditLogProjectStatusSide = ({ record, refresh }: { record?: any; refresh?: any }) => {
  const mutate = fetchPutV2AdminProjectsUUID;
  console.log("record", record);
  return (
    <div className="flex flex-col gap-6">
      <StatusDisplay
        titleStatus="Project"
        status={record?.readable_status}
        record={record}
        name={record?.name}
        mutate={mutate}
        refresh={refresh}
      />
      <ComentarySection />
    </div>
  );
};

export default SiteAuditLogProjectStatusSide;
