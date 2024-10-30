import bbox from "@turf/bbox";
import { LngLatBoundsLike } from "mapbox-gl";
import { useEffect } from "react";

import { useMapContext } from "@/context/map.provider";
import Log from "@/utils/log";

interface GeoJSONLayerProps {
  geojson: any;
}

export const GeoJSONLayer = ({ geojson }: GeoJSONLayerProps) => {
  const { map, draw } = useMapContext();

  useEffect(() => {
    try {
      if (!map || !draw || !geojson) return;

      draw?.set(geojson);
      map.fitBounds(bbox(geojson) as LngLatBoundsLike, { padding: 50, animate: false });
    } catch (e) {
      Log.error("invalid geoJSON", e);
    }
  }, [draw, geojson, map]);

  return null;
};
