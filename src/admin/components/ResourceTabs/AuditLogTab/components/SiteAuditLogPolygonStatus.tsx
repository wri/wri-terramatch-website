import { FC, useMemo } from "react";

import Text from "@/components/elements/Text/Text";
import { AuditStatusResponseWithData } from "@/generated/apiSchemas";

import ComentarySection from "../../PolygonReviewTab/components/ComentarySection/ComentarySection";
import AuditLogTable from "./AuditLogTable";

export interface SiteAuditLogPolygonStatusProps {
  record?: any;
  auditLogData?: AuditStatusResponseWithData;
  refresh?: () => void;
}

const SiteAuditLogPolygonStatus: FC<SiteAuditLogPolygonStatusProps> = ({ record, auditLogData, refresh }) => {
  const polygonData = useMemo(
    () => ({
      uuid: record?.uuid,
      status: record?.meta,
      title: record?.title
    }),
    [record]
  );
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Text variant="text-24-bold" className="mb-1">
          Polygon Status and Comments
        </Text>
        <Text variant="text-14-light" className="mb-4">
          Update the polygon status, view updates, or add comments
        </Text>
      </div>
      <ComentarySection
        record={polygonData}
        entity={"SitePolygon"}
        auditLogData={auditLogData?.data}
        refresh={refresh}
        viewCommentsList={false}
      />
      <Text variant="text-16-bold">History and Discussion for {record?.title}</Text>
      {auditLogData && <AuditLogTable auditLogData={auditLogData} />}
    </div>
  );
};

export default SiteAuditLogPolygonStatus;
