import { useT } from "@transifex/react";
import { FC } from "react";

import Text from "@/components/elements/Text/Text";
import { AuditStatusEntityType } from "@/connections/AuditStatus";
import { AuditStatusDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useAuditEntityTypeName } from "@/hooks/translation/useAuditEntityTypeName";

import CommentarySection from "../../PolygonReviewTab/components/CommentarySection/CommentarySection";
import AuditLogTable from "./AuditLogTable";

type SiteAuditLogEntityStatusProps = {
  entityType: AuditStatusEntityType;
  record: SelectedItem | null;
  auditLogData?: { data: AuditStatusDto[] };
  refresh: () => void;
  viewPD?: boolean;
  auditData?: { entity: string; entityUuid: string };
};

type SelectedItem = {
  title?: string | undefined;
  name?: string | undefined;
  uuid?: string | undefined;
  value?: string | undefined;
  meta?: string | undefined;
  status?: string | undefined;
};

// Keeps acronyms such as "SRP" uppercase when the name is used mid-sentence.
const toMidSentenceName = (name: string) =>
  name
    .split(" ")
    .map(word => (word === word.toUpperCase() ? word : word.toLowerCase()))
    .join(" ");

const SiteAuditLogEntityStatus: FC<SiteAuditLogEntityStatusProps> = ({
  entityType,
  record,
  auditLogData,
  refresh,
  viewPD = false,
  auditData
}) => {
  const t = useT();

  const auditEntityTypeName = useAuditEntityTypeName();
  const displayEntityName = auditEntityTypeName[entityType];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Text variant="text-24-bold" className="mb-1">
          {t("{displayEntityName} Status and Comments", { displayEntityName })}
        </Text>
        <Text variant="text-14-light" className="mb-4">
          {t("Update the {displayEntityName} status, view updates, or add comments", {
            displayEntityName: toMidSentenceName(displayEntityName)
          })}
        </Text>
        <CommentarySection record={record} entity={entityType} refresh={refresh} viewCommentsList={false} />
      </div>
      {viewPD && <Text variant="text-16-bold">{t("History and Discussion")}</Text>}
      {auditLogData != null && viewPD && (
        <AuditLogTable auditLogData={auditLogData!} auditData={auditData} refresh={refresh} />
      )}
    </div>
  );
};

export default SiteAuditLogEntityStatus;
