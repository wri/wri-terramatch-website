import { useEffect, useMemo, useState } from "react";

import { useBaseMap } from "@/components/elements/Map-mapbox/hooks/useBaseMap";
import MapContainer from "@/components/elements/Map-mapbox/Map";
import type { PolygonEntityScope } from "@/components/elements/Map-mapbox/Map.d";
import { parsePolygonDataV3 } from "@/components/elements/Map-mapbox/utils";
import LoadingContainerOpacity from "@/components/generic/Loading/LoadingContainerOpacity";
import { useBoundingBox } from "@/connections/BoundingBox";
import { SupportedEntity, useMedias } from "@/connections/EntityAssociation";
import { useSitePolygonMapIndex } from "@/connections/SitePolygons";
import { OptionValue } from "@/types/common";

import NoDataMap from "./NoDataMap";

const MonitoredDataMap = ({
  selected,
  entityName,
  entityUuid,
  record
}: {
  selected: OptionValue[];
  entityName: string;
  entityUuid: string;
  record?: any;
}) => {
  const mapFunctions = useBaseMap();
  const [polygonsData, setPolygonsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const entityBbox = useBoundingBox(entityName === "sites" ? { siteUuid: entityUuid } : { projectUuid: entityUuid });

  const [mapIndexLoaded, { data: mapIndex }] = useSitePolygonMapIndex({
    entityName: entityName as "sites" | "projects",
    entityUuid,
    enabled: !!entityName && !!entityUuid,
    filter: {
      "polygonStatus[]": ["approved"]
    }
  });
  const sitePolygons = mapIndex?.polygons;

  const polygonEntityScope = useMemo<PolygonEntityScope | undefined>(
    () =>
      (entityName === "sites" || entityName === "projects") && entityUuid !== ""
        ? { entityName, entityUuid }
        : undefined,
    [entityName, entityUuid]
  );

  const [, { data: mediaFiles }] = useMedias({
    entity: entityName as SupportedEntity,
    uuid: entityUuid
  });

  useEffect(() => {
    if (!sitePolygons) {
      setPolygonsData(null);
      return;
    }

    const parsedData = parsePolygonDataV3(sitePolygons);
    setPolygonsData(parsedData);
  }, [entityName, entityUuid, sitePolygons]);

  useEffect(() => {
    setLoading(!mapIndexLoaded);
  }, [mapIndexLoaded]);

  // Transform record to the structure expected by ModalImageDetails
  const transformedEntityData = record
    ? {
        name: record.name,
        project: record.projectName ? { name: record.projectName } : undefined
      }
    : undefined;

  return (
    <div className="relative h-[calc(100vh-295px)] w-full">
      <LoadingContainerOpacity loading={loading}>
        <MapContainer
          className="!h-full"
          mapFunctions={mapFunctions}
          polygonEntityScope={polygonEntityScope}
          hasControls={!selected.includes("6")}
          showLegend={!selected.includes("6")}
          legendPosition="bottom-right"
          showViewGallery={false}
          polygonsData={polygonsData}
          bbox={entityBbox}
          setLoader={setLoading}
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
