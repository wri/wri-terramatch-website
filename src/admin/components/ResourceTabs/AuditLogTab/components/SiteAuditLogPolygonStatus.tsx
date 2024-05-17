import { FC, Fragment } from "react";

import Button from "@/components/elements/Button/Button";
import StepProgressbar from "@/components/elements/ProgressBar/StepProgressbar/StepProgressbar";
import Text from "@/components/elements/Text/Text";
import { fetchPutV2AuditStatusId } from "@/generated/apiComponents";

export interface SiteAuditLogPolygonStatusProps {
  record?: any;
  auditLogData?: any;
  refresh?: any;
}

interface AuditLogItem {
  entity_uuid: string;
  type: string;
  status: string;
  comment: string;
  attachment_url: string;
  date_created: string;
  created_by: string;
  first_name: string;
  last_name: string;
  request_removed: boolean;
}

const polygonStatusLabels = [
  { id: "1", label: "Submitted" },
  { id: "2", label: "Needs More Information" },
  { id: "3", label: "Approved" }
];

function getValueForStatus(status: string): number {
  switch (status) {
    case "Submitted":
      return 0;
    case "needs-more-information":
      return 50;
    case "approved":
      return 100;
    default:
      return 0;
  }
}

const SiteAuditLogPolygonStatus: FC<SiteAuditLogPolygonStatusProps> = ({ record, auditLogData, refresh }) => {
  const formattedText = (text: string) => {
    return text.replace(/-/g, " ").replace(/\b\w/g, char => char.toUpperCase());
  };
  const recentRequest = auditLogData?.data?.find((item: any) => item.type == "change-request" && item.is_active);
  const mutate = fetchPutV2AuditStatusId;
  const deactivateRecentRequest = async () => {
    await mutate({
      pathParams: {
        id: recentRequest?.id
      },
      body: {
        is_active: false,
        request_removed: true
      }
    });
    refresh();
  };
  console.log(auditLogData?.data);
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Text variant="text-24-bold" className="mb-1">
          Polygon Status and Comments
        </Text>
        <Text variant="text-14-light" className="mb-4">
          Update the polygon status, view updates, or add comments
        </Text>
        {recentRequest && (
          <div className="flex flex-col gap-1 rounded-xl border border-yellow-500 bg-yellow p-4">
            <div className="flex items-center justify-between">
              <Text variant="text-16-bold">Change Requested</Text>
              <Button variant="orange" onClick={deactivateRecentRequest}>
                Remove Request
              </Button>
            </div>
            <Text variant="text-14-semibold">{recentRequest?.comment}</Text>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <Text variant="text-16-bold">Polygon Status</Text>
        <StepProgressbar
          color="secondary"
          value={getValueForStatus(record?.meta)}
          labels={polygonStatusLabels}
          classNameLabels="min-w-[111px]"
          className="w-[44%]"
        />
      </div>
      <Text variant="text-16-bold">History for {record?.title}</Text>
      <div className="grid grid-cols-[14%_20%_18%_15%_33%]">
        <Text variant="text-12-light" className="border-b border-b-grey-750 text-grey-700">
          Date and Time
        </Text>
        <Text variant="text-12-light" className="border-b border-b-grey-750 text-grey-700">
          User
        </Text>
        <Text variant="text-12-light" className="border-b border-b-grey-750 text-grey-700">
          Polygon
        </Text>
        <Text variant="text-12-light" className="border-b border-b-grey-750 text-grey-700">
          Action
        </Text>
        <Text variant="text-12-light" className="border-b border-b-grey-750 text-grey-700">
          Comments
        </Text>
      </div>
      <div className="mr-[-7px] grid max-h-[50vh] min-h-[10vh] grid-cols-[14%_20%_18%_15%_33%] overflow-auto">
        {auditLogData?.data
          .filter((item: any) => ["status", "change-request"].includes(item.type))
          .map((item: AuditLogItem, index: number) => (
            <Fragment key={index}>
              <Text variant="text-12" className="border-b border-b-grey-750 py-2 pr-2">
                {item.date_created}
              </Text>
              <Text variant="text-12" className="border-b border-b-grey-750 py-2 pr-2">
                {`${item.first_name} ${item.last_name}`}
              </Text>
              <Text variant="text-12" className="border-b border-b-grey-750 py-2 pr-2">
                {record?.title || "-"}
              </Text>
              <Text variant="text-12" className="border-b border-b-grey-750 py-2 pr-2">
                {item.type === "status"
                  ? `New Status: ${formattedText(item.status)}`
                  : item?.request_removed
                  ? "Change Request Removed"
                  : "Change Requested Added"}
              </Text>
              <Text variant="text-12" className="border-b border-b-grey-750 py-2">
                {item.comment || "-"}
              </Text>
            </Fragment>
          ))}
      </div>
    </div>
  );
};

export default SiteAuditLogPolygonStatus;
