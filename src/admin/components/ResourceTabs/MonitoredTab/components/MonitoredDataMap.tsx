import { useEffect, useState } from "react";

import { useBaseMap } from "@/components/elements/Map-mapbox/hooks/useBaseMap";
import MapContainer from "@/components/elements/Map-mapbox/Map";
import { parsePolygonDataV3 } from "@/components/elements/Map-mapbox/utils";
import LoadingContainerOpacity from "@/components/generic/Loading/LoadingContainerOpacity";
import { useBoundingBox } from "@/connections/BoundingBox";
import { SupportedEntity, useMedias } from "@/connections/EntityAssociation";
import { useSitePolygonMapIndex } from "@/connections/SitePolygons";
import { OptionValue } from "@/types/common";

import NoDataMap from "./NoDataMap";

type MonitoredEntityRecord = {
  name?: string;
  projectName?: string;
};

const MonitoredDataMap = ({
  selected,
  entityName,
  entityUuid,
  record
}: {
  selected: OptionValue[];
  entityName: string;
  entityUuid: string;
  record?: MonitoredEntityRecord;
}) => {
  const mapFunctions = useBaseMap();
  const [polygonsData, setPolygonsData] = useState<Record<string, string[]> | undefined>(undefined);
  const [isTileLoading, setIsTileLoading] = useState(false);

  const entityBbox = useBoundingBox(entityName === "sites" ? { siteUuid: entityUuid } : { projectUuid: entityUuid });

  const [mapIndexLoaded, { data: mapIndex }] = useSitePolygonMapIndex({
    entityName: entityName as "sites" | "projects",
    entityUuid,
    enabled: entityName != null && entityName !== "" && entityUuid != null && entityUuid !== "",
    filter: {
      "polygonStatus[]": ["approved"]
    }
  });
  const sitePolygons = mapIndex?.polygons;

  const [, { data: mediaFiles }] = useMedias({
    entity: entityName as SupportedEntity,
    uuid: entityUuid
  });

  useEffect(() => {
    if (sitePolygons == null) {
      setPolygonsData(undefined);
      return;
    }

    const parsedData = parsePolygonDataV3(sitePolygons);
    setPolygonsData(parsedData);
  }, [entityName, entityUuid, sitePolygons]);

  // Transform record to the structure expected by ModalImageDetails
  const transformedEntityData = record
    ? {
        name: record.name,
        project: record.projectName ? { name: record.projectName } : undefined
      }
    : undefined;

  return (
    <div className="relative h-[calc(100vh-295px)] w-full">
      <LoadingContainerOpacity loading={!mapIndexLoaded || isTileLoading}>
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
          setLoader={setIsTileLoading}
          mediaFiles={mediaFiles}
          alwaysShowPhotosOnMap
          showPopups={true}
          tooltipType="view"
          entityData={transformedEntityData}
        />
      </LoadingContainerOpacity>
      {selected.includes("6") && <NoDataMap />}
    </div>
  );
};

export default MonitoredDataMap;
