import { useT } from "@transifex/react";
import classNames from "classnames";
import { DetailedHTMLProps, Fragment, HTMLAttributes, useRef, useState } from "react";
import { When } from "react-if";

import MapSidePanelItem, { MapSidePanelItemProps } from "@/components/elements/MapSidePanel/MapSidePanelItem";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import List from "@/components/extensive/List/List";
import ModalWithLogo from "@/components/extensive/Modal/ModalWithLogo";
import { useModalContext } from "@/context/modal.provider";
import { uploadImageData } from "@/pages/site/[uuid]/components/MockecData";

import Button from "../Button/Button";
import Checkbox from "../Inputs/Checkbox/Checkbox";

export interface MapSidePanelProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title: string;
  items: MapSidePanelItemProps[];
  onSelectItem: (item: MapSidePanelItemProps) => void;
  onSearch: (query: string) => void;
  onLoadMore: () => void;
  emptyText?: string;
}

const MapSidePanel = ({
  title,
  items,
  className,
  onSelectItem,
  onSearch,
  onLoadMore,
  emptyText,
  ...props
}: MapSidePanelProps) => {
  const t = useT();
  const [selected, setSelected] = useState<MapSidePanelItemProps>();
  const { openModal, closeModal } = useModalContext();
  const refContainer = useRef<HTMLDivElement>(null);
  const [openMenu, setOpenMenu] = useState(false);

  const openFormModalHandlerUploadImages = () => {
    openModal(
      <ModalWithLogo
        title="Upload Images"
        content={
          <Text variant="text-12-light" className="mt-1 mb-4" containHtml>
            Start by adding images for processing.
          </Text>
        }
        primaryButtonText="Close"
        primaryButtonProps={{ className: "px-8 py-3", variant: "primary", onClick: closeModal }}
      >
        <div className="mb-8 flex flex-col items-center justify-center rounded-lg border border-grey-750 py-8 px-[215px]">
          <Icon name={IconNames.UPLOAD_CLOUD} className="mb-4 h-5 w-5" />
          <div className="flex flex-col">
            <Text variant="text-12-bold" className="text-center text-primary">
              Click to upload
            </Text>
            <Text variant="text-12-light" className="text-center">
              or
            </Text>
            <Text variant="text-12-light" className="max-w-[210px] text-center">
              Drag and drop.
            </Text>
          </div>
        </div>
        <div>
          <div className="mb-4 flex justify-between">
            <Text variant="text-12-bold">Uploaded Files</Text>
            <Text variant="text-12-bold" className="w-[146px] whitespace-nowrap pr-6 text-primary">
              Confirming Geolocation
            </Text>
          </div>
          <div className="mb-6 flex flex-col gap-4">
            {uploadImageData.map(image => (
              <div
                key={image.id}
                className="border-grey-75 flex items-center justify-between rounded-lg border border-grey-750 py-[10px] pr-6 pl-4"
              >
                <div className="flex gap-3">
                  <div className="rounded-lg bg-neutral-150 p-2">
                    <Icon name={IconNames.IMAGE} className="h-6 w-6 text-grey-720" />
                  </div>
                  <div>
                    <Text variant="text-12">{image.name}</Text>
                    <Text variant="text-12" className="opacity-50">
                      {image.status}
                    </Text>
                  </div>
                </div>
                <div
                  className={classNames("flex w-[146px] items-center justify-center rounded border py-2", {
                    "border-green-400": image.isVerified,
                    "border-red": !image.isVerified
                  })}
                >
                  <Text
                    variant="text-12-bold"
                    className={classNames({ "text-green-400": image.isVerified, "text-red": !image.isVerified })}
                  >
                    {image.isVerified ? "GeoTagged Verified" : "Not Verified"}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ModalWithLogo>
    );
  };
  //TODO MODALS
  // const openFormModalHandlerAddComentary = () => {
  //   openModal(
  //     <ModalWithLogo
  //       title="Blue Forest"
  //       toogleButton
  //       content={
  //         <Text variant="text-12-bold" className="mt-1 mb-8" containHtml>
  //           Faja Lobi Project&nbsp;&nbsp;•&nbsp;&nbsp;Priceless Planet Coalition
  //         </Text>
  //       }
  //       primaryButtonText="Close"
  //       primaryButtonProps={{ className: "px-8 py-3", variant: "primary", onClick: closeModal }}
  //     >
  //       <div className="mb-[72px] px-20">
  //         <StepProgressbar value={80} labels={polygonStatusLabels} />
  //       </div>
  //       <div className="flex flex-col gap-4">
  //         <ComentaryBox name={"Ricardo"} lastName={"Saavedra"} />
  //         {comentariesItems.map(item => (
  //           <Comentary
  //             key={item.id}
  //             name={item.name}
  //             lastName={item.lastName}
  //             date={item.date}
  //             comentary={item.comentary}
  //             files={item.files}
  //             status={item.status}
  //           />
  //         ))}
  //       </div>
  //     </ModalWithLogo>
  //   );
  // };

  return (
    <div {...props} className={classNames(className)}>
      <div className="mb-3 flex items-start justify-between rounded-tl-lg">
        <Text variant="text-16-bold" className="text-white">
          {title}
        </Text>
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="rounded bg-white p-1.5" onClick={() => setOpenMenu(!openMenu)}>
              <Icon name={IconNames.IC_FILTER} className="h-4 w-4 text-blueCustom-900 hover:text-primary-500" />
            </div>
            <When condition={openMenu}>
              <div className="absolute z-10 mt-1 grid w-max gap-3 rounded-lg bg-white p-3 shadow">
                <Checkbox
                  name=""
                  label={t("Draft")}
                  className="flex-row-reverse items-center justify-end gap-3"
                  textClassName="text-10-semibold"
                />
                <Checkbox
                  name=""
                  label={t("Submitted")}
                  className="flex-row-reverse items-center justify-end gap-3"
                  textClassName="text-10-semibold"
                />
                <Checkbox
                  name=""
                  label={t("Approved")}
                  className="flex-row-reverse items-center justify-end gap-3"
                  textClassName="text-10-semibold"
                />
                <Checkbox
                  name=""
                  label={t("Needs More Info")}
                  className="flex-row-reverse items-center justify-end gap-3"
                  textClassName="text-10-semibold"
                />
              </div>
            </When>
          </div>
          <div className="rounded bg-white p-1.5">
            <Button variant="text" onClick={openFormModalHandlerUploadImages}>
              <Icon name={IconNames.IC_SORT} className="h-4 w-4 text-blueCustom-900 hover:text-primary-500" />
            </Button>
          </div>
        </div>
      </div>
      <div className="h-[calc(100%-38px)] rounded-bl-lg">
        {items.length === 0 && (
          <Text variant="text-16-light" className="mt-8 text-white">
            {emptyText || t("No result")}
          </Text>
        )}
        <div
          ref={refContainer}
          className="mr-[-12px] h-full space-y-4 overflow-y-auto pr-3"
          onScroll={e => {
            //@ts-ignore
            const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
            if (bottom) onLoadMore();
          }}
        >
          <List
            as={Fragment}
            items={items}
            itemAs={Fragment}
            render={item => (
              <MapSidePanelItem
                uuid={item.uuid}
                title={item.title}
                subtitle={item.subtitle}
                onClick={() => {
                  setSelected(item);
                  onSelectItem(item);
                }}
                isSelected={selected?.uuid === item.uuid}
                refContainer={refContainer}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default MapSidePanel;
