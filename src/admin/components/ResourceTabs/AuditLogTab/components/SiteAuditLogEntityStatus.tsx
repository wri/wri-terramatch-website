import { FC } from "react";
import { Link as RaLink, useBasename } from "react-admin";

import modules from "@/admin/modules";
import Text from "@/components/elements/Text/Text";
import { AuditStatusResponse } from "@/generated/apiSchemas";

import CommentarySection from "../../PolygonReviewTab/components/CommentarySection/CommentarySection";
import { AuditLogButtonStates } from "../constants/enum";
import AuditLogTable from "./AuditLogTable";

export interface SiteAuditLogEntityStatusProps {
  record?: SelectedItem | null;
  auditLogData?: { data: AuditStatusResponse[] };
  refresh?: () => void;
  entityType?: number;
  entityName?: string;
  buttonToogle?: number;
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
  buttonToogle
}) => {
  const entityType = buttonToogle === AuditLogButtonStates.POLYGON;
  const isSite = buttonToogle === AuditLogButtonStates.SITE;
  const basename = useBasename();
  const getTitle = () => {
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
          refresh={refresh}
          viewCommentsList={false}
        />
      </div>
      <div>
        {!isSite && <Text variant="text-16-bold">History and Discussion for {getTitle()}</Text>}
        {isSite && (
          <Text variant="text-16-bold">
            <RaLink
              className="text-16-bold !text-[#000000DD]"
              to={`${basename}/${modules.site.ResourceName}/${record?.uuid}/show/6`}
            >
              {getTitle()}
            </RaLink>
          </Text>
        )}
      </div>
      {auditLogData && <AuditLogTable auditLogData={auditLogData} />}
    </div>
  );
};

export default SiteAuditLogEntityStatus;
