import classNames from "classnames";
import { DetailedHTMLProps, Dispatch, HTMLAttributes, SetStateAction, useState } from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import ModalWithLogo from "@/components/extensive/Modal/ModalWithLogo";
import ModalWithMap from "@/components/extensive/Modal/ModalWithMap";
import { useModalContext } from "@/context/modal.provider";
import { comentariesItems, polygonStatusLabels } from "@/pages/site/[uuid]/components/MockecData";

import Button from "../Button/Button";
import Comentary from "../Comentary/Comentary";
import ComentaryBox from "../ComentaryBox/ComentaryBox";
import DragAndDrop from "../DragAndDrop/DragAndDrop";
import TextArea from "../Inputs/textArea/TextArea";
import Menu from "../Menu/Menu";
import { MENU_PLACEMENT_RIGHT_BOTTOM } from "../Menu/MenuVariant";
import StepProgressbar from "../ProgressBar/StepProgressbar/StepProgressbar";

export interface MapPolygonCheckPanelItemProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  uuid: string;
  title: string;
  isSelected?: boolean;
  refContainer?: React.RefObject<HTMLDivElement> | null;
  setEditPolygon?: Dispatch<SetStateAction<boolean>>;
  status: string;
  polygon?: string[];
}

const MapPolygonCheckPanelItem = ({
  title,
  isSelected,
  className,
  refContainer,
  setEditPolygon,
  polygon,
  status,
  ...props
}: MapPolygonCheckPanelItemProps) => {
  const { openModal, closeModal } = useModalContext();
  const [openCollapse, setOpenCollapse] = useState(true);
  const openFormModalHandlerRequestPolygonSupport = () => {
    openModal(
      <ModalWithMap
        title="Request Support"
        onCLose={closeModal}
        content={
          <Text variant="text-16-bold" className="mt-1 mb-8" containHtml>
            Faja Lobi Project&nbsp;&nbsp;•&nbsp;&nbsp;Priceless Planet Coalition
          </Text>
        }
        primaryButtonText="Submit"
        primaryButtonProps={{ className: "px-8 py-3", variant: "primary", onClick: closeModal }}
      >
        <div className="mb-[72px]">
          <StepProgressbar value={80} labels={polygonStatusLabels} />
        </div>
        <TextArea
          name={""}
          label="Comment"
          labelVariant="text-12-light"
          labelClassname="capitalize "
          className="text-12-light max-h-72 !min-h-0 resize-none"
          placeholder="Insert my comment"
          rows={4}
        />
        <Text variant="text-12-light" className="mt-6 mb-2">
          Attachments
        </Text>
        <DragAndDrop
          description={
            <div className="flex flex-col">
              <Text variant="text-12-bold" className="text-center text-primary">
                Click to upload
              </Text>
              <Text variant="text-12-bold" className="whitespace-nowrap text-center text-primary">
                documents or images to help reviewer
              </Text>
            </div>
          }
        />
      </ModalWithMap>
    );
  };
  const openFormModalHandlerAddCommentary = () => {
    openModal(
      <ModalWithLogo
        title="Blue Forest"
        onCLose={closeModal}
        toogleButton
        content={
          <Text variant="text-12-bold" className="mt-1 mb-8" containHtml>
            Faja Lobi Project&nbsp;&nbsp;•&nbsp;&nbsp;Priceless Planet Coalition
          </Text>
        }
        primaryButtonText="Close"
        primaryButtonProps={{ className: "px-8 py-3", variant: "primary", onClick: closeModal }}
      >
        <div className="mb-[72px] px-20">
          <StepProgressbar value={80} labels={polygonStatusLabels} />
        </div>
        <div className="flex flex-col gap-4">
          <ComentaryBox name={"Ricardo"} lastName={"Saavedra"} />
          {comentariesItems.map(item => (
            <Comentary
              key={item.id}
              name={item.name}
              lastName={item.lastName}
              date={item.date}
              comentary={item.comentary}
              files={item.files}
              status={item.status}
            />
          ))}
        </div>
      </ModalWithLogo>
    );
  };
  const openFormModalHandlerConfirm = () => {
    openModal(
      <ModalConfirm
        title={"Confirm Polygon Deletion"}
        content="Do you want to delete this polgyon?"
        onClose={closeModal}
        onConfirm={() => {}}
      />
    );
  };

  const itemsPrimaryMenu = [
    {
      id: "1",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center">
          <Icon name={IconNames.IC_SITE_VIEW} className="h-4 w-4 lg:h-5 lg:w-5" />
          &nbsp; Edit Polygon
        </Text>
      ),
      onClick: () => {
        if (setEditPolygon) {
          setEditPolygon(true);
        }
      }
    },
    {
      id: "2",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center">
          <Icon name={IconNames.SEARCH} className="h-4 w-4 lg:h-5 lg:w-5" />
          &nbsp; Zoom to
        </Text>
      )
    },
    {
      id: "3",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center">
          <Icon name={IconNames.IC_DOWNLOAD_MENU} className="h-4 w-4 lg:h-5 lg:w-5" />
          &nbsp; Download
        </Text>
      )
    },
    {
      id: "4",
      render: () => (
        <Button variant="text" onClick={openFormModalHandlerAddCommentary}>
          <Text variant="text-14-semibold" className="flex items-center">
            <Icon name={IconNames.COMMENT} className="h-5 w-4 lg:h-6 lg:w-6" />
            &nbsp; Comment
          </Text>
        </Button>
      )
    },
    {
      id: "5",
      render: () => (
        <Button variant="text" onClick={openFormModalHandlerRequestPolygonSupport}>
          <Text variant="text-14-semibold" className="flex items-center">
            <Icon name={IconNames.REQUEST} className="h-5 w-4 lg:h-6 lg:w-6" />
            &nbsp; Request Support
          </Text>
        </Button>
      )
    },
    {
      id: "6",
      render: () => (
        <Button variant="text" onClick={openFormModalHandlerConfirm}>
          <Text variant="text-14-semibold" className="flex items-center ">
            <Icon name={IconNames.TRASH_PA} className="h-5 w-4 lg:h-6 lg:w-6" />
            &nbsp; Delete Polygon
          </Text>
        </Button>
      )
    }
  ];

  const dynamicClasses = (status: string) => {
    switch (status) {
      case "Submitted":
        return "bg-blueCustom-200";
      case "Approved":
        return "bg-greenCustom-200";
      case "Needs More Info":
        return "bg-tertiary-600";
      case "Draft":
        return "bg-pinkCustom";
      default:
        return "bg-blueCustom-200 ";
    }
  };

  return (
    <div>
      <div {...props} className={className}>
        <div className="flex items-center gap-2">
          <div className={classNames("h-4 w-4 rounded-full", dynamicClasses(status))} />{" "}
          <div className="flex flex-1 flex-col">
            <Text variant="text-14-light" className="text-white">
              {title}
            </Text>
          </div>
          <div className="flex h-full items-start self-start">
            <When condition={!!polygon}>
              <button
                onClick={() => {
                  setOpenCollapse(!openCollapse);
                }}
              >
                <Icon
                  name={IconNames.CHEVRON_DOWN}
                  className={classNames(
                    "h-3 w-3 rounded-lg text-white hover:fill-primary hover:text-primary lg:h-4 lg:w-4",
                    { "rotate-180 transform": !!openCollapse }
                  )}
                />
              </button>
            </When>

            <Menu container={refContainer?.current} placement={MENU_PLACEMENT_RIGHT_BOTTOM} menu={itemsPrimaryMenu}>
              <Icon
                name={IconNames.IC_MORE_OUTLINED}
                className="h-4 w-4 rounded-lg text-white hover:fill-primary hover:text-primary lg:h-5 lg:w-5"
              />
            </Menu>
          </div>
        </div>
        <When condition={!!polygon && !!openCollapse}>
          <div className="my-3 grid gap-3 px-4">
            {polygon?.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <Icon name={IconNames.ERROR_WHITE_BORDER_RED} className="h-4 w-4 rounded-lg text-white lg:h-5 lg:w-5" />
                <Text variant="text-14-light" className="text-white">
                  {item}
                </Text>
              </div>
            ))}
          </div>
        </When>
      </div>
    </div>
  );
};

export default MapPolygonCheckPanelItem;
