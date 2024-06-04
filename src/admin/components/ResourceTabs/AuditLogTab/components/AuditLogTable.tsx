import { FC, Fragment } from "react";

import { convertDateFormat } from "@/admin/apiProvider/utils/entryFormat";
import Text from "@/components/elements/Text/Text";
import { AttachmentResponse, AuditStatusResponse, AuditStatusResponseWithData } from "@/generated/apiSchemas";

const formattedTextStatus = (text: string) => {
  return text.replace(/-/g, " ").replace(/\b\w/g, char => char.toUpperCase());
};

const getTextForActionTable = (item: { type: string; status: string; request_removed: boolean }): string => {
  if (item.type === "comment") {
    return "New Comment";
  } else if (item.type === "status") {
    return `New Status: ${formattedTextStatus(item.status)}`;
  } else if (item.request_removed) {
    return "Change Request Removed";
  } else {
    return "Change Requested Added";
  }
};

const AuditLogTable: FC<{ auditLogData: AuditStatusResponseWithData }> = ({ auditLogData }) => {
  return (
    <Fragment>
      <div className="grid grid-cols-[14%_20%_15%_30%_21%]">
        <Text variant="text-12-light" className="border-b border-b-grey-750 text-grey-700">
          Date
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
        {auditLogData?.data?.map((item: AuditStatusResponse, index: number) => (
          <Fragment key={index}>
            <Text variant="text-12" className="border-b border-b-grey-750 py-2 pr-2">
              {convertDateFormat(item?.date_created)}
            </Text>
            <Text variant="text-12" className="border-b border-b-grey-750 py-2 pr-2">
              {`${item.first_name} ${item.last_name}`}
            </Text>
            <Text variant="text-12" className="border-b border-b-grey-750 py-2 pr-2">
              {getTextForActionTable(item as { type: string; status: string; request_removed: boolean })}
            </Text>
            <Text variant="text-12" className="border-b border-b-grey-750 py-2">
              {item.comment || "-"}
            </Text>
            <div className="grid max-w-full gap-2 gap-y-1 border-b border-b-grey-750 py-2">
              {item?.attachments?.map((attachmentItem: AttachmentResponse) => (
                <Text
                  key={attachmentItem.id}
                  variant="text-12-light"
                  className="h-min w-fit max-w-full cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap rounded-xl bg-neutral-40 px-2 py-0.5"
                  as={"span"}
                  onClick={() => {
                    attachmentItem.url_file && window.open(attachmentItem.url_file, "_blank");
                  }}
                >
                  {attachmentItem.attachment}
                </Text>
              ))}
            </div>
          </Fragment>
        ))}
      </div>
    </Fragment>
  );
};

export default AuditLogTable;
