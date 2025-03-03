import Link from "next/link";
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
  viewPD?: boolean;
  auditData?: { entity: string; entity_uuid: string };
  isProjectReport?: boolean;
}

interface SelectedItem {
  title?: string | undefined;
  name?: string | undefined;
  uuid?: string | undefined;
  value?: string | undefined;
  meta?: string | undefined;
  status?: string | undefined;
}

const reportTypesMappging: { [key: number]: string } = {
  4: "project-reports",
  5: "site-reports",
  6: "nursery-reports"
};

const SiteAuditLogEntityStatus: FC<SiteAuditLogEntityStatusProps> = ({
  entityType,
  record,
  auditLogData,
  refresh,
  buttonToggle,
  verifyEntity,
  viewPD = false,
  auditData,
  isProjectReport
}) => {
  const isSite = buttonToggle === AuditLogButtonStates.SITE;
  const isNurseryToggle = buttonToggle === AuditLogButtonStates.NURSERY;
  const basename = useBasename();

  const formatUrl = () => {
    switch (reportTypesMappging[buttonToggle]) {
      case "project-reports":
        return `/${modules.projectReport.ResourceName}/${record?.uuid}/show/4`;
      case "site-reports":
        return `/${modules.siteReport.ResourceName}/${record?.uuid}/show/4`;
      case "nursery-reports":
        return `/${modules.nurseryReport.ResourceName}/${record?.uuid}/show/4`;
      default:
        return "";
    }
  };

  const title = () => record?.title ?? record?.name;
  const redirectTo = viewPD
    ? `/${
        isProjectReport
          ? "reports/" + reportTypesMappging[buttonToggle].replace(/s$/, "")
          : isNurseryToggle
          ? "nursery"
          : "site"
      }/${record?.uuid}${isNurseryToggle ? "" : "?tab=audit-log"}`
    : `${basename}${isProjectReport ? formatUrl() : `/${modules.site.ResourceName}/${record?.uuid}/show/6`}`;

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
      <When condition={viewPD}>
        <div>
          {!isSite && !verifyEntity && !isNurseryToggle && (
            <Text variant="text-16-bold">History and Discussion for {title()}</Text>
          )}
          {(isSite || verifyEntity || isNurseryToggle) && (
            <Text variant="text-16-bold">
              History and Discussion for{" "}
              {viewPD ? (
                <Link className="text-16-bold !text-[#000000DD]" href={redirectTo}>
                  {title()}
                </Link>
              ) : (
                <RaLink className="text-16-bold !text-[#000000DD]" to={redirectTo}>
                  {title()}
                </RaLink>
              )}
            </Text>
          )}
        </div>
      </When>
      <When condition={!!auditLogData && viewPD}>
        <AuditLogTable auditLogData={auditLogData!} auditData={auditData} refresh={refresh} />
      </When>
    </div>
  );
};

export default SiteAuditLogEntityStatus;
