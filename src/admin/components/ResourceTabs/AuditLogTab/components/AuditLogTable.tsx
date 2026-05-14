import { useT } from "@transifex/react";
import classNames from "classnames";
import { useRouter } from "next/router";
import { FC, Fragment, useRef } from "react";

import { convertDateFormat } from "@/admin/apiProvider/utils/entryFormat";
import Menu from "@/components/elements/Menu/Menu";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { AuditStatusEntityType, deleteAuditStatusAsync } from "@/connections/AuditStatus";
import { useNotificationContext } from "@/context/notification.provider";
import { AuditStatusDto, MediaDto } from "@/generated/v3/entityService/entityServiceSchemas";

const formattedTextStatus = (text: string) => {
  return text?.replace(/-/g, " ").replace(/\b\w/g, char => char.toUpperCase());
};

const getTextForActionTable = (item: { type: string; status: string }, entity?: string): string => {
  if (item.type === "comment" && entity == "site-polygon") {
    return "New Comment";
  } else if (item.type === "status" && entity == "site-polygon") {
    const text = `New Status: ${formattedTextStatus(item.status)}`;
    if (text === "New Status: Updated") {
      return "Updated";
    }
    return text;
  } else if (item.type === "polygon-data-submission") {
    return item.status != null
      ? `Polygon data submission: ${formattedTextStatus(item.status)}`
      : "Polygon Data Submission";
  } else if (item.type === "ready-for-baseline") {
    return item.status === "yes" ? "Ready for baseline: Yes" : "Ready for baseline: No";
  } else if (item.type === "change-request-updated") {
    return "Change Request Updated";
  } else if (item.type === "reminder-sent") {
    return "Reminder Sent";
  } else if (item.type === "change-request") {
    return "Change Requested";
  } else {
    return "-";
  }
};

const generateUserName = (firstName?: string | null, lastName?: string | null): string =>
  firstName == null && lastName == null ? "Unknown User" : `${firstName} ${lastName}`.trim();

const ENTITY_MAP: Record<string, AuditStatusEntityType> = {
  "site-polygon": "sitePolygons",
  project: "projects",
  site: "sites",
  nursery: "nurseries",
  "project-reports": "projectReports",
  "site-reports": "siteReports",
  "nursery-reports": "nurseryReports",
  "disturbance-reports": "disturbanceReports",
  "srp-reports": "srpReports",
  "financial-reports": "financialReports"
};

const AuditLogTable: FC<{
  auditLogData: { data: AuditStatusDto[] };
  auditData?: { entity: string; entityUuid: string };
  refresh?: () => void;
  fullColumns?: boolean;
  polygonHandoffColumnStyle?: boolean;
}> = ({ auditLogData, auditData, refresh, fullColumns = true, polygonHandoffColumnStyle = false }) => {
  const menuOverflowContainerRef = useRef(null);
  const route = useRouter();
  const isAdmin = route.asPath.includes("admin");

  const columnLayoutEntity = polygonHandoffColumnStyle ? "site-polygon" : (auditData?.entity as string);
  const showAuditStatusColumn = columnLayoutEntity !== "site-polygon" && fullColumns;

  const getColumnTitles = (entity: string, isAdmin: boolean, fullColumns: boolean) => {
    if (entity === "site-polygon") {
      if (fullColumns) {
        return isAdmin
          ? ["Date", "User", "Action", "Comments", "Attachments", ""]
          : ["Date", "User", "Action", "Comments", "Attachments"];
      } else {
        return ["Date", "User", "Action"];
      }
    } else {
      return isAdmin
        ? ["Date", "User", "Status", "Change Request", "Comments", "Attachments", ""]
        : ["Date", "User", "Status", "Change Request", "Comments", "Attachments"];
    }
  };

  const getGridColumnSize = (entity: string, isAdmin: boolean) => {
    if (entity === "site-polygon") {
      if (fullColumns) {
        return isAdmin ? "grid-cols-[14%_20%_15%_27%_19%_5%]" : "grid-cols-[14%_20%_15%_30%_21%]";
      } else {
        return "grid-cols-[30%_30%_40%]";
      }
    } else {
      return isAdmin ? "grid-cols-[14%_10%_10%_15%_27%_19%_5%]" : "grid-cols-[14%_10%_10%_15%_30%_21%]";
    }
  };

  const columnTitles = getColumnTitles(columnLayoutEntity, isAdmin, fullColumns);
  const gridColumnSize = getGridColumnSize(columnLayoutEntity, isAdmin);

  const { openNotification } = useNotificationContext();
  const t = useT();

  const deleteAuditStatus = async (auditUuid: string) => {
    try {
      if (auditData?.entity == null || auditData?.entityUuid == null) {
        openNotification("error", "Error!", t("Missing required information to delete audit log."));
        return;
      }

      const entityType = ENTITY_MAP[auditData.entity];
      if (entityType == null) {
        openNotification("error", "Error!", t("Unknown entity type."));
        return;
      }

      await deleteAuditStatusAsync(auditUuid, entityType, auditData.entityUuid);

      refresh?.();
      openNotification("success", "Success!", t("audit log deleted."));
    } catch (error) {
      openNotification("error", "Error!", t("An error occurred while deleting the audit log."));
    }
  };
  return (
    <div className="mobile:block mobile:w-full mobile:overflow-auto">
      <div className="mobile:w-max">
        <div className={`grid ${gridColumnSize}`}>
          {columnTitles.map(title => (
            <Text key={title} variant="text-12-light" className="border-b border-b-grey-750 text-grey-700">
              {title}
            </Text>
          ))}
        </div>
        <div
          className={classNames(`mr-[-7px] grid pr-[7px] ${gridColumnSize}`, {
            "h-max min-h-max overflow-y-auto overflow-x-hidden pb-10": !fullColumns,
            "max-h-[50vh] min-h-[10vh] overflow-auto ": fullColumns
          })}
          ref={menuOverflowContainerRef}
        >
          {auditLogData?.data?.map((item: AuditStatusDto, index: number) => {
            return (
              <Fragment key={index}>
                <Text variant="text-12" className="border-b border-b-grey-750 py-2 pr-2">
                  {item.dateCreated != null ? convertDateFormat(item.dateCreated) : "-"}
                </Text>
                <Text variant="text-12" className="border-b border-b-grey-750 py-2 pr-2">
                  {generateUserName(item.firstName, item.lastName)}
                </Text>
                {showAuditStatusColumn ? (
                  <Text variant="text-12" className="border-b border-b-grey-750 py-2 pr-2">
                    {item.status != null ? formattedTextStatus(item.status) : "-"}
                  </Text>
                ) : null}
                <Text variant="text-12" className="border-b border-b-grey-750 py-2 pr-2">
                  {getTextForActionTable(
                    {
                      type: item.type ?? "",
                      status: item.status ?? ""
                    },
                    auditData?.entity
                  )}
                </Text>
                {fullColumns ? (
                  <Text variant="text-12" className="border-b border-b-grey-750 py-2">
                    {item.comment ?? "-"}
                  </Text>
                ) : null}
                {fullColumns ? (
                  <div className="grid max-w-full gap-2 gap-y-1 border-b border-b-grey-750 py-2">
                    {item.attachments?.map((attachmentItem: MediaDto) => (
                      <Text
                        key={attachmentItem.uuid}
                        variant="text-12-light"
                        className="h-min w-fit max-w-full cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap rounded-xl bg-neutral-40 px-2 py-0.5"
                        as={"span"}
                        onClick={() => {
                          if (attachmentItem.url != null) window.open(attachmentItem.url, "_blank");
                        }}
                      >
                        {attachmentItem.fileName}
                      </Text>
                    ))}
                  </div>
                ) : null}
                {isAdmin && fullColumns ? (
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
                              onClick={() => deleteAuditStatus(item.uuid)}
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
                ) : null}
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AuditLogTable;
