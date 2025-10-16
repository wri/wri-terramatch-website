import classNames from "classnames";
import { useShowContext } from "react-admin";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useModalContext } from "@/context/modal.provider";
import { useNotificationContext } from "@/context/notification.provider";
import Log from "@/utils/log";

import { AuditLogEntity, AuditLogEntityEnum } from "../../../AuditLogTab/constants/types";
import { getRequestPathParam } from "../../../AuditLogTab/utils/util";

const menuPolygonOptions = [
  {
    title: "Draft",
    status: "draft",
    value: 1,
    viewPd: true
  },
  {
    title: "Submitted",
    status: "submitted",
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
    title: "Restoration in Progress",
    status: "restoration-in-progress",
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
  titleStatus: AuditLogEntity;
  mutate?: any;
  record?: any;
  refresh?: () => void;
  name: any;
  refetchPolygon?: () => void;
  showChangeRequest?: boolean;
  checkPolygonsSite?: boolean | undefined;
  viewPD?: boolean;
}

const menuOptionsMap = {
  Polygon: menuPolygonOptions,
  Site: menuSiteOptions,
  Project: menuProjectOptions,
  Nursery: menuNurseryOptions,
  Nursery_Report: menuEntityReportOptions,
  Site_Report: menuEntityReportOptions,
  Project_Report: menuEntityReportOptions,
  Disturbance_Report: menuEntityReportOptions
};

const DescriptionStatusMap = {
  Polygon: "Select new polygon status for",
  Site: "Are you sure you want to change the site status to",
  Project: "Are you sure you want to change the project status to",
  Nursery: "Are you sure you want to change the nursery status to",
  Nursery_Report: "Are you sure you want to change the nursery report status to",
  Site_Report: "Are you sure you want to change the site report status to",
  Project_Report: "Are you sure you want to change the project report status to",
  Disturbance_Report: "Are you sure you want to change the disturbance report status to"
};

const DescriptionRequestMap = {
  Polygon: "Provide an explanation for your change request for the polygon",
  Site: "Provide an explanation for your change request for the site",
  Project: "Provide an explanation for your change request for the project",
  Nursery: "Provide an explanation for your change request for the nursery",
  Nursery_Report: "Provide an explanation for your change request for the nursery report",
  Site_Report: "Provide an explanation for your change request for the site report",
  Project_Report: "Provide an explanation for your change request for the project report",
  Disturbance_Report: "Provide an explanation for your change request for the disturbance report"
};

const StatusDisplay = ({
  titleStatus = AuditLogEntityEnum.Polygon,
  mutate,
  refresh,
  name,
  record,
  checkPolygonsSite,
  showChangeRequest = false,
  viewPD
}: StatusProps) => {
  const { refetch: reloadEntity } = useShowContext();
  const { openNotification } = useNotificationContext();

  const { openModal, closeModal } = useModalContext();
  const removeUnderscore = (title: string) => title.replace("_", " ");
  const contentStatus = (
    <div className="text-center">
      <Text variant="text-12-light" as="span" className="text-center">
        {DescriptionStatusMap[titleStatus]}
      </Text>
      <Text variant="text-12-bold" as="span">
        {" "}
        {titleStatus == AuditLogEntityEnum.Polygon ? record?.title || record?.poly_name : removeUnderscore(name)}.
      </Text>
    </div>
  );
  const contentRequest = (
    <Text variant="text-12-light" as="p" className="text-center">
      {DescriptionRequestMap[titleStatus]} <b style={{ fontSize: "inherit" }}>{name}</b>?
    </Text>
  );

  const filterViewPd = viewPD
    ? menuOptionsMap[titleStatus].filter(option => option.viewPd === true)
    : menuOptionsMap[titleStatus];

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
        title={`${removeUnderscore(titleStatus)} Status Change`}
        commentArea
        menuLabel={""}
        menu={filterViewPd}
        onClose={() => closeModal(ModalId.STATUS_CHANGE)}
        content={contentStatus}
        checkPolygonsSite={checkPolygonsSite}
        onConfirm={async (text: any, opt) => {
          const option = menuOptionsMap[titleStatus].find(option => option.value === opt[0]);
          try {
            await mutate({
              pathParams: {
                uuid: record?.uuid,
                entity: getRequestPathParam(titleStatus)
              },
              body: {
                status: option?.status,
                comment: text,
                type: "status"
              }
            });
            openNotification("success", "Success!", "Your Status Update was just saved!");
          } catch (e) {
            openNotification(
              "error",
              "Error!",
              "The request encountered an issue, or the comment exceeds 255 characters."
            );

            Log.error("The request encountered an issue", e);
          } finally {
            onFinallyRequest();
          }
        }}
      />
    );
  };

  const openFormModalHandlerRequest = () => {
    openModal(
      ModalId.CHANGE_REQUEST,
      <ModalConfirm
        title={"Change Request"}
        content={contentRequest}
        commentArea
        onClose={() => closeModal(ModalId.CHANGE_REQUEST)}
        onConfirm={async (text: any) => {
          try {
            await mutate({
              pathParams: { uuid: record?.uuid, entity: getRequestPathParam(titleStatus) },
              body: {
                status: "",
                comment: text,
                type: "change-request",
                is_active: true,
                request_removed: false
              }
            });
            openNotification("success", "Success!", "Your Change Request was just added!");
          } catch (e) {
            openNotification(
              "error",
              "Error!",
              "The request encountered an issue, or the comment exceeds 255 characters."
            );
            Log.error("Request encountered an issue", e);
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
              "opacity-0": titleStatus !== AuditLogEntityEnum.Polygon
            })}
            onClick={openFormModalHandlerStatus}
            disabled={titleStatus !== AuditLogEntityEnum.Polygon}
          >
            <Text variant="text-12-bold">change status</Text>
          </Button>
          <Button
            disabled={!showChangeRequest}
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
