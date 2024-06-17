import { useT } from "@transifex/react";
import classNames from "classnames";
import { DetailedHTMLProps, Dispatch, HTMLAttributes, SetStateAction, useState } from "react";
import { Else, If, Then, When } from "react-if";

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
  setEditPolygon: Dispatch<SetStateAction<boolean>>;
  editPolygon: boolean;
  tabEditPolygon: string;
  setTabEditPolygon: Dispatch<SetStateAction<string>>;
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
  setEditPolygon,
  editPolygon,
  tabEditPolygon,
  setTabEditPolygon,
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
  const [stateViewPanel, setStateViewPanel] = useState(false);
  return (
    <div {...props} className={classNames(className)}>
      <If condition={!!editPolygon}>
        <Then>
          <MapEditPolygonPanel
            setEditPolygon={setEditPolygon}
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
              setEditPolygon={setEditPolygon}
              selected={selected}
            />
          </When>
        </Else>
      </If>
    </div>
  );
};

export default MapPolygonPanel;
