import { MapboxGeoJSONFeature, MapLayerMouseEvent } from "mapbox-gl";
import { useEffect, useRef } from "react";

import { useMapContext } from "@/context/map.provider";

export const useOnHoverFeature = (
  layer: string | string[] = ["gl-draw-polygon-fill-static.cold", "gl-draw-polygon-fill-static-default.cold"]
) => {
  const { map, draw } = useMapContext();
  const hoveredFeature = useRef<MapboxGeoJSONFeature>();

  useEffect(() => {
    if (!map) return;
    const onMouseEnter = (e: MapLayerMouseEvent) => {
      const map = e.target;
      const features = map?.queryRenderedFeatures(e.point);
      const feature = features?.[0];
      if (!feature || !map) return;

      hoveredFeature.current = feature;
      map.setFeatureState(feature, { hover: true });
    };
    map.on("mouseenter", layer, onMouseEnter);

    const onMouseLeave = (_e: MapLayerMouseEvent) => {
      if (hoveredFeature.current) {
        map.setFeatureState(hoveredFeature.current, { hover: false });
        hoveredFeature.current = undefined;
      }
    };
    map.on("mouseleave", layer, onMouseLeave);

    return () => {
      map.off("mouseenter", onMouseEnter);
      map.off("mouseleave", onMouseLeave);
    };
  }, [draw, map, layer]);
};
