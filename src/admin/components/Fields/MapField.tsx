import { Typography } from "@mui/material";
import { get } from "lodash";
import { useEffect, useState } from "react";
import { useRecordContext } from "react-admin";

import { useMap } from "@/components/elements/Map-mapbox/hooks/useMap";
import { MapContainer } from "@/components/elements/Map-mapbox/Map";
import { useBoundingBox } from "@/connections/BoundingBox";
import { FORM_POLYGONS } from "@/constants/statuses";
import { useGetV2TerrafundProjectPolygon } from "@/generated/apiComponents";

interface MapFieldProps {
  source: string;
  label?: string;
  emptyText?: string;
}

const MapField = ({ source, emptyText = "Not Provided" }: MapFieldProps) => {
  const record = useRecordContext<any>();
  const mapFunctions = useMap();
  const [polygonBbox, setPolygonBbox] = useState<any>(null);
  const [polygonDataMap, setPolygonDataMap] = useState<any>({});

  const { data: projectPolygon } = useGetV2TerrafundProjectPolygon(
    {
      queryParams: {
        entityType: "project-pitch",
        uuid: record?.uuid
      }
    },
    {
      enabled: !!record,
      staleTime: 0,
      cacheTime: 0
    }
  );

  const [, { bbox }] = useBoundingBox({
    projectPitchUuid: record?.uuid
  });

  useEffect(() => {
    const getDataProjectPolygon = async () => {
      if (!projectPolygon?.project_polygon) {
        setPolygonDataMap({ [FORM_POLYGONS]: [] });
      } else {
        setPolygonBbox(bbox);
        setPolygonDataMap({ [FORM_POLYGONS]: [projectPolygon?.project_polygon?.poly_uuid] });
      }
    };
    getDataProjectPolygon();
  }, [projectPolygon, bbox]);

  let projectBoundary: any;
  if (record) {
    const field = get(record, source);

    try {
      projectBoundary = JSON.parse(field);
    } catch (e) {
      projectBoundary = undefined;
    }
  }

  return record && projectBoundary ? (
    <MapContainer
      polygonsData={polygonDataMap}
      bbox={polygonBbox}
      className="h-[240px] flex-1"
      hasControls={false}
      showPopups={false}
      showLegend={false}
      mapFunctions={mapFunctions}
    />
  ) : (
    <Typography component="span" variant="body2">
      {emptyText}
    </Typography>
  );
};

export default MapField;
