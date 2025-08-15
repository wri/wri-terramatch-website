import classNames from "classnames";
import { DetailedHTMLProps, Dispatch, HTMLAttributes, SetStateAction } from "react";
import { Else, If, Then } from "react-if";

import { useMapAreaContext } from "@/context/mapArea.provider";
import { SitePolygonsDataResponse } from "@/generated/apiSchemas";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

import MapSidePanel from "../MapSidePanel/MapSidePanel";
import MapEditPolygonPanel from "./MapEditPolygonPanel";

export interface MapPolygonPanelProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title: string;
  items: SitePolygonLightDto[];
  onSelectItem: (item: SitePolygonLightDto) => void;
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
  sortField: string;
  sortDirection: "ASC" | "DESC";
  setSortDirection: React.Dispatch<React.SetStateAction<"ASC" | "DESC">>;
  type: string;
  recallEntityData?: () => void;
  polygonVersionData?: SitePolygonsDataResponse;
  refetchPolygonVersions?: () => void;
  refreshEntity?: () => void;
  polygonsData?: Record<string, string[]>;
  entityUuid?: string;
}

const MapPolygonPanel = ({
  title,
  items = [],
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
  sortField,
  sortDirection,
  setSortDirection,
  type,
  recallEntityData,
  polygonVersionData,
  refetchPolygonVersions,
  refreshEntity,
  polygonsData,
  entityUuid,
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
            sortField={sortField}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            type={type}
            recallEntityData={recallEntityData}
            entityUuid={entityUuid}
          />
        </Else>
      </If>
    </div>
  );
};

export default MapPolygonPanel;
