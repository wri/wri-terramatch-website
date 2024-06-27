import { FC } from "react";
import { Link as RaLink, useBasename } from "react-admin";
import { When } from "react-if";

import modules from "@/admin/modules";
import Text from "@/components/elements/Text/Text";
import { AuditStatusResponse } from "@/generated/apiSchemas";

import CommentarySection from "../../PolygonReviewTab/components/CommentarySection/CommentarySection";
import { AuditLogButtonStates } from "../constants/enum";
import { AuditLogEntity } from "../constants/types";
import AuditLogTable from "./AuditLogTable";

export interface SiteAuditLogEntityStatusProps {
  entityType: AuditLogEntity;
  record: SelectedItem | null;
  auditLogData?: { data: AuditStatusResponse[] };
  refresh: () => void;
  buttonToggle: number;
  verifyEntity?: boolean;
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
  entityType,
  record,
  auditLogData,
  refresh,
  buttonToggle,
  verifyEntity
}) => {
  const isSite = buttonToggle === AuditLogButtonStates.SITE;
  const basename = useBasename();

  const getTitle = () => record?.title ?? record?.name;

  const removeUnderscore = (title: string) => title.replace("_", " ");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Text variant="text-24-bold" className="mb-1">
          {removeUnderscore(entityType)} Status and Comments
        </Text>
        <Text variant="text-14-light" className="mb-4">
          Update the {removeUnderscore(entityType)?.toLowerCase()} status, view updates, or add comments
        </Text>
        <CommentarySection record={record} entity={entityType} refresh={refresh} viewCommentsList={false} />
      </div>
      <div>
        {!isSite && !verifyEntity && <Text variant="text-16-bold">History and Discussion for {getTitle()}</Text>}
        {(isSite || verifyEntity) && (
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
      <When condition={!!auditLogData}>
        <AuditLogTable auditLogData={auditLogData!} />
      </When>
    </div>
  );
};

export default SiteAuditLogEntityStatus;
