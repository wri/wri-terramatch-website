import { useState } from "react";

import { fetchPutV2AdminProjectsUUID, usePostV2AuditStatus } from "@/generated/apiComponents";
import { AuditStatusResponse, ProjectLiteRead } from "@/generated/apiSchemas";

import AuditLogStatusSide from "./AuditLogStatusSide";

const SiteAuditLogProjectStatusSide = ({
  record,
  refresh,
  auditLogData
}: {
  record?: ProjectLiteRead | null;
  refresh?: () => void;
  auditLogData?: AuditStatusResponse[];
}) => {
  const [open, setOpen] = useState(false);
  const { mutate: upload } = usePostV2AuditStatus();
  const mutate = fetchPutV2AdminProjectsUUID;

  const projectStatusLabels = [
    { id: "1", label: "Draft" },
    { id: "2", label: "Awaiting Approval" },
    { id: "3", label: "Needs More Information" },
    { id: "4", label: "Approved" }
  ];

  function getValueForStatus(status: string): number {
    switch (status) {
      case "started":
        return 0;
      case "awaiting-approval":
        return 34;
      case "needs-more-information":
        return 67;
      case "approved":
        return 100;
      default:
        return 0;
    }
  }

  return (
    <AuditLogStatusSide
      record={record}
      refresh={refresh}
      auditLogData={auditLogData}
      getValueForStatus={getValueForStatus}
      statusLabels={projectStatusLabels}
      entity="Project"
      upload={upload}
      mutate={mutate}
      openModal={open}
      setOpenModal={setOpen}
    />
  );
};

export default SiteAuditLogProjectStatusSide;
