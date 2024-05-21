import StepProgressbar from "@/components/elements/ProgressBar/StepProgressbar/StepProgressbar";
import Text from "@/components/elements/Text/Text";
import { fetchPutV2AuditStatusId } from "@/generated/apiComponents";

import StatusDisplay from "../../PolygonReviewTab/components/PolygonStatus/StatusDisplay ";

const SiteAuditLogSiteStatusSide = ({
  record,
  refresh,
  auditLogData
}: {
  record?: any;
  refresh?: any;
  auditLogData?: any;
}) => {
  const recentRequest = auditLogData?.find((item: any) => item.type == "change-request" && item.is_active);

  const mutate = fetchPutV2AuditStatusId;

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
    <div className="flex flex-col gap-6 overflow-hidden">
      <Text variant="text-16-bold">Site Status</Text>
      <StepProgressbar
        color="secondary"
        value={getValueForStatus(record.status)}
        labels={siteStatusLabels}
        classNameLabels="min-w-[99px]"
        className="w-[99%]"
      />
      {recentRequest && (
        <div className="flex flex-col gap-1 rounded-xl border border-yellow-500 bg-yellow p-4">
          <div className="flex items-center justify-between">
            <Text variant="text-16-bold">Change Requested</Text>
          </div>
          <Text variant="text-14-semibold">{recentRequest?.comment}</Text>
        </div>
      )}
      <StatusDisplay titleStatus="Site" name={record.name} refresh={refresh} record={record} mutate={mutate} />
    </div>
  );
};

export default SiteAuditLogSiteStatusSide;
