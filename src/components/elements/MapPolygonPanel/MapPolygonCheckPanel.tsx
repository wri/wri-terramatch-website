import { useT } from "@transifex/react";
import { Fragment, useEffect, useRef, useState } from "react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import List from "@/components/extensive/List/List";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import { useGetV2TerrafundValidationSite } from "@/generated/apiComponents";
import { SitePolygon } from "@/generated/apiSchemas";
import { PolygonAvailableData } from "@/pages/site/[uuid]/components/MockedData";

import { CheckedPolygon, TransformedData } from "../Map-mapbox/MapControls/CheckPolygonControl";
import Text from "../Text/Text";
import { MapMenuPanelItemProps } from "./MapMenuPanelItem";
import MapPolygonCheckPanelItem from "./MapPolygonCheckPanelItem";

export interface MapPolygonCheckPanelProps {
  emptyText?: string;
  onLoadMore: () => void;
  selected: MapMenuPanelItemProps | undefined;
}

const MapPolygonCheckPanel = ({ emptyText, onLoadMore, selected }: MapPolygonCheckPanelProps) => {
  const t = useT();
  const { siteData } = useMapAreaContext();
  const context = useSitePolygonData();
  const sitePolygonData = context?.sitePolygonData;
  const [sitePolygonCheckData, setSitePolygonCheckData] = useState<TransformedData[]>([]);
  console.log("siteData", sitePolygonData, sitePolygonCheckData);
  // add refetch: reloadSitePolygonValidation to the useGetV2TerrafundValidationSite
  const { data: currentValidationSite } = useGetV2TerrafundValidationSite<CheckedPolygon[]>(
    {
      queryParams: {
        uuid: siteData?.uuid ?? ""
      }
    },
    {
      enabled: !!siteData?.uuid
    }
  );

  const getTransformedData = (currentValidationSite: CheckedPolygon[]) => {
    return currentValidationSite.map((checkedPolygon, index) => {
      const matchingPolygon = Array.isArray(sitePolygonData)
        ? sitePolygonData.find((polygon: SitePolygon) => polygon.poly_id === checkedPolygon.uuid)
        : null;
      return {
        id: index + 1,
        valid: checkedPolygon.valid,
        checked: checkedPolygon.checked,
        label: matchingPolygon?.poly_name ?? null
      };
    });
  };

  useEffect(() => {
    if (currentValidationSite) {
      const transformedData = getTransformedData(currentValidationSite);
      setSitePolygonCheckData(transformedData);
      console.log("transformedData", transformedData);
    }
  }, [currentValidationSite, sitePolygonData]);

  const refContainer = useRef<HTMLDivElement>(null);
  return (
    <>
      <Text variant="text-14" className="mb-6 text-white">
        {t("Available polygons")}
      </Text>
      <div className="h-[calc(100%-150px)] rounded-bl-lg">
        {PolygonAvailableData.length === 0 && (
          <Text variant="text-16-light" className="mt-8 text-white">
            {t(emptyText) ?? t("No result")}
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
                status={item.status}
                polygon={item.polygon}
              />
            )}
          />
        </div>
      </div>
      <button className="text-white hover:text-primary-300">
        <Text variant="text-14-bold" className="mt-6 flex items-center uppercase ">
          <Icon name={IconNames.PLUS_PA} className="h-4 w-4" />
          &nbsp; {t("Add Polygon")}
        </Text>
      </button>
    </>
  );
};

export default MapPolygonCheckPanel;
