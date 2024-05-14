import { fetchPutV2AdminSitesUUID } from "@/generated/apiComponents";

import ComentarySection from "../../PolygonReviewTab/components/ComentarySection/ComentarySection";
import StatusDisplay from "../../PolygonReviewTab/components/PolygonStatus/StatusDisplay ";

const SiteAuditLogSiteStatusSide = ({ record, refresh }: { record?: any; refresh?: any }) => {
  const mutate = fetchPutV2AdminSitesUUID;
  return (
    <div className="flex flex-col gap-6">
      <StatusDisplay
        titleStatus="Site"
        name={record.name}
        status={record.readable_status}
        refresh={refresh}
        record={record}
        mutate={mutate}
      />
      <ComentarySection />
    </div>
  );
};

export default SiteAuditLogSiteStatusSide;
