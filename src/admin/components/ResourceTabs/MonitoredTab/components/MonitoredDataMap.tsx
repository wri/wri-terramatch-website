import { useEffect, useState } from "react";
import { When } from "react-if";

import { useMap } from "@/components/elements/Map-mapbox/hooks/useMap";
import MapContainer from "@/components/elements/Map-mapbox/Map";
import { getPolygonsData, parsePolygonData } from "@/components/elements/Map-mapbox/utils";
import LoadingContainerOpacity from "@/components/generic/Loading/LoadingContainerOpacity";
import { useBoundingBox } from "@/connections/BoundingBox";
import { SupportedEntity, useMedias } from "@/connections/EntityAssociation";
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
  const mapFunctions = useMap();
  const [polygonsData, setPolygonsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const entityBbox = useBoundingBox(entityName === "sites" ? { siteUuid: entityUuid } : { projectUuid: entityUuid });

  const [, { data: modelFilesData }] = useMedias({
    entity: entityName as SupportedEntity,
    uuid: entityUuid
  });

  useEffect(() => {
    setLoading(true);
    getPolygonsData(entityUuid, "approved", "created_at", entityName, (data: any) => {
      const parsedData = parsePolygonData(data.polygonsData);
      setPolygonsData(parsedData);
      setLoading(false);
    });
  }, [entityName, entityUuid]);

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
          sitePolygonData={[]}
          hasControls={!selected.includes("6")}
          showLegend={!selected.includes("6")}
          legendPosition="bottom-right"
          showViewGallery={false}
          polygonsData={polygonsData}
          bbox={entityBbox}
          setLoader={setLoading}
          modelFilesData={modelFilesData}
          showPopups={true}
          tooltipType="view"
          entityData={transformedEntityData}
        />
      </LoadingContainerOpacity>
      <When condition={selected.includes("6")}>
        <NoDataMap />
      </When>
    </div>
  );
};

export default MonitoredDataMap;
