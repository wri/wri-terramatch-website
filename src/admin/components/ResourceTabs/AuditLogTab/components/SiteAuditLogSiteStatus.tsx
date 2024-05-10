import { Fragment } from "react";
import { useParams } from "react-router-dom";

import StepProgressbar from "@/components/elements/ProgressBar/StepProgressbar/StepProgressbar";
import Text from "@/components/elements/Text/Text";
import { useGetV2AuditStatus } from "@/generated/apiComponents";
import { useGetV2SitesUUID } from "@/generated/apiComponents";

import { SiteAuditLogTable } from "./SiteAuditLogProjectStatus";

interface AuditLogResponse {
  data: [AuditLogItem];
}
interface AuditLogItem {
  entity: string;
  status: string;
  comment: string;
  attachment_url: string;
  date_created: string;
  created_by: string;
}

const siteStatusLabels = [
  { id: "1", label: "Draft" },
  { id: "2", label: "Awaiting Approval" },
  { id: "3", label: "Needs More Information" },
  { id: "4", label: "Planting in Progress" },
  { id: "4", label: "Approved" }
];

function getValueForStatus(status: string): number {
  switch (status) {
    case "started":
      return 20;
    case "awaiting-approval":
      return 35;
    case "needs-more-information":
      return 60;
    case "planting-in-progress":
      return 80;
    case "approved":
      return 100;
    default:
      return 0;
  }
}

const SiteAuditLogSiteStatus = (props: SiteAuditLogTable) => {
  const { id } = useParams<"id">();
  const formattedText = (text: string) => {
    return text.replace(/-/g, " ").replace(/\b\w/g, char => char.toUpperCase());
  };

  const { data: siteData } = useGetV2SitesUUID({ pathParams: { uuid: id as string } }) as {
    data: { data: { project: { status: string }; status: string; name: string } };
  };

  const siteStatus = siteData?.data?.status;
  const { data: siteAuditLog } = useGetV2AuditStatus({
    queryParams: {
      entity: "Site",
      uuid: props.uuid!
    }
  }) as { data: AuditLogResponse };
  console.log("uuid", props.resource);
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
          <Text variant="text-16-bold">Change Requested</Text>
          <Text variant="text-14-semibold">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat.
          </Text>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Text variant="text-16-bold">Site Status</Text>
        <StepProgressbar
          color="secondary"
          value={getValueForStatus(siteStatus)}
          labels={siteStatusLabels}
          classNameLabels="min-w-[111px]"
          className="w-[80%]"
        />
      </div>
      <Text variant="text-16-bold">History for {siteData?.data?.name}</Text>
      {/*OLD TABLE*/}
      {/* <ReferenceManyField
        pagination={<Pagination />}
        reference={modules.audit.ResourceName}
        filter={{ entity: props.resource }}
        target="uuid"
        label=""
      >
        <Datagrid bulkActionButtons={false}>
          <DateField
            source="created_at"
            label="Date and time"
            showTime
            locales="en-GB"
            options={{ dateStyle: "short", timeStyle: "short" }}
          />
          <ReferenceField source="user_uuid" reference={modules.user.ResourceName} label="User">
            <FunctionField
              source="first_name"
              render={(record: V2AdminUserRead) => `${record?.first_name || ""} ${record?.last_name || ""}`}
            />
          </ReferenceField>
          <FunctionField
            label="Action"
            className="capitalize"
            render={(record: any) => {
              const str: string = record?.new_values?.status ?? record?.event ?? "";

              return str.replaceAll("-", " ");
            }}
          />
          <FunctionField label="Comments" render={(record: any) => record?.new_values?.feedback ?? "-"} />
        </Datagrid>
      </ReferenceManyField> */}
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
        {siteAuditLog?.data?.map((item: AuditLogItem, index: number) => (
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
