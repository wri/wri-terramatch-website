import StepProgressbar from "@/components/elements/ProgressBar/StepProgressbar/StepProgressbar";
import Text from "@/components/elements/Text/Text";
import { fetchPutV2AuditStatusId } from "@/generated/apiComponents";

import StatusDisplay from "../../PolygonReviewTab/components/PolygonStatus/StatusDisplay ";

const SiteAuditLogProjectStatusSide = ({
  record,
  refresh,
  auditLogData
}: {
  record?: any;
  refresh?: any;
  auditLogData?: any;
}) => {
  const mutate = fetchPutV2AuditStatusId;
  const recentRequest = auditLogData?.find((item: any) => item.type == "change-request" && item.is_active);

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
    <div className="flex flex-col gap-6 overflow-hidden">
      <Text variant="text-16-bold">Project Status</Text>
      <StepProgressbar
        color="secondary"
        value={getValueForStatus(record.status)}
        labels={projectStatusLabels}
        classNameLabels="min-w-[99px]"
        className="w-[99%]"
      />

      {recentRequest && (
        <div className="flex flex-col gap-2 rounded-xl border border-yellow-500 bg-yellow p-4">
          <div>
            <Text variant="text-16-bold">Change Requested</Text>{" "}
            <Text variant="text-14-light">From Liza LePage on 13/06/24</Text>
          </div>
          <Text variant="text-14-semibold">{recentRequest?.comment}</Text>
        </div>
      )}
      <StatusDisplay titleStatus="Project" record={record} name={record?.name} mutate={mutate} refresh={refresh} />
    </div>
  );
};

export default SiteAuditLogProjectStatusSide;
