import { useT } from "@transifex/react";
import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes } from "react";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useModalContext } from "@/context/modal.provider";

import Button from "../Button/Button";
import Menu from "../Menu/Menu";
import { MENU_PLACEMENT_RIGHT_BOTTOM } from "../Menu/MenuVariant";

export interface MapMenuPanelItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  uuid: string;
  title: string;
  subtitle: string;
  status: string;
  isSelected?: boolean;
  poly_id?: string;
  site_id?: string;
  setClickedButton: React.Dispatch<React.SetStateAction<string>>;
  refContainer: React.RefObject<HTMLDivElement> | null;
  type: string;
}

const MapMenuPanelItem = ({
  uuid,
  title,
  subtitle,
  status,
  isSelected,
  setClickedButton,
  className,
  refContainer,
  type,
  ...props
}: MapMenuPanelItemProps) => {
  let imageStatus = `IC_${status.toUpperCase().replace(/-/g, "_")}`;
  const { openModal, closeModal } = useModalContext();
  const { isMonitoring } = useMapAreaContext();
  const t = useT();
  const openFormModalHandlerConfirm = () => {
    openModal(
      <ModalConfirm
        title={t("Confirm Polygon Deletion")}
        content={t("Do you want to delete this polygon?")}
        onClose={closeModal}
        onConfirm={() => {
          setClickedButton("delete");
          closeModal();
        }}
      />
    );
  };
  const commonItems = [
    {
      id: "1",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center">
          <Icon name={IconNames.SEARCH} className="h-4 w-4 lg:h-5 lg:w-5" />
          &nbsp; {t("Zoom to")}
        </Text>
      ),
      onClick: () => setClickedButton("zoomTo")
    },
    {
      id: "2",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center">
          <Icon name={IconNames.DOWNLOAD_PA} className="h-4 w-4 lg:h-5 lg:w-5" />
          &nbsp; {t("Download")}
        </Text>
      ),
      onClick: () => setClickedButton("download")
    }
  ];

  const monitoringItems = [
    {
      id: "0",
      render: () => (
        <Text variant="text-14-semibold" className="flex items-center">
          <Icon name={IconNames.IC_SITE_VIEW} className="h-4 w-4 lg:h-5 lg:w-5" />
          &nbsp; {t("Edit Polygon")}
        </Text>
      ),
      onClick: () => {}
    },
    ...commonItems,
    {
      id: "5",
      render: () => (
        <Button variant="text" onClick={openFormModalHandlerConfirm}>
          <Text variant="text-14-semibold" className="flex items-center">
            <Icon name={IconNames.TRASH_PA} className="h-5 w-5 lg:h-6 lg:w-6" />
            &nbsp; {t("Delete Polygon")}
          </Text>
        </Button>
      )
    }
  ];

  const nonMonitoringItems = [
    ...(type !== "sites"
      ? [
          {
            id: "0",
            render: () => (
              <Text variant="text-14-semibold" className="flex items-center" onClick={() => setClickedButton("site")}>
                <Icon name={IconNames.IC_SITE_VIEW} className="h-4 w-4 lg:h-5 lg:w-5" />
                &nbsp; {t("View Site")}
              </Text>
            )
          }
        ]
      : []),
    ...commonItems
  ];

  const itemsPrimaryMenu = isMonitoring ? monitoringItems : nonMonitoringItems;
  return (
    <div>
      <div
        {...props}
        className={classNames(className, " rounded-lg border-2 border-transparent bg-white p-2 hover:border-primary", {
          "border-primary-500": isSelected,
          "border-neutral-500 hover:border-neutral-800": !isSelected
        })}
      >
        <div className="flex items-center gap-2">
          <Icon
            name={IconNames[imageStatus as keyof typeof IconNames]}
            className="h-11 w-11 rounded-lg bg-neutral-300"
          />
          <div className="flex flex-1 flex-col">
            <Text variant="text-14-bold" className="">
              {t(title)}
            </Text>
            <Text variant="text-14-light">{subtitle}</Text>
          </div>
          <div className="flex h-full self-start">
            <Menu container={refContainer?.current} placement={MENU_PLACEMENT_RIGHT_BOTTOM} menu={itemsPrimaryMenu}>
              <Icon
                name={IconNames.IC_MORE_OUTLINED}
                className="h-4 w-4 rounded-lg hover:fill-primary hover:text-primary lg:h-5 lg:w-5"
              />
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapMenuPanelItem;
