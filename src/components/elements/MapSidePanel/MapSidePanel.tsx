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
import { comentariesItems, polygonStatusLabels } from "@/pages/site/[uuid]/components/MockecData";

import Button from "../Button/Button";
import Comentary from "../Comentary/Comentary";
import ComentaryBox from "../ComentaryBox/ComentaryBox";
import Checkbox from "../Inputs/Checkbox/Checkbox";
import StepProgressbar from "../ProgressBar/StepProgressbar/StepProgressbar";

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

  //TODO MODALS
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
            <Button variant="text" onClick={openFormModalHandlerAddCommentary}>
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
