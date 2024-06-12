import { useState } from "react";
import { useShowContext } from "react-admin";

import Button from "@/components/elements/Button/Button";
import Notification from "@/components/elements/Notification/Notification";
import Text from "@/components/elements/Text/Text";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { useModalContext } from "@/context/modal.provider";

import { AuditLogEntity } from "../../../AuditLogTab/constants/types";
import { getRequestPathParam } from "../../../AuditLogTab/utils/util";

const menuPolygonOptions = [
  {
    title: "Draft",
    status: "draft",
    value: 1
  },
  {
    title: "Submitted",
    status: "submitted",
    value: 2
  },
  {
    title: "Needs More Information",
    status: "needs-more-information",
    value: 3
  },
  {
    title: "Approved",
    status: "approved",
    value: 4
  }
];
const menuSiteOptions = [
  {
    title: "Draft",
    status: "draft",
    value: 1
  },
  {
    title: "Awaiting Approval",
    status: "awaiting-approval",
    value: 2
  },
  {
    title: "Needs More Information",
    status: "needs-more-information",
    value: 3
  },
  {
    title: "Planting in Progress",
    status: "planting-in-progress",
    value: 4
  },
  {
    title: "Approved",
    status: "approved",
    value: 5
  }
];
const menuProjectOptions = [
  {
    title: "Draft",
    status: "draft",
    value: 1
  },
  {
    title: "Awaiting Approval",
    status: "awaiting-approval",
    value: 2
  },
  {
    title: "Needs More Information",
    status: "needs-more-information",
    value: 3
  },
  {
    title: "Approved",
    status: "approved",
    value: 4
  }
];

export interface StatusProps {
  titleStatus: AuditLogEntity;
  mutate?: any;
  record?: any;
  refresh?: () => void;
  name: any;
  refetchPolygon?: () => void;
  tab?: string;
  checkPolygonsSite?: boolean | undefined;
}

const menuOptionsMap = {
  Polygon: menuPolygonOptions,
  Site: menuSiteOptions,
  Project: menuProjectOptions
};

const DescriptionStatusMap = {
  Polygon: "Are you sure you want to change the polygon status to",
  Site: "Are you sure you want to change the site status to",
  Project: "Are you sure you want to change the project status to"
};

const DescriptionRequestMap = {
  Polygon: "Provide an explanation for your change request for the polygon",
  Site: "Provide an explanation for your change request for the site",
  Project: "Provide an explanation for your change request for the project"
};

const StatusDisplay = ({
  titleStatus = "Polygon",
  mutate,
  refresh,
  name,
  record,
  checkPolygonsSite,
  tab
}: StatusProps) => {
  const { refetch: reloadEntity } = useShowContext();
  const [notificationStatus, setNotificationStatus] = useState<{
    open: boolean;
    message: string;
    type: "success" | "error" | "warning";
    title: string;
  }>({
    open: false,
    message: "",
    type: "success",
    title: "Success!"
  });

  const { openModal, closeModal } = useModalContext();
  const contentStatus = (
    <Text variant="text-12-light" as="p" className="text-center">
      {DescriptionStatusMap[titleStatus]} <b style={{ fontSize: "inherit" }}>{name}</b>?
    </Text>
  );
  const contentRequest = (
    <Text variant="text-12-light" as="p" className="text-center">
      {DescriptionRequestMap[titleStatus]} <b style={{ fontSize: "inherit" }}>{name}</b>?
    </Text>
  );

  const onFinallyRequest = () => {
    refresh && refresh();
    reloadEntity && reloadEntity();
    closeModal();
  };

  const openFormModalHandlerStatus = () => {
    openModal(
      <ModalConfirm
        title={`${titleStatus} Status Change`}
        commentArea
        menuLabel={""}
        menu={menuOptionsMap[titleStatus]}
        onClose={closeModal}
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
            setNotificationStatus({
              open: true,
              message: "Your Status Update was just saved!",
              type: "success",
              title: "Success!"
            });
            setTimeout(() => {
              setNotificationStatus({
                open: false,
                message: "",
                type: "success",
                title: "Success!"
              });
            }, 3000);
          } catch (e) {
            setNotificationStatus({
              open: true,
              message: "The request encountered an issue, or the comment exceeds 255 characters.",
              type: "error",
              title: "Error!"
            });
            setTimeout(() => {
              setNotificationStatus({
                open: false,
                message: "",
                type: "error",
                title: "Error!"
              });
            }, 3000);
            console.error(e);
          } finally {
            onFinallyRequest();
          }
        }}
      />
    );
  };

  const openFormModalHandlerRequest = () => {
    openModal(
      <ModalConfirm
        title={"Change Request"}
        content={contentRequest}
        commentArea
        onClose={closeModal}
        onConfirm={async (text: any, opt) => {
          const option = menuOptionsMap[titleStatus].find(option => option.value === opt[0]);
          try {
            await mutate({
              pathParams: { uuid: record?.uuid },
              body: {
                status: option?.status,
                comment: text,
                type: "change-request",
                is_active: true,
                request_removed: false
              }
            });
            setNotificationStatus({
              open: true,
              message: "Your Change Request was just added!",
              type: "success",
              title: "Success!"
            });
            setTimeout(() => {
              setNotificationStatus({
                open: false,
                message: "",
                type: "success",
                title: "Success!"
              });
            }, 3000);
          } catch (e) {
            setNotificationStatus({
              open: true,
              message: "The request encountered an issue, or the comment exceeds 255 characters.",
              type: "error",
              title: "Error!"
            });
            setTimeout(() => {
              setNotificationStatus({
                open: false,
                message: "",
                type: "error",
                title: "Error!"
              });
            }, 3000);
            console.error(e);
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
          <Button className="w-full flex-1 border-[3px] border-primary" onClick={openFormModalHandlerStatus}>
            <Text variant="text-12-bold">change status</Text>
          </Button>
          <Button
            disabled={tab == "polygonReview"}
            variant="semi-black"
            className={`w-full flex-1 whitespace-nowrap ${tab == "polygonReview" ? "opacity-0" : ""}`}
            onClick={openFormModalHandlerRequest}
          >
            <Text variant="text-12-bold">Change Request</Text>
          </Button>
        </div>
      </div>
      <Notification {...notificationStatus} />
    </>
  );
};

export default StatusDisplay;
