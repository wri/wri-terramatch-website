import { Map, MapboxGeoJSONFeature, MapMouseEvent } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";

export const useSelectFeature = (
  map?: Map
): [MapboxGeoJSONFeature | undefined, (feature?: MapboxGeoJSONFeature) => void] => {
  const [selectedFeature, _setSelectedFeature] = useState<MapboxGeoJSONFeature>();
  const clickedFeatureRef = useRef<MapboxGeoJSONFeature>();

  const setSelectedFeature = (feature?: MapboxGeoJSONFeature) => {
    clickedFeatureRef.current = feature;
    _setSelectedFeature(feature);
  };

  useEffect(() => {
    if (!map) return;

    function onClickListener(e: MapMouseEvent) {
      const map = e.target;
      const features = map?.queryRenderedFeatures(e.point);
      const feature = features?.[0];

      if (feature && !feature.properties?.image_url) {
        if (clickedFeatureRef.current) {
          map.setFeatureState(clickedFeatureRef.current, { clicked: false });
        }
        setSelectedFeature(feature);
        map.setFeatureState(feature, { clicked: true });
      } else {
        if (clickedFeatureRef.current) {
          map.setFeatureState(clickedFeatureRef.current, { clicked: false });
        }
        setSelectedFeature(undefined);
      }
    }
    map.on("click", onClickListener);

    return () => {
      map.off("click", onClickListener);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  return [selectedFeature, setSelectedFeature];
};
