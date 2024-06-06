import { FC } from "react";

import Text from "@/components/elements/Text/Text";
import { AuditStatusResponseWithData } from "@/generated/apiSchemas";

import CommentarySection from "../../PolygonReviewTab/components/CommentarySection/CommentarySection";
import AuditLogTable from "./AuditLogTable";

export interface SiteAuditLogEntityStatusProps {
  record?: SelectedItem | null;
  auditLogData?: AuditStatusResponseWithData;
  refresh?: () => void;
  entityType?: number;
  entityName?: string;
  buttonToogle?: number;
  buttonStates?: { PROJECTS: number; SITE: number; POLYGON: number };
}

interface SelectedItem {
  title?: string | undefined;
  name?: string | undefined;
  uuid?: string | undefined;
  value?: string | undefined;
  meta?: string | undefined;
  status?: string | undefined;
}

const SiteAuditLogEntityStatus: FC<SiteAuditLogEntityStatusProps> = ({
  record,
  auditLogData,
  refresh,
  buttonToogle,
  buttonStates
}) => {
  const entityType = buttonToogle === buttonStates?.POLYGON;
  const title = () => {
    if (!record?.title) {
      return record?.name;
    } else {
      return record?.title;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Text variant="text-24-bold" className="mb-1">
          {entityType ? "Polygon" : "Site"} Status and Comments
        </Text>
        <Text variant="text-14-light" className="mb-4">
          Update the {entityType ? "polygon" : "site"} status, view updates, or add comments
        </Text>
        <CommentarySection
          record={record}
          entity={entityType ? "SitePolygon" : "Site"}
          auditLogData={auditLogData?.data}
          refresh={refresh}
          viewCommentsList={false}
        />
      </div>
      <Text variant="text-16-bold">History and Discussion for {title()}</Text>
      {auditLogData && <AuditLogTable auditLogData={auditLogData} />}
    </div>
  );
};

export default SiteAuditLogEntityStatus;
