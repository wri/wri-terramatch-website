import classNames from "classnames";
import { useShowContext } from "react-admin";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { AuditStatusEntityType, v3EntityToAuditLogEntity } from "@/connections/AuditStatus";
import { POLYGON_INFORMATION_REQUIRED, POLYGON_PENDING_APPROVAL } from "@/constants/polygonStatuses";
import { useModalContext } from "@/context/modal.provider";
import { useNotificationContext } from "@/context/notification.provider";
import useAuditLogActions from "@/hooks/AuditStatus/useAuditLogActions";

const menuPolygonOptions = [
  {
    title: "Draft",
    status: "draft",
    value: 1,
    viewPd: true
  },
  {
    title: "Pending Approval",
    status: POLYGON_PENDING_APPROVAL,
    value: 2,
    viewPd: true
  },
  {
    title: "Information Required",
    status: POLYGON_INFORMATION_REQUIRED,
    value: 3,
    viewPd: false
  },
  {
    title: "Approved",
    status: "approved",
    value: 4,
    viewPd: false
  }
];
const menuSiteOptions = [
  {
    title: "Started",
    status: "started",
    value: 1,
    viewPd: true
  },
  {
    title: "Awaiting Approval",
    status: "awaiting-approval",
    value: 2,
    viewPd: true
  },
  {
    title: "Needs More Information",
    status: "needs-more-information",
    value: 3,
    viewPd: false
  },
  {
    title: "Approved",
    status: "approved",
    value: 5,
    viewPd: false
  }
];
const menuProjectOptions = [
  {
    title: "Started",
    status: "started",
    value: 1,
    viewPd: true
  },
  {
    title: "Awaiting Approval",
    status: "awaiting-approval",
    value: 2,
    viewPd: true
  },
  {
    title: "Needs More Information",
    status: "needs-more-information",
    value: 3,
    viewPd: false
  },
  {
    title: "Approved",
    status: "approved",
    value: 4,
    viewPd: false
  }
];
const menuEntityReportOptions = [
  {
    title: "Due",
    status: "due",
    value: 1,
    viewPd: true
  },
  {
    title: "Started",
    status: "started",
    value: 2,
    viewPd: true
  },
  {
    title: "Needs More Information",
    status: "needs-more-information",
    value: 3,
    viewPd: false
  },
  {
    title: "Awaiting Approval",
    status: "awaiting-approval",
    value: 4,
    viewPd: false
  },
  {
    title: "Approved",
    status: "approved",
    value: 5,
    viewPd: false
  }
];
const menuNurseryOptions = [
  {
    title: "Started",
    status: "started",
    value: 1,
    viewPd: true
  },
  {
    title: "Awaiting Approval",
    status: "awaiting-approval",
    value: 2,
    viewPd: true
  },
  {
    title: "Needs More Information",
    status: "needs-more-information",
    value: 3,
    viewPd: false
  },
  {
    title: "Approved",
    status: "approved",
    value: 4,
    viewPd: false
  }
];
export interface StatusProps {
  titleStatus: AuditStatusEntityType;
  record?: any;
  refresh?: () => void;
  name: any;
  refetchPolygon?: () => void;
  showChangeRequest?: boolean;
  checkPolygonsSite?: boolean | undefined;
  viewPD?: boolean;
  /** V3 callback for status changes: type-safe reference to useAuditLogActions.onStatusChange */
  onStatusChange?: ReturnType<typeof useAuditLogActions>["onStatusChange"];
  /** V3 callback for change requests: type-safe reference to useAuditLogActions.onChangeRequest */
  onChangeRequest?: ReturnType<typeof useAuditLogActions>["onChangeRequest"];
}

const menuOptionsMap = {
  Polygon: menuPolygonOptions,
  Site: menuSiteOptions,
  Project: menuProjectOptions,
  Nursery: menuNurseryOptions,
  Nursery_Report: menuEntityReportOptions,
  Site_Report: menuEntityReportOptions,
  Project_Report: menuEntityReportOptions,
  Disturbance_Report: menuEntityReportOptions,
  Srp_Report: menuEntityReportOptions,
  Financial_Report: menuEntityReportOptions
};

const DescriptionStatusMap = {
  Polygon: "Select new polygon status for",
  Site: "Are you sure you want to change the site status to",
  Project: "Are you sure you want to change the project status to",
  Nursery: "Are you sure you want to change the nursery status to",
  Nursery_Report: "Are you sure you want to change the nursery report status to",
  Site_Report: "Are you sure you want to change the site report status to",
  Project_Report: "Are you sure you want to change the project report status to",
  Disturbance_Report: "Are you sure you want to change the disturbance report status to",
  Srp_Report: "Are you sure you want to change the srp report status to",
  Financial_Report: "Are you sure you want to change the financial report status to"
};

const DescriptionRequestMap = {
  Polygon: "Provide an explanation for your change request for the polygon",
  Site: "Provide an explanation for your change request for the site",
  Project: "Provide an explanation for your change request for the project",
  Nursery: "Provide an explanation for your change request for the nursery",
  Nursery_Report: "Provide an explanation for your change request for the nursery report",
  Site_Report: "Provide an explanation for your change request for the site report",
  Project_Report: "Provide an explanation for your change request for the project report",
  Disturbance_Report: "Provide an explanation for your change request for the disturbance report",
  Srp_Report: "Provide an explanation for your change request for the srp report",
  Financial_Report: "Provide an explanation for your change request for the financial report"
};

const StatusDisplay = ({
  titleStatus = "sitePolygons",
  refresh,
  name,
  record,
  checkPolygonsSite,
  showChangeRequest = false,
  viewPD,
  onStatusChange,
  onChangeRequest
}: StatusProps) => {
  const { refetch: reloadEntity } = useShowContext();
  const { openNotification } = useNotificationContext();
  const { openModal, closeModal } = useModalContext();

  const legacyEntityType = v3EntityToAuditLogEntity(titleStatus);
  const removeUnderscore = (title: string): string => title.replace(/_/g, " ");

  const getDisplayName = (): string => {
    if (titleStatus === "sitePolygons") {
      const displayName = name ?? record?.name ?? "";
      return displayName != null && displayName.length > 0 ? `${displayName}.` : ".";
    }
    const displayName = name != null ? removeUnderscore(name) : "";
    return displayName != null && displayName.length > 0 ? `${displayName}.` : ".";
  };

  const contentStatus = (
    <div className="text-center">
      <Text variant="text-12-light" as="span" className="text-center">
        {DescriptionStatusMap[legacyEntityType as keyof typeof DescriptionStatusMap]}
      </Text>
      <Text variant="text-12-bold" as="span">
        {" "}
        {getDisplayName()}
      </Text>
    </div>
  );
  const contentRequest = (
    <Text variant="text-12-light" as="p" className="text-center">
      {DescriptionRequestMap[legacyEntityType as keyof typeof DescriptionRequestMap]}{" "}
      <b style={{ fontSize: "inherit" }}>{name}</b>?
    </Text>
  );

  const filterViewPd = viewPD
    ? menuOptionsMap[legacyEntityType as keyof typeof menuOptionsMap].filter(option => option.viewPd === true)
    : menuOptionsMap[legacyEntityType as keyof typeof menuOptionsMap];

  const onFinallyRequest = () => {
    refresh?.();
    reloadEntity?.();
    closeModal(ModalId.STATUS_CHANGE);
    closeModal(ModalId.CHANGE_REQUEST);
  };

  const openFormModalHandlerStatus = () => {
    openModal(
      ModalId.STATUS_CHANGE,
      <ModalConfirm
        title={`${removeUnderscore(legacyEntityType)} Status Change`}
        commentArea
        menuLabel={""}
        menu={filterViewPd}
        onClose={() => closeModal(ModalId.STATUS_CHANGE)}
        content={contentStatus}
        checkPolygonsSite={checkPolygonsSite}
        onConfirm={async (text: string | undefined, opt: number[]) => {
          const option = menuOptionsMap[legacyEntityType as keyof typeof menuOptionsMap].find(
            option => option.value === opt[0]
          );
          try {
            if (option?.status != null && onStatusChange != null) {
              await onStatusChange(option.status, text ?? "");
            }
            openNotification("success", "Success!", "Your Status Update was just saved!");
          } catch (e) {
            openNotification(
              "error",
              "Error!",
              "The request encountered an issue, or the comment exceeds 255 characters."
            );
          } finally {
            onFinallyRequest();
          }
        }}
      />
    );
  };

  const openFormModalHandlerRequest = () => {
    if (onChangeRequest == null) return;

    openModal(
      ModalId.CHANGE_REQUEST,
      <ModalConfirm
        title={"Change Request"}
        content={contentRequest}
        commentArea
        onClose={() => closeModal(ModalId.CHANGE_REQUEST)}
        onConfirm={async (text: string | undefined) => {
          try {
            if (onChangeRequest != null) {
              await onChangeRequest(text ?? "");
            }
            openNotification("success", "Success!", "Your Change Request was just added!");
          } catch (e) {
            openNotification(
              "error",
              "Error!",
              "The request encountered an issue, or the comment exceeds 255 characters."
            );
          } finally {
            onFinallyRequest();
          }
        }}
      />
    );
  };

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <div className="flex w-full items-center gap-4">
          <Button
            className={classNames("w-full flex-1 border-[3px] border-primary", {
              "opacity-0": titleStatus !== "sitePolygons"
            })}
            onClick={openFormModalHandlerStatus}
            disabled={titleStatus !== "sitePolygons"}
          >
            <Text variant="text-12-bold">change status</Text>
          </Button>
          <Button
            disabled={!showChangeRequest || onChangeRequest == null}
            variant="semi-black"
            className={classNames("w-full flex-1 whitespace-nowrap", { "opacity-0": !showChangeRequest })}
            onClick={openFormModalHandlerRequest}
          >
            <Text variant="text-12-bold">Change Request</Text>
          </Button>
        </div>
      </div>
    </>
  );
};

export default StatusDisplay;
