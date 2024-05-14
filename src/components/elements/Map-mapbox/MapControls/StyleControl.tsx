import { useT } from "@transifex/react";
import classNames from "classnames";
import { useState } from "react";

import ControlButtonsGroup from "@/components/elements/Map-mapbox/components/ControlButtonsGroup";
import ControlDivider from "@/components/elements/Map-mapbox/components/ControlDivider";
import { MapStyle } from "@/components/elements/Map-mapbox/MapControls/types";

export const StyleControl = ({ mapRef }: { mapRef: any }) => {
  const map = mapRef.current?.map;
  const t = useT();
  const [currentStyle, setCurrentStyle] = useState(MapStyle.Satellite);

  const setMapStyle = (style: MapStyle) => {
    if (map && currentStyle !== style) {
      map.setStyle(style);
      setCurrentStyle(style);
    }
  };

  return (
    <ControlButtonsGroup direction="row" className="h-auto">
      <button
        onClick={() => setMapStyle(MapStyle.Street)}
        className={classNames(
          "h-fit w-21 rounded-l-lg py-2",
          currentStyle === MapStyle.Street ? "text-body-500" : "text-body-400"
        )}
        aria-label="Map street style"
      >
        {t("Map")}
      </button>
      <ControlDivider direction="vertical" className="m-0 h-auto bg-neutral-200" />
      <button
        onClick={() => setMapStyle(MapStyle.Satellite)}
        className={classNames(
          "h-fit w-21 rounded-r-lg py-2",
          currentStyle === MapStyle.Satellite ? "text-body-500" : "text-body-400"
        )}
        aria-label="Map satellite style"
      >
        {t("Satellite")}
      </button>
    </ControlButtonsGroup>
  );
};
