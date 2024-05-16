import { Fragment } from "react";

import Button from "@/components/elements/Button/Button";
import StepProgressbar from "@/components/elements/ProgressBar/StepProgressbar/StepProgressbar";
import Text from "@/components/elements/Text/Text";

import { SiteAuditLogTable } from "./SiteAuditLogProjectStatus";

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

const SiteAuditLogSiteStatus = (props: SiteAuditLogTable) => {
  const formattedText = (text: string) => {
    return text.replace(/-/g, " ").replace(/\b\w/g, char => char.toUpperCase());
  };
  const recentRequest = props?.auditLogData?.data?.find((item: any) => item.type == "change-request");
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Text variant="text-24-bold" className="mb-1">
          Site Status and Comments
        </Text>
        <Text variant="text-14-light" className="mb-4">
          Update the site status, view updates, or add comments
        </Text>
        <div className="flex flex-col gap-1 rounded-xl border border-yellow-500 bg-yellow p-4">
          <div className="flex items-center justify-between">
            <Text variant="text-16-bold">Change Requested</Text>
            <Button variant="orange">Remove Request</Button>
          </div>
          <Text variant="text-14-semibold">{recentRequest?.comment}</Text>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Text variant="text-16-bold">Site Status</Text>
        <StepProgressbar
          color="secondary"
          value={getValueForStatus(props.record.status)}
          labels={siteStatusLabels}
          classNameLabels="min-w-[111px]"
          className="w-[80%]"
        />
      </div>
      <Text variant="text-16-bold">History for {props.record.name}</Text>
      <div className="grid grid-cols-[14%_20%_18%_15%_33%]">
        <Text variant="text-12-light" className="border-b border-b-grey-750 text-grey-700">
          Date and Time
        </Text>
        <Text variant="text-12-light" className="border-b border-b-grey-750 text-grey-700">
          User
        </Text>
        <Text variant="text-12-light" className="border-b border-b-grey-750 text-grey-700">
          Site
        </Text>
        <Text variant="text-12-light" className="border-b border-b-grey-750 text-grey-700">
          Status
        </Text>
        <Text variant="text-12-light" className="border-b border-b-grey-750 text-grey-700">
          Comments
        </Text>
      </div>
      <div className="mr-[-7px] grid max-h-[30vh] min-h-[10vh] grid-cols-[14%_20%_18%_15%_33%] overflow-auto">
        {props.auditLogData?.data
          ?.filter((item: any) => item.type == "status")
          .map((item: any, index: number) => (
            <Fragment key={index}>
              <Text variant="text-12" className="border-b border-b-grey-750 py-2 pr-2">
                {item.date_created}
              </Text>
              <Text variant="text-12" className="border-b border-b-grey-750 py-2 pr-2">
                {item.created_by}
              </Text>
              <Text variant="text-12" className="border-b border-b-grey-750 py-2 pr-2">
                {item.entity || "-"}
              </Text>
              <Text variant="text-12" className="border-b border-b-grey-750 py-2 pr-2">
                {formattedText(item.status)}
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

export default SiteAuditLogSiteStatus;
