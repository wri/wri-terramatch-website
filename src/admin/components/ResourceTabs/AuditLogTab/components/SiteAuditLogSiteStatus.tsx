import { FC, Fragment } from "react";

import Text from "@/components/elements/Text/Text";
import { fetchPostV2AuditStatus } from "@/generated/apiComponents";

import ComentarySection from "../../PolygonReviewTab/components/ComentarySection/ComentarySection";

export interface SiteAuditLogSiteStatusProps {
  record?: any;
  auditLogData?: any;
  refresh?: any;
}

const SiteAuditLogSiteStatus: FC<SiteAuditLogSiteStatusProps> = ({ record, auditLogData, refresh }) => {
  const mutateComment = fetchPostV2AuditStatus;
  const formattedText = (text: string) => {
    return text.replace(/-/g, " ").replace(/\b\w/g, char => char.toUpperCase());
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Text variant="text-24-bold" className="mb-1">
          Site Status and Comments
        </Text>
        <Text variant="text-14-light" className="mb-4">
          Update the site status, view updates, or add comments
        </Text>
        <ComentarySection
          record={record}
          entity={"Project"}
          auditLogData={auditLogData?.data}
          mutate={mutateComment}
          refresh={refresh}
          viewCommentsList={false}
        />
      </div>
      <Text variant="text-16-bold">History for {record.name}</Text>
      <div>
        <div className="grid grid-cols-[14%_20%_15%_30%_21%]">
          <Text variant="text-12-light" className="border-b border-b-grey-750 text-grey-700">
            Date and Time
          </Text>
          <Text variant="text-12-light" className="border-b border-b-grey-750 text-grey-700">
            User
          </Text>
          <Text variant="text-12-light" className="border-b border-b-grey-750 text-grey-700">
            Action
          </Text>
          <Text variant="text-12-light" className="border-b border-b-grey-750 text-grey-700">
            Comments
          </Text>
          <Text variant="text-12-light" className="border-b border-b-grey-750 text-grey-700">
            Attachments
          </Text>
        </div>
        <div className="mr-[-7px] grid max-h-[50vh] min-h-[10vh] grid-cols-[14%_20%_15%_30%_21%] overflow-auto pr-[7px]">
          {auditLogData?.data
            ?.filter((item: any) => ["status", "change-request"].includes(item.type))
            .map((item: any, index: number) => (
              <Fragment key={index}>
                <Text variant="text-12" className="border-b border-b-grey-750 py-2 pr-2">
                  {item?.date_created}
                </Text>
                <Text variant="text-12" className="border-b border-b-grey-750 py-2 pr-2">
                  {`${item.first_name} ${item.last_name}`}
                </Text>
                <Text variant="text-12" className="border-b border-b-grey-750 py-2 pr-2">
                  {item.type === "status"
                    ? `New Status: ${formattedText(item.status)}`
                    : item.request_removed
                    ? "Change Request Removed"
                    : "Change Requested Added"}
                </Text>
                <Text variant="text-12" className="border-b border-b-grey-750 py-2">
                  {item.comment || "-"}
                </Text>
                <div className="grid gap-2 border-b border-b-grey-750 py-2">
                  <Text variant="text-12-light" className="w-max rounded-xl bg-neutral-40 px-2" as={"span"}>
                    img-attachment.jpeg
                  </Text>
                  <Text variant="text-12-light" className="w-max rounded-xl bg-neutral-40 px-2" as={"span"}>
                    critical-document.docx
                  </Text>
                  <Text variant="text-12-light" className="w-max rounded-xl bg-neutral-40 px-2" as={"span"}>
                    moreinformation123.xlsx
                  </Text>
                </div>
              </Fragment>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SiteAuditLogSiteStatus;
