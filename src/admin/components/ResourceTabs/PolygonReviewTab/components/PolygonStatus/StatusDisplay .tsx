import { useShowContext } from "react-admin";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { useModalContext } from "@/context/modal.provider";

const menuPolygonOptions = [
  {
    title: "Submitted",
    status: "submitted",
    value: 1
  },
  {
    title: "Needs More Information",
    status: "needs-more-information",
    value: 2
  },
  {
    title: "Approved",
    status: "approved",
    value: 3
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
  titleStatus: "Site" | "Project" | "Polygon";
  mutate?: any;
  record?: any;
  refresh?: any;
  name: any;
  refetchPolygon?: any;
  setSelectedPolygon?: any;
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

const StatusDisplay = ({ titleStatus = "Polygon", mutate, refresh, name, record, setSelectedPolygon }: StatusProps) => {
  const { refetch: reloadEntity } = useShowContext();

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

  const openFormModalHandlerStatus = () => {
    openModal(
      <ModalConfirm
        title={`${titleStatus} Status Change`}
        commentArea
        menuLabel={""}
        menu={menuOptionsMap[titleStatus]}
        onClose={closeModal}
        content={contentStatus}
        onConfirm={async (text: any, opt) => {
          const option = menuOptionsMap[titleStatus].find(option => option.value === opt[0]);
          let response;
          try {
            response = await mutate({
              pathParams: { uuid: record?.uuid },
              body: {
                status: option?.status,
                comment: text,
                type: "status"
              }
            });
            if (response.poly_id) {
              setSelectedPolygon(response?.poly_id);
            }
          } catch (e) {
            alert("The request encountered an issue, or the comment exceeds 255 characters.");
            console.error(e);
          } finally {
            refresh();
            reloadEntity();
            closeModal;
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
          } catch (e) {
            alert("The request encountered an issue, or the comment exceeds 255 characters.");
            console.error(e);
          } finally {
            refresh();
            reloadEntity();
            closeModal;
          }
        }}
      />
    );
  };
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full items-center gap-4">
        <Button className="w-full flex-1 border-[3px] border-primary" onClick={openFormModalHandlerStatus}>
          <Text variant="text-12-bold">change status</Text>
        </Button>
        <Button variant="semi-black" className="w-full flex-1 whitespace-nowrap" onClick={openFormModalHandlerRequest}>
          <Text variant="text-12-bold">Change Request</Text>
        </Button>
      </div>
    </div>
  );
};

export default StatusDisplay;
