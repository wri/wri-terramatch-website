import classNames from "classnames";
import { DetailedHTMLProps, Dispatch, HTMLAttributes, SetStateAction } from "react";
import { Else, If, Then } from "react-if";

import { useMapAreaContext } from "@/context/mapArea.provider";
import { SitePolygonsDataResponse } from "@/generated/apiSchemas";

import MapSidePanel from "../MapSidePanel/MapSidePanel";
import MapEditPolygonPanel from "./MapEditPolygonPanel";
import { MapMenuPanelItemProps } from "./MapMenuPanelItem";

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
  mapFunctions: any;
  checkedValues: string[];
  onCheckboxChange: (value: string, checked: boolean) => void;
  setSortOrder: React.Dispatch<React.SetStateAction<string>>;
  type: string;
  recallEntityData?: () => void;
  polygonVersionData?: SitePolygonsDataResponse;
  refetchPolygonVersions?: () => void;
  refreshEntity?: () => void;
  polygonsData?: Record<string, string[]>;
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
  mapFunctions,
  checkedValues,
  onCheckboxChange,
  setSortOrder,
  type,
  recallEntityData,
  polygonVersionData,
  refetchPolygonVersions,
  refreshEntity,
  polygonsData,
  ...props
}: MapPolygonPanelProps) => {
  const { editPolygon } = useMapAreaContext();

  return (
    <div {...props} className={classNames(className)}>
      <div className="absolute top-0 left-0 -z-10 h-full w-full backdrop-blur-md" />

      <If condition={!!editPolygon.isOpen}>
        <Then>
          <MapEditPolygonPanel
            tabEditPolygon={tabEditPolygon}
            setTabEditPolygon={setTabEditPolygon}
            polygonVersionData={polygonVersionData}
            refetchPolygonVersions={refetchPolygonVersions}
            refreshEntity={refreshEntity}
            mapFunctions={mapFunctions}
            polygonData={polygonsData}
            recallEntityData={recallEntityData}
          />
        </Then>
        <Else>
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
        </Else>
      </If>
    </div>
  );
};

export default MapPolygonPanel;
