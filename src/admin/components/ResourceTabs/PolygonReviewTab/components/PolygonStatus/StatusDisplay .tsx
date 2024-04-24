import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { useModalContext } from "@/context/modal.provider";

const menuPolygonOptions = [
  {
    title: "Submitted",
    value: 1
  },
  {
    title: "Needs More Information",
    value: 2
  },
  {
    title: "Approved",
    value: 3
  }
];
const menuSiteOptions = [
  {
    title: "Draft",
    value: 1
  },
  {
    title: "Awaiting Approval",
    value: 2
  },
  {
    title: "Needs More Information",
    value: 3
  },
  {
    title: "Planting in Progress",
    value: 4
  },
  {
    title: "Approved",
    value: 5
  }
];
const menuProjectOptions = [
  {
    title: "Draft",
    value: 1
  },
  {
    title: "Awaiting Approval",
    value: 2
  },
  {
    title: "Needs More Information",
    value: 3
  },
  {
    title: "Approved",
    value: 4
  }
];

export interface StatusProps {
  titleStatus?: "Site" | "Project" | "Polygon";
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

const StatusDisplay = ({ titleStatus = "Polygon" }: StatusProps) => {
  const { openModal, closeModal } = useModalContext();
  const contentStatus = (
    <Text variant="text-12-light" as="p" className="text-center">
      {DescriptionStatusMap[titleStatus]} <b style={{ fontSize: "inherit" }}>Monitoring Begins</b>?
    </Text>
  );
  const contentRequest = (
    <Text variant="text-12-light" as="p" className="text-center">
      {DescriptionRequestMap[titleStatus]} <b style={{ fontSize: "inherit" }}>Malanga.</b>?
    </Text>
  );

  const openFormModalHandlerStatus = () => {
    openModal(
      <ModalConfirm
        title="Polygon Status Change"
        commentArea
        menuLabel="New Polygon Status"
        menu={menuOptionsMap[titleStatus]}
        onClose={closeModal}
        content={contentStatus}
        onConfirm={() => {
          closeModal;
        }}
      />
    );
  };

  const openFormModalHandlerRequest = () => {
    openModal(
      <ModalConfirm
        title={"Request Change"}
        content={contentRequest}
        commentArea
        onClose={closeModal}
        onConfirm={() => {
          closeModal;
        }}
      />
    );
  };
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-full items-center gap-2">
        <Text variant="text-16-bold">Status{titleStatus === "Polygon" ? "" : ` ${titleStatus}`}:</Text>
        <div className="flex items-center gap-[6px] rounded-xl bg-secondary-200 py-[2px] px-[6px]">
          <Icon name={IconNames.STATUS_APPROVED} className="h-4 w-4" />
          <Text variant="text-12-semibold" className="text-green-500">
            Approved
          </Text>
        </div>
      </div>
      <div className="flex w-full items-center gap-4">
        <Button variant="semi-black" className="w-full flex-1 whitespace-nowrap" onClick={openFormModalHandlerRequest}>
          <Text variant="text-12-bold">Request change</Text>
        </Button>
        <Button className="w-full flex-1 border-[3px] border-primary" onClick={openFormModalHandlerStatus}>
          <Text variant="text-12-bold">change status</Text>
        </Button>
      </div>
    </div>
  );
};

export default StatusDisplay;
