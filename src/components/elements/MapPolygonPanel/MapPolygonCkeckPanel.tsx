import { useT } from "@transifex/react";
import { Dispatch, Fragment, SetStateAction, useRef } from "react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import List from "@/components/extensive/List/List";
import { PolygonAvailableData } from "@/pages/site/[uuid]/components/MockecData";

import Text from "../Text/Text";
import MapPolygonCheckPanelItem from "./MapPolygonCheckPanelItem";
import { MapPolygonPanelItemProps } from "./MapPolygonPanelItem";

export interface MapPolygonCheckPanelProps {
  emptyText?: string;
  onLoadMore: () => void;
  setEditPolygon: Dispatch<SetStateAction<boolean>>;
  selected: MapPolygonPanelItemProps | undefined;
}

const MapPlygonCheckPanel = ({ emptyText, onLoadMore, setEditPolygon, selected }: MapPolygonCheckPanelProps) => {
  const t = useT();

  const refContainer = useRef<HTMLDivElement>(null);
  return (
    <>
      <Text variant="text-14" className="mb-6 text-white">
        Available polygons
      </Text>
      <div className="h-[calc(100%-150px)] rounded-bl-lg">
        {PolygonAvailableData.length === 0 && (
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
            items={PolygonAvailableData}
            itemAs={Fragment}
            render={item => (
              <MapPolygonCheckPanelItem
                uuid={item.uuid}
                title={item.title}
                isSelected={selected?.uuid === item.uuid}
                refContainer={refContainer}
                setEditPolygon={setEditPolygon}
                status={item.status}
              />
            )}
          />
        </div>
      </div>
      <Text variant="text-14-bold" className="mt-6 flex items-center uppercase text-white">
        <Icon name={IconNames.PLUS_PA} className="h-4 w-4" />
        &nbsp; Add Polygon
      </Text>
    </>
  );
};

export default MapPlygonCheckPanel;
