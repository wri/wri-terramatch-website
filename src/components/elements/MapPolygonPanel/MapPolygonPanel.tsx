import { useT } from "@transifex/react";
import classNames from "classnames";
import { DetailedHTMLProps, Dispatch, HTMLAttributes, SetStateAction, useState } from "react";
import { Else, If, Then, When } from "react-if";

import { MapPolygonPanelItemProps } from "@/components/elements/MapPolygonPanel/MapPolygonPanelItem";

import Button from "../Button/Button";
import MapEditPolygonPanel from "./MapEditPolygonPanel";
import MapPlygonCheckPanel from "./MapPolygonCkeckPanel";
import MapPlygonSitePanel from "./MapPolygonSitePanel";

export interface MapPolygonPanelProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title: string;
  items: MapPolygonPanelItemProps[];
  onSelectItem: (item: MapPolygonPanelItemProps) => void;
  onSearch: (query: string) => void;
  onLoadMore: () => void;
  emptyText?: string;
  setStateViewPanel: Dispatch<SetStateAction<boolean>>;
  stateViewPanel: boolean;
  setEditPolygon: Dispatch<SetStateAction<boolean>>;
  editPolygon: boolean;
  tabEditPolygon: string;
  setTabEditPolygon: Dispatch<SetStateAction<string>>;
  setPreviewVersion: Dispatch<SetStateAction<boolean>>;
}

const MapPolygonPanel = ({
  title,
  items,
  className,
  onSelectItem,
  onSearch,
  onLoadMore,
  emptyText,
  setStateViewPanel,
  stateViewPanel,
  setEditPolygon,
  editPolygon,
  tabEditPolygon,
  setTabEditPolygon,
  setPreviewVersion,
  ...props
}: MapPolygonPanelProps) => {
  const t = useT();
  const [selected, setSelected] = useState<MapPolygonPanelItemProps>();

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
            <MapPlygonSitePanel
              emptyText={emptyText}
              onLoadMore={onLoadMore}
              onSelectItem={onSelectItem}
              setEditPolygon={setEditPolygon}
              selected={selected}
              setSelected={setSelected}
            />
          </When>
          <When condition={!!stateViewPanel}>
            <MapPlygonCheckPanel
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
