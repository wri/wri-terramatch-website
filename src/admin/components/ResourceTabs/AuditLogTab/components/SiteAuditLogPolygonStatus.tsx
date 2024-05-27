import { FC, Fragment, useMemo } from "react";

import { convertDateFormat } from "@/admin/apiProvider/utils/entryFormat";
import Text from "@/components/elements/Text/Text";

import ComentarySection from "../../PolygonReviewTab/components/ComentarySection/ComentarySection";

export interface SiteAuditLogPolygonStatusProps {
  record?: any;
  auditLogData?: any;
  refresh?: any;
  getTextForActionTable?: any;
}

interface AuditLogItem {
  id: number;
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
  attachments: [AttachmentItem];
}

interface AttachmentItem {
  id: number;
  entity_id: number;
  attachment: string;
  url_file: string;
}

const SiteAuditLogPolygonStatus: FC<SiteAuditLogPolygonStatusProps> = ({
  record,
  auditLogData,
  refresh,
  getTextForActionTable
}) => {
  const polygonData = useMemo(
    () => ({
      uuid: record?.uuid,
      status: record?.meta,
      title: record?.title
    }),
    [record]
  );
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Text variant="text-24-bold" className="mb-1">
          Polygon Status and Comments
        </Text>
        <Text variant="text-14-light" className="mb-4">
          Update the polygon status, view updates, or add comments
        </Text>
      </div>
      <ComentarySection
        record={polygonData}
        entity={"SitePolygon"}
        auditLogData={auditLogData?.data}
        refresh={refresh}
        viewCommentsList={false}
      />
      <Text variant="text-16-bold">History and Discussion for {record?.title}</Text>
      <div>
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
          {auditLogData?.data.map((item: AuditLogItem, index: number) => (
            <Fragment key={index}>
              <Text variant="text-12" className="border-b border-b-grey-750 py-2 pr-2">
                {convertDateFormat(item?.date_created)}
              </Text>
              <Text variant="text-12" className="border-b border-b-grey-750 py-2 pr-2">
                {`${item.first_name} ${item.last_name}`}
              </Text>
              <Text variant="text-12" className="border-b border-b-grey-750 py-2 pr-2">
                {getTextForActionTable(item)}
              </Text>
              <Text variant="text-12" className="border-b border-b-grey-750 py-2">
                {item.comment || "-"}
              </Text>
              <div className="grid max-w-full gap-2 gap-y-1 border-b border-b-grey-750 py-2">
                {item?.attachments?.map((attachmentItem: AttachmentItem) => (
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
      </div>
    </div>
  );
};

export default SiteAuditLogPolygonStatus;
