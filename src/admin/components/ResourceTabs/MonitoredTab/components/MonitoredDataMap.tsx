import { useEffect, useState } from "react";
import { When } from "react-if";

import { BBox } from "@/components/elements/Map-mapbox/GeoJSON";
import { useMap } from "@/components/elements/Map-mapbox/hooks/useMap";
import MapContainer from "@/components/elements/Map-mapbox/Map";
import { getPolygonsData, parsePolygonData } from "@/components/elements/Map-mapbox/utils";
import LoadingContainerOpacity from "@/components/generic/Loading/LoadingContainerOpacity";
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
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    getPolygonsData(entityUuid, undefined, "created_at", entityName, (data: any) => {
      const parsedData = parsePolygonData(data.polygonsData);
      setPolygonsData(parsedData);
      if (data.bbox) {
        setEntityBbox(data.bbox);
      }
      setLoading(false);
    });
  }, [entityName, entityUuid]);
  return (
    <div className="relative h-[calc(100vh-295px)] w-full">
      <LoadingContainerOpacity loading={loading}>
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
          setLoader={setLoading}
        />
      </LoadingContainerOpacity>
      <When condition={selected.includes("6")}>
        <NoDataMap />
      </When>
    </div>
  );
};

export default MonitoredDataMap;
