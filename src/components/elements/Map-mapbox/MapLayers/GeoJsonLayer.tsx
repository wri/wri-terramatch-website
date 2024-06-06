import bbox from "@turf/bbox";
import { LngLatBoundsLike } from "mapbox-gl";
import { useEffect } from "react";

// interface GeoJSONLayerProps {
//   geojson: any;
// }

export const GeoJSONLayer = ({ mapRef, geojson }: { mapRef: any; geojson: any }) => {
  const map = mapRef.current?.map;
  const draw = mapRef.current?.draw;

  useEffect(() => {
    try {
      if (!map || !draw || !geojson) return;
      draw?.set(geojson);
      map.fitBounds(bbox(geojson) as LngLatBoundsLike, { padding: 50, animate: false });
    } catch (e) {
      console.error("invalid geoJSON", e);
    }
  }, [draw, geojson, map]);

  return null;
};
