import { fetchPostV2AuditStatus, fetchPutV2AdminProjectsUUID } from "@/generated/apiComponents";

import ComentarySection from "../../PolygonReviewTab/components/ComentarySection/ComentarySection";
import StatusDisplay from "../../PolygonReviewTab/components/PolygonStatus/StatusDisplay ";

const SiteAuditLogProjectStatusSide = ({ record, refresh }: { record?: any; refresh?: any }) => {
  const mutate = fetchPutV2AdminProjectsUUID;
  const mutateComment = fetchPostV2AuditStatus;
  return (
    <div className="flex flex-col gap-6">
      <StatusDisplay titleStatus="Project" record={record} name={record?.name} mutate={mutate} refresh={refresh} />
      <ComentarySection record={record} entity={"Project"} mutate={mutateComment} refresh={refresh} />
    </div>
  );
};

export default SiteAuditLogProjectStatusSide;
