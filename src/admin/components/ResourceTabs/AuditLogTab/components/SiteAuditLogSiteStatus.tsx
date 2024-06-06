import { FC } from "react";

import Text from "@/components/elements/Text/Text";
import { AuditStatusResponseWithData } from "@/generated/apiSchemas";

import CommentarySection from "../../PolygonReviewTab/components/CommentarySection/CommentarySection";
import AuditLogTable from "./AuditLogTable";

export interface SiteAuditLogSiteStatusProps {
  record?: any;
  auditLogData?: AuditStatusResponseWithData;
  refresh?: () => void;
}

const SiteAuditLogSiteStatus: FC<SiteAuditLogSiteStatusProps> = ({ record, auditLogData, refresh }) => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Text variant="text-24-bold" className="mb-1">
          Site Status and Comments
        </Text>
        <Text variant="text-14-light" className="mb-4">
          Update the site status, view updates, or add comments
        </Text>
        <CommentarySection
          record={record}
          entity={"Site"}
          auditLogData={auditLogData?.data}
          refresh={refresh}
          viewCommentsList={false}
        />
      </div>
      <Text variant="text-16-bold">History and Discussion for {record?.name}</Text>
      {auditLogData && <AuditLogTable auditLogData={auditLogData} />}
    </div>
  );
};

export default SiteAuditLogSiteStatus;
