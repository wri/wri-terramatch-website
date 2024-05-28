import { useState } from "react";

import { fetchPutV2AdminSitesUUID, usePostV2AuditStatus } from "@/generated/apiComponents";
import { AuditStatusResponse } from "@/generated/apiSchemas";

import AuditLogStatusSide from "./AuditLogStatusSide";

const SiteAuditLogSiteStatusSide = ({
  record,
  refresh,
  auditLogData,
  recentRequestData
}: {
  record?: any;
  refresh?: () => void;
  auditLogData?: AuditStatusResponse[];
  recentRequestData?: ((recentRequest: AuditStatusResponse) => string) | undefined;
}) => {
  const [open, setOpen] = useState(false);

  const { mutate: upload } = usePostV2AuditStatus();
  const mutate = fetchPutV2AdminSitesUUID;

  const siteStatusLabels = [
    { id: "1", label: "Draft" },
    { id: "2", label: "Awaiting Approval" },
    { id: "3", label: "Needs More Information" },
    { id: "4", label: "Planting in Progress" },
    { id: "4", label: "Approved" }
  ];

  function getValueForStatus(status: string): number {
    switch (status) {
      case "draft":
        return 0;
      case "awaiting-approval":
        return 25;
      case "needs-more-information":
        return 50;
      case "planting-in-progress":
        return 75;
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
      recentRequestData={recentRequestData}
      getValueForStatus={getValueForStatus}
      statusLabels={siteStatusLabels}
      entity="Site"
      upload={upload}
      mutate={mutate}
      openModal={open}
      setOpenModal={setOpen}
    />
  );
};

export default SiteAuditLogSiteStatusSide;
