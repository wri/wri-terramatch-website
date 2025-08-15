import { useT } from "@transifex/react";
import { Fragment, useEffect, useRef, useState } from "react";

import { parseValidationDataV3 } from "@/components/elements/Map-mapbox/utils";
import List from "@/components/extensive/List/List";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import { useGetV2TerrafundValidationSite } from "@/generated/apiComponents";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

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
  nonValidCriteria: Array<{ criteria_id: number }>;
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

const MapPolygonCheckPanel = ({ emptyText, onLoadMore, selected, mapFunctions }: MapPolygonCheckPanelProps) => {
  const t = useT();

  const refContainer = useRef<HTMLDivElement>(null);

  const { siteData } = useMapAreaContext();
  const context = useSitePolygonData();
  const [polygonsValidationData, setPolygonsValidationData] = useState<any[]>([]);

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
      const sitePolygonData = context?.sitePolygonData as SitePolygonLightDto[] | undefined;
      const data = parseValidationDataV3(sitePolygonData, currentValidationSite, validationLabels);
      setPolygonsValidationData(data);
    }
  }, [context?.sitePolygonData, currentValidationSite]);

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
    </>
  );
};

export default MapPolygonCheckPanel;
