import { useT } from "@transifex/react";
import { Dispatch, Fragment, SetStateAction, useRef, useState } from "react";
import { When } from "react-if";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import List from "@/components/extensive/List/List";
import { PolygonData } from "@/pages/site/[uuid]/components/MockecData";

import Checkbox from "../Inputs/Checkbox/Checkbox";
import FilterSearchBox from "../TableFilters/Inputs/FilterSearchBox";
import Text from "../Text/Text";
import MapPolygonPanelItem, { MapPolygonPanelItemProps } from "./MapPolygonPanelItem";

export interface MapPolygonSitePanelProps {
  emptyText?: string;
  onLoadMore: () => void;
  onSelectItem: (item: MapPolygonPanelItemProps) => void;
  setEditPolygon: Dispatch<SetStateAction<boolean>>;
  selected: MapPolygonPanelItemProps | undefined;
  setSelected: Dispatch<SetStateAction<MapPolygonPanelItemProps | undefined>>;
}

const MapPlygonSitePanel = ({
  emptyText,
  onLoadMore,
  onSelectItem,
  setEditPolygon,
  selected,
  setSelected
}: MapPolygonSitePanelProps) => {
  const t = useT();

  const [openMenu, setOpenMenu] = useState(false);
  const refContainer = useRef<HTMLDivElement>(null);
  return (
    <>
      <FilterSearchBox placeholder={"Search"} className="mb-4 w-full" onChange={() => {}} />
      <div className="mb-3 flex items-start justify-between rounded-tl-lg">
        <Text variant="text-14-bold" className="flex items-center uppercase text-white">
          <Icon name={IconNames.PLUS_PA} className="h-4 w-4" />
          &nbsp; new Polygon
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
            <Icon name={IconNames.IC_SORT} className="h-4 w-4 text-blueCustom-900 hover:text-primary-500" />
          </div>
        </div>
      </div>

      <div className="h-[calc(100%-159px)] rounded-bl-lg">
        {PolygonData.length === 0 && (
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
            items={PolygonData}
            itemAs={Fragment}
            render={item => (
              <MapPolygonPanelItem
                uuid={item.uuid}
                title={item.title}
                subtitle={item.subtitle}
                onClick={() => {
                  setSelected(item);
                  onSelectItem(item);
                }}
                isSelected={selected?.uuid === item.uuid}
                refContainer={refContainer}
                setEditPolygon={setEditPolygon}
              />
            )}
          />
        </div>
      </div>
    </>
  );
};

export default MapPlygonSitePanel;
