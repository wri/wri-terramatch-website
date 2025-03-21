import { useEffect, useState } from "react";
import { When } from "react-if";

import { BBox } from "@/components/elements/Map-mapbox/GeoJSON";
import { useMap } from "@/components/elements/Map-mapbox/hooks/useMap";
import MapContainer from "@/components/elements/Map-mapbox/Map";
import { getPolygonsData, parsePolygonData } from "@/components/elements/Map-mapbox/utils";
import { OptionValue } from "@/types/common";

import NoDataMap from "./NoDataMap";

const MonitoredDataMap = ({
  selected,
  entityName,
  entityUuid
}: {
  selected: OptionValue[];
  entityName: string;
  entityUuid: string;
}) => {
  const mapFunctions = useMap();
  const [polygonsData, setPolygonsData] = useState<any>(null);
  const [entityBbox, setEntityBbox] = useState<BBox | any>(null);
  useEffect(() => {
    getPolygonsData(entityUuid, undefined, "created_at", entityName, (data: any) => {
      if (data.bbox) {
        setEntityBbox(data.bbox);
      }
      const parsedData = parsePolygonData(data.polygonsData);
      setPolygonsData(parsedData);
    });
  }, [entityName, entityUuid]);
  return (
    <div className="relative h-[calc(100vh-295px)] w-full">
      <MapContainer
        className="!h-full"
        mapFunctions={mapFunctions}
        sitePolygonData={[]}
        hasControls={!selected.includes("6")}
        showLegend={!selected.includes("6")}
        legendPosition="bottom-right"
        showViewGallery={false}
        polygonsData={polygonsData}
        bbox={entityBbox}
      />
      <When condition={selected.includes("6")}>
        <NoDataMap />
      </When>
    </div>
  );
};

export default MonitoredDataMap;
