import { useT } from "@transifex/react";
import { Fragment, useEffect, useRef, useState } from "react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import List from "@/components/extensive/List/List";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import { useGetV2TerrafundValidationSite } from "@/generated/apiComponents";
import { SitePolygonsDataResponse } from "@/generated/apiSchemas";

import Text from "../Text/Text";
import { MapMenuPanelItemProps } from "./MapMenuPanelItem";
import MapPolygonCheckPanelItem from "./MapPolygonCheckPanelItem";

export interface MapPolygonCheckPanelProps {
  emptyText?: string;
  onLoadMore: () => void;
  selected: MapMenuPanelItemProps | undefined;
  mapFunctions: any;
}

interface CheckedPolygon {
  uuid: string;
  valid: boolean;
  checked: boolean;
  nonValidCriteria: Array<object>;
}

const validationLabels: any = {
  3: "Overlapping Polygon",
  4: "Self-Intersection",
  6: "Not Inside Size Limit",
  7: "No Within Country",
  8: "Spikes",
  10: "Polygon Type",
  12: "No Within Total Area Expected",
  14: "No Data Completed"
};

const parseData = (
  sitePolygonData: SitePolygonsDataResponse,
  currentValidationSite: CheckedPolygon[],
  validationLabels: any
) => {
  const validationMap = new Map();
  currentValidationSite.forEach(validation => {
    validationMap.set(validation.uuid, validation);
  });

  return sitePolygonData.map(site => {
    const validation = validationMap.get(site.poly_id);
    const polygonValidation =
      validation?.nonValidCriteria.map((criteria: any) => validationLabels[criteria.criteria_id]) ?? [];
    return {
      uuid: site.poly_id,
      title: site.poly_name ?? "Unnamed Polygon",
      valid: validation ? validation.valid : false,
      isChecked: validation ? validation.checked : false,
      ...(polygonValidation.length > 0 && { polygonValidation })
    };
  });
};

const MapPolygonCheckPanel = ({ emptyText, onLoadMore, selected, mapFunctions }: MapPolygonCheckPanelProps) => {
  const t = useT();

  const refContainer = useRef<HTMLDivElement>(null);

  const { siteData } = useMapAreaContext();
  const context = useSitePolygonData();
  const [polygonsValidationData, setPolygonsValidationData] = useState<any[]>([]);
  const sitePolygonData = context?.sitePolygonData ?? [];

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

  useEffect(() => {
    if (currentValidationSite) {
      const data = parseData(sitePolygonData, currentValidationSite, validationLabels);
      setPolygonsValidationData(data);
    }
  }, [currentValidationSite, sitePolygonData]);

  return (
    <>
      <Text variant="text-14" className="mb-6 text-white">
        {t("Available polygons")}
      </Text>
      <div className="h-[calc(100%-150px)] rounded-bl-lg">
        {polygonsValidationData.length === 0 && (
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
            items={polygonsValidationData}
            itemAs={Fragment}
            render={item => (
              <MapPolygonCheckPanelItem
                uuid={item.uuid}
                title={item.title}
                isSelected={selected?.uuid === item.uuid}
                refContainer={refContainer}
                valid={item.valid}
                polygonValidation={item.polygonValidation}
                mapFunctions={mapFunctions}
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
