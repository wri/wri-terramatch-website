import { Fragment } from "react";
import { useParams } from "react-router-dom";

import StepProgressbar from "@/components/elements/ProgressBar/StepProgressbar/StepProgressbar";
import Text from "@/components/elements/Text/Text";
import { useGetV2SitesSitePolygon } from "@/generated/apiComponents";
import { useGetV2AuditStatus } from "@/generated/apiComponents";

import { SiteAuditLogTable } from "./SiteAuditLogProjectStatus";

interface AuditLogResponse {
  data: [AuditLogItem];
}

interface AuditLogItem {
  entity_uuid: string;
  status: string;
  comment: string;
  attachment_url: string;
  date_created: string;
  created_by: string;
}

const polygonStatusLabels = [
  { id: "1", label: "Submitted" },
  { id: "2", label: "Needs More Information" },
  { id: "3", label: "Approved" }
];

function getValueForStatus(status: string): number {
  switch (status) {
    case "Submitted":
      return 20;
    case "needs-more-information":
      return 60;
    case "approved":
      return 100;
    default:
      return 0;
  }
}

const SiteAuditLogPolygonStatus = (props: SiteAuditLogTable) => {
  const { id } = useParams<"id">();
  const formattedText = (text: string) => {
    return text.replace(/-/g, " ").replace(/\b\w/g, char => char.toUpperCase());
  };
  const { data: sitePolygon } = useGetV2SitesSitePolygon({
    pathParams: {
      site: id as string
    }
  });

  const { data: polygonAuditLog } = useGetV2AuditStatus({
    queryParams: {
      entity: "Polygon",
      uuid: "asdasdsa-asdasdzxc"
    }
  }) as { data: AuditLogResponse };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Text variant="text-24-bold" className="mb-1">
          Polygon Status and Comments
        </Text>
        <Text variant="text-14-light" className="mb-4">
          Update the polygon status, view updates, or add comments
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
        <Text variant="text-16-bold">Polygon Status</Text>
        <StepProgressbar
          color="secondary"
          value={getValueForStatus(sitePolygon?.[0]?.status as string)}
          labels={polygonStatusLabels}
          classNameLabels="min-w-[111px]"
          className="w-[44%]"
        />
      </div>
      <Text variant="text-16-bold">History for {sitePolygon?.[0]?.poly_name}</Text>
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
          Polygon
        </Text>
        <Text variant="text-12-light" className="border-b border-b-grey-750 text-grey-700">
          Status
        </Text>
        <Text variant="text-12-light" className="border-b border-b-grey-750 text-grey-700">
          Comments
        </Text>
        {polygonAuditLog?.data?.map((item: AuditLogItem, index: number) => (
          <Fragment key={index}>
            <Text variant="text-12" className="border-b border-b-grey-750 py-2 pr-2">
              {item.date_created}
            </Text>
            <Text variant="text-12" className="border-b border-b-grey-750 py-2 pr-2">
              {item.created_by}
            </Text>
            <Text variant="text-12" className="border-b border-b-grey-750 py-2 pr-2">
              {/* {item.site || "-"} */}
              {"-"}
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

export default SiteAuditLogPolygonStatus;
