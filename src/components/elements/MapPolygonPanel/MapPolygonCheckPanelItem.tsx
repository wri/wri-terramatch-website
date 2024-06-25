import { useT } from "@transifex/react";
import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, useState } from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import ModalWithLogo from "@/components/extensive/Modal/ModalWithLogo";
import ModalWithMap from "@/components/extensive/Modal/ModalWithMap";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useModalContext } from "@/context/modal.provider";

import Button from "../Button/Button";
import Menu from "../Menu/Menu";
import { MENU_PLACEMENT_RIGHT_BOTTOM } from "../Menu/MenuVariant";
import { StatusEnum } from "../Status/constants/statusMap";

export interface MapPolygonCheckPanelItemProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  uuid: string;
  title: string;
  isSelected?: boolean;
  refContainer?: React.RefObject<HTMLDivElement> | null;
  valid: boolean;
  polygonValidation?: string[];
}

const MapPolygonCheckPanelItem = ({
  title,
  isSelected,
  className,
  refContainer,
  polygonValidation,
  valid,
  ...props
}: MapPolygonCheckPanelItemProps) => {
  const { openModal, closeModal } = useModalContext();
  const { setEditPolygon } = useMapAreaContext();
  const [openCollapse, setOpenCollapse] = useState(true);
  const t = useT();

  const openFormModalHandlerRequestPolygonSupport = () => {
    openModal(
      <ModalWithMap
        title={t("Request Support")}
        onClose={closeModal}
        content="-&nbsp;&nbsp;•&nbsp;&nbsp;-"
        primaryButtonText={t("Submit")}
        primaryButtonProps={{ className: "px-8 py-3", variant: "primary", onClick: closeModal }}
      ></ModalWithMap>
    );
  };
  const openFormModalHandlerAddCommentary = () => {
    openModal(
      <ModalWithLogo
        title={t("Blue Forest")}
        onClose={closeModal}
        status={StatusEnum.UNDER_REVIEW}
        toogleButton
        content="-&nbsp;&nbsp;•&nbsp;&nbsp;-"
        primaryButtonText={t("Close")}
        primaryButtonProps={{ className: "px-8 py-3", variant: "primary", onClick: closeModal }}
      />
    );
  };
  const openFormModalHandlerConfirm = () => {
    openModal(
      <ModalConfirm
        title={t("Confirm Polygon Deletion")}
        content={t("Do you want to delete this polygon?")}
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
          &nbsp; {t("Edit Polygon")}
        </Text>
      ),
      onClick: () => setEditPolygon?.({ isOpen: true, uuid: "" })
    },
    {
      id: "2",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center">
          <Icon name={IconNames.SEARCH} className="h-4 w-4 lg:h-5 lg:w-5" />
          &nbsp; {t("Zoom to")}
        </Text>
      )
    },
    {
      id: "3",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center">
          <Icon name={IconNames.DOWNLOAD_PA} className="h-4 w-4 lg:h-5 lg:w-5" />
          &nbsp; {t("Download")}
        </Text>
      )
    },
    {
      id: "4",
      render: () => (
        <Button variant="text" onClick={openFormModalHandlerAddCommentary}>
          <Text variant="text-14-semibold" className="flex items-center">
            <Icon name={IconNames.COMMENT} className="h-5 w-5 lg:h-6 lg:w-6" />
            &nbsp; {t("Comment")}
          </Text>
        </Button>
      )
    },
    {
      id: "5",
      render: () => (
        <Button variant="text" onClick={openFormModalHandlerRequestPolygonSupport}>
          <Text variant="text-14-semibold" className="flex items-center">
            <Icon name={IconNames.REQUEST} className="h-5 w-5 lg:h-6 lg:w-6" />
            &nbsp; {t("Request Support")}
          </Text>
        </Button>
      )
    },
    {
      id: "6",
      render: () => (
        <Button variant="text" onClick={openFormModalHandlerConfirm}>
          <Text variant="text-14-semibold" className="flex items-center ">
            <Icon name={IconNames.TRASH_PA} className="h-5 w-5 lg:h-6 lg:w-6" />
            &nbsp; {t("Delete Polygon")}
          </Text>
        </Button>
      )
    }
  ];

  return (
    <div>
      <div {...props} className={className}>
        <div className="flex items-center gap-2">
          <Icon name={valid ? IconNames.ROUND_GREEN_TICK : IconNames.ROUND_RED_CROSS} className="h-4 w-4" />
          <div className="flex flex-1 flex-col">
            <Text variant="text-14-light" className="text-white">
              {t(title)}
            </Text>
          </div>
          <div className="flex h-full items-start self-start">
            <When condition={!!polygonValidation}>
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
        <When condition={!!polygonValidation && !!openCollapse}>
          <div className="my-3 grid gap-3 px-4">
            {polygonValidation?.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <Icon name={IconNames.ERROR_WHITE_BORDER_RED} className="h-4 w-4 rounded-lg text-white lg:h-5 lg:w-5" />
                <Text variant="text-14-light" className="text-white">
                  {t(item)}
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
