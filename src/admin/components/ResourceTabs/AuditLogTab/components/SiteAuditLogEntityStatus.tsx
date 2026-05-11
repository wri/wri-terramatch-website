import { useT } from "@transifex/react";
import Link from "next/link";
import { FC } from "react";
import { Link as RaLink, useBasename } from "react-admin";

import modules from "@/admin/modules";
import Text from "@/components/elements/Text/Text";
import { formatAuditStatusEntityForDisplay } from "@/connections/AuditStatus";
import { AuditStatusEntityType } from "@/connections/AuditStatus";
import { AuditStatusDto } from "@/generated/v3/entityService/entityServiceSchemas";

import CommentarySection from "../../PolygonReviewTab/components/CommentarySection/CommentarySection";
import { AuditLogButtonStates } from "../constants/enum";
import AuditLogTable from "./AuditLogTable";

type SiteAuditLogEntityStatusProps = {
  entityType: AuditStatusEntityType;
  record: SelectedItem | null;
  auditLogData?: { data: AuditStatusDto[] };
  refresh: () => void;
  buttonToggle: number;
  verifyEntity?: boolean;
  viewPD?: boolean;
  auditData?: { entity: string; entityUuid: string };
  isProjectReport?: boolean;
};

type SelectedItem = {
  title?: string | undefined;
  name?: string | undefined;
  uuid?: string | undefined;
  value?: string | undefined;
  meta?: string | undefined;
  status?: string | undefined;
};

const REPORT_TYPES_MAPPING: { [key: number]: string } = {
  4: "project-reports",
  5: "site-reports",
  6: "nursery-reports",
  7: "disturbance-reports"
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
  const t = useT();

  const formatUrl = () => {
    switch (REPORT_TYPES_MAPPING[buttonToggle]) {
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
  const title = record?.title ?? record?.name;
  const redirectTo = viewPD
    ? `/${
        isProjectReport
          ? "reports/" + REPORT_TYPES_MAPPING[buttonToggle].replace(/s$/, "")
          : isNurseryToggle
          ? "nursery"
          : "site"
      }/${record?.uuid}${isNurseryToggle ? "" : "?tab=audit-log"}`
    : `${basename}${isProjectReport ? formatUrl() : `/${modules.site.ResourceName}/${record?.uuid}/show/6`}`;

  const displayEntityName = formatAuditStatusEntityForDisplay(entityType);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Text variant="text-24-bold" className="mb-1">
          {t("{displayEntityName} Status and Comments", { displayEntityName })}
        </Text>
        <Text variant="text-14-light" className="mb-4">
          {t("Update the {displayEntityName} status, view updates, or add comments", {
            displayEntityName: displayEntityName.toLowerCase()
          })}
        </Text>
        <CommentarySection record={record} entity={entityType} refresh={refresh} viewCommentsList={false} />
      </div>
      {viewPD && (
        <div>
          {!isSite && !verifyEntity && !isNurseryToggle && (
            <Text variant="text-16-bold">{t("History and Discussion for {title}", { title })}</Text>
          )}
          {(isSite || verifyEntity || isNurseryToggle) && (
            <Text variant="text-16-bold">
              {t("History and discussions for")}{" "}
              {viewPD ? (
                <Link className="text-16-bold !text-[#000000DD]" href={redirectTo}>
                  {title}
                </Link>
              ) : (
                <RaLink className="text-16-bold !text-[#000000DD]" to={redirectTo}>
                  {title}
                </RaLink>
              )}
            </Text>
          )}
        </div>
      )}
      {auditLogData != null && viewPD && (
        <AuditLogTable auditLogData={auditLogData!} auditData={auditData} refresh={refresh} />
      )}
    </div>
  );
};

export default SiteAuditLogEntityStatus;
