import { FC } from "react";

import Text from "@/components/elements/Text/Text";
import { AuditStatusResponseWithData, ProjectLiteRead } from "@/generated/apiSchemas";

import CommentarySection from "../../PolygonReviewTab/components/CommentarySection/CommentarySection";
import AuditLogTable from "./AuditLogTable";

export interface SiteAuditLogProjectStatusProps {
  record?: ProjectLiteRead | null;
  refresh?: () => void;
  auditLogData?: AuditStatusResponseWithData;
}

export const gridData = [
  {
    id: "1",
    date: "28/11/2023 09.39",
    user: "Jessica Chaimers",
    site: null,
    status: "Need More Information",
    commentary: null
  },
  {
    id: "2",
    date: "28/11/2023 09.39",
    user: "Teresa Muthoni",
    site: null,
    status: "Need More Information",
    commentary:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  {
    id: "3",
    date: "28/11/2023 09.39",
    user: "Jessica Chaimers",
    site: null,
    status: "Awaiting Approval",
    commentary: null
  },
  {
    id: "4",
    date: "28/11/2023 09.39",
    user: "Jessica Chaimers",
    site: null,
    status: "Awaiting Approval",
    commentary: null
  },
  {
    id: "5",
    date: "28/11/2023 09.39",
    user: "Jessica Chaimers",
    site: null,
    status: "Awaiting Approval",
    commentary: null
  }
];

const SiteAuditLogProjectStatus: FC<SiteAuditLogProjectStatusProps> = ({ record, auditLogData, refresh }) => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Text variant="text-24-bold" className="mb-1">
          Project Status and Comments
        </Text>
        <Text variant="text-14-light" className="mb-4">
          Update the project status, view updates, or add comments
        </Text>
        <CommentarySection
          record={record}
          entity={"Project"}
          auditLogData={auditLogData?.data}
          refresh={refresh}
          viewCommentsList={false}
        />
      </div>
      <Text variant="text-16-bold">History and Discussion for {record && record?.name}</Text>
      {auditLogData && <AuditLogTable auditLogData={auditLogData} />}
    </div>
  );
};

export default SiteAuditLogProjectStatus;
