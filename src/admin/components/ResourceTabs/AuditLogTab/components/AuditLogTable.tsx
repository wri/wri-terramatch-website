import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC, Fragment, useRef } from "react";
import { When } from "react-if";

import { convertDateFormat } from "@/admin/apiProvider/utils/entryFormat";
import Menu from "@/components/elements/Menu/Menu";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { useNotificationContext } from "@/context/notification.provider";
import { useDeleteV2ENTITYUUIDIDDelete } from "@/generated/apiComponents";
import { AuditStatusResponse, V2FileRead } from "@/generated/apiSchemas";

const formattedTextStatus = (text: string) => {
  return text?.replace(/-/g, " ").replace(/\b\w/g, char => char.toUpperCase());
};

const getTextForActionTable = (item: { type: string; status: string; request_removed: boolean }): string => {
  if (item.type === "comment") {
    return "New Comment";
  } else if (item.type === "status") {
    return `New Status: ${formattedTextStatus(item.status)}`;
  } else if (item.type === "change-request-updated") {
    return "Change Request Updated";
  } else if (item.request_removed) {
    return "Change Request Removed";
  } else if (item.type === "reminder-sent") {
    return "Reminder Sent";
  } else if (item.type === "change-request") {
    return "Change Requested";
  } else {
    return "-";
  }
};

const generateUserName = (first_name?: string, last_name?: string): string =>
  `${first_name ?? ""} ${last_name ?? ""}`.trim() || "Unknown User";

const AuditLogTable: FC<{
  auditLogData: { data: AuditStatusResponse[] };
  auditData?: { entity: string; entity_uuid: string };
  refresh?: () => void;
}> = ({ auditLogData, auditData, refresh }) => {
  const menuOverflowContainerRef = useRef(null);
  const route = useRouter();
  const isAdmin = route.asPath.includes("admin");
  const columnTitlesPolygons = isAdmin
    ? ["Date", "User", "Action", "Comments", "Attachments", ""]
    : ["Date", "User", "Action", "Comments", "Attachments"];
  const gridColumnSizePolygons = isAdmin ? "grid-cols-[14%_20%_15%_27%_19%_5%]" : "grid-cols-[14%_20%_15%_30%_21%]";
  const columnTitles =
    auditData?.entity == "site-polygon"
      ? columnTitlesPolygons
      : isAdmin
      ? ["Date", "User", "Status", "Change Request", "Comments", "Attachments", ""]
      : ["Date", "User", "Status", "Change Request", "Comments", "Attachments"];
  const gridColumnSize =
    auditData?.entity == "site-polygon"
      ? gridColumnSizePolygons
      : isAdmin
      ? "grid-cols-[14%_10%_10%_15%_27%_19%_5%]"
      : "grid-cols-[14%_10%_10%_15%_30%_21%]";

  const { openNotification } = useNotificationContext();
  const t = useT();
  const { mutate } = useDeleteV2ENTITYUUIDIDDelete({
    onSuccess() {
      refresh?.();
      openNotification("success", "Success!", t("audit log deleted."));
    },
    onError: () => {
      openNotification("error", "Error!", t("An error occurred while deleting the audit log."));
    }
  });
  const deleteAuditStatus = async (id: string) => {
    await mutate({
      pathParams: {
        entity: auditData?.entity as string,
        uuid: auditData?.entity_uuid as string,
        id
      }
    });
  };
  return (
    <>
      <div className={`grid ${gridColumnSize}`}>
        {columnTitles.map(title => (
          <Text key={title} variant="text-12-light" className="border-b border-b-grey-750 text-grey-700">
            {title}
          </Text>
        ))}
      </div>
      <div
        className={`mr-[-7px] grid max-h-[50vh] min-h-[10vh] overflow-auto pr-[7px] ${gridColumnSize}`}
        ref={menuOverflowContainerRef}
      >
        {auditLogData?.data?.map((item: AuditStatusResponse, index: number) => (
          <Fragment key={index}>
            <Text variant="text-12" className="border-b border-b-grey-750 py-2 pr-2">
              {convertDateFormat(item?.date_created)}
            </Text>
            <Text variant="text-12" className="border-b border-b-grey-750 py-2 pr-2">
              {generateUserName(item.first_name, item.last_name)}
            </Text>
            <When condition={auditData?.entity !== "site-polygon"}>
              <Text variant="text-12" className="border-b border-b-grey-750 py-2 pr-2">
                {formattedTextStatus(item.status as string) ?? "-"}
              </Text>
            </When>
            <Text variant="text-12" className="border-b border-b-grey-750 py-2 pr-2">
              {getTextForActionTable(item as { type: string; status: string; request_removed: boolean })}
            </Text>
            <Text variant="text-12" className="border-b border-b-grey-750 py-2">
              {item.comment ?? "-"}
            </Text>
            <div className="grid max-w-full gap-2 gap-y-1 border-b border-b-grey-750 py-2">
              {item?.attachments?.map((attachmentItem: V2FileRead) => (
                <Text
                  key={attachmentItem.uuid}
                  variant="text-12-light"
                  className="h-min w-fit max-w-full cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap rounded-xl bg-neutral-40 px-2 py-0.5"
                  as={"span"}
                  onClick={() => {
                    attachmentItem.url && window.open(attachmentItem.url, "_blank");
                  }}
                >
                  {attachmentItem.file_name}
                </Text>
              ))}
            </div>
            <When condition={isAdmin}>
              <div className="justify-cente flex items-center border-b border-b-grey-750 py-2">
                <Menu
                  container={menuOverflowContainerRef.current}
                  className="h-fit cursor-pointer"
                  menu={[
                    {
                      id: "0",
                      render: () => (
                        <Text
                          variant="text-14-semibold"
                          className="flex items-center"
                          onClick={() => deleteAuditStatus((item.uuid ?? item.id) as string)}
                        >
                          <Icon name={IconNames.TRASH} className="h-4 w-4 lg:h-5 lg:w-5" />
                          &nbsp; Delete
                        </Text>
                      )
                    }
                  ]}
                >
                  <Icon name={IconNames.ELIPSES} className="h-5 w-5" />
                </Menu>
              </div>
            </When>
          </Fragment>
        ))}
      </div>
    </>
  );
};

export default AuditLogTable;
