import { useT } from "@transifex/react";
import classNames from "classnames";
import { DetailedHTMLProps, Dispatch, HTMLAttributes, SetStateAction, useState } from "react";
import { Else, If, Then, When } from "react-if";

import { useMapAreaContext } from "@/context/mapArea.provider";

import Button from "../Button/Button";
import MapSidePanel from "../MapSidePanel/MapSidePanel";
import MapEditPolygonPanel from "./MapEditPolygonPanel";
import { MapMenuPanelItemProps } from "./MapMenuPanelItem";
import MapPolygonCheckPanel from "./MapPolygonCheckPanel";

export interface MapPolygonPanelProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title: string;
  items: MapMenuPanelItemProps[];
  onSelectItem: (item: MapMenuPanelItemProps) => void;
  onLoadMore: () => void;
  emptyText?: string;
  tabEditPolygon: string;
  setTabEditPolygon: Dispatch<SetStateAction<string>>;
  stateViewPanel: boolean;
  setStateViewPanel: Dispatch<SetStateAction<boolean>>;
  setPreviewVersion: Dispatch<SetStateAction<boolean>>;
  mapFunctions: any;
  checkedValues: string[];
  onCheckboxChange: (value: string, checked: boolean) => void;
  setSortOrder: React.Dispatch<React.SetStateAction<string>>;
  type: string;
  recallEntityData?: () => void;
}

const MapPolygonPanel = ({
  title,
  items,
  className,
  onSelectItem,
  onLoadMore,
  emptyText,
  tabEditPolygon,
  setTabEditPolygon,
  stateViewPanel,
  setStateViewPanel,
  setPreviewVersion,
  mapFunctions,
  checkedValues,
  onCheckboxChange,
  setSortOrder,
  type,
  recallEntityData,
  ...props
}: MapPolygonPanelProps) => {
  const t = useT();
  const [selected] = useState<MapMenuPanelItemProps>();
  const { editPolygon } = useMapAreaContext();
  return (
    <div {...props} className={classNames(className)}>
      <div className="absolute top-0 left-0 -z-10 h-full w-full backdrop-blur-md" />

      <If condition={!!editPolygon.isOpen}>
        <Then>
          <MapEditPolygonPanel
            tabEditPolygon={tabEditPolygon}
            setTabEditPolygon={setTabEditPolygon}
            setPreviewVersion={setPreviewVersion}
          />
        </Then>
        <Else>
          <div className="mb-4 flex rounded-lg bg-neutral-100 p-1">
            <Button
              variant={stateViewPanel ? "group-active-polygon" : "group-polygon"}
              className="!w-2/4 whitespace-nowrap text-blueCustom-600"
              onClick={() => setStateViewPanel(true)}
            >
              {t("Polygon Check")}
            </Button>
            <Button
              variant={stateViewPanel ? "group-polygon" : "group-active-polygon"}
              className="!w-2/4 whitespace-nowrap text-blueCustom-600"
              onClick={() => setStateViewPanel(false)}
            >
              {t("Site Polygons")}
            </Button>
          </div>
          <When condition={!stateViewPanel}>
            <MapSidePanel
              title=""
              items={items}
              emptyText={emptyText}
              onLoadMore={onLoadMore}
              mapFunctions={mapFunctions}
              checkedValues={checkedValues}
              onCheckboxChange={onCheckboxChange}
              setSortOrder={setSortOrder}
              type={type}
              recallEntityData={recallEntityData}
            />
          </When>
          <When condition={!!stateViewPanel}>
            <MapPolygonCheckPanel
              emptyText={emptyText}
              onLoadMore={onLoadMore}
              selected={selected}
              mapFunctions={mapFunctions}
            />
          </When>
        </Else>
      </If>
    </div>
  );
};

export default MapPolygonPanel;
