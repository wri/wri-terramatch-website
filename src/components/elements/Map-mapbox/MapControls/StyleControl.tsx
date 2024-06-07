import { useT } from "@transifex/react";
import classNames from "classnames";
import { useState } from "react";

import ControlButtonsGroup from "@/components/elements/Map-mapbox/components/ControlButtonsGroup";
import ControlDivider from "@/components/elements/Map-mapbox/components/ControlDivider";
import { MapStyle } from "@/components/elements/Map-mapbox/MapControls/types";
import { useMapContext } from "@/context/map.provider";

export const StyleControl = () => {
  const t = useT();
  const { map } = useMapContext();
  const [currentStyle, setCurrentStyle] = useState(MapStyle.Satellite);

  return (
    <ControlButtonsGroup direction="row">
      <button
        onClick={() => {
          map?.setStyle(MapStyle.Street);
          setCurrentStyle(MapStyle.Street);
        }}
        className={classNames(
          "w-16 rounded-l-lg px-1",
          currentStyle === MapStyle.Street ? "text-body-500 underline" : "text-body-400"
        )}
        aria-label="Map street style"
      >
        {t("Map")}
      </button>
      <ControlDivider direction="vertical" />
      <button
        onClick={() => {
          map?.setStyle(MapStyle.Satellite);
          setCurrentStyle(MapStyle.Satellite);
        }}
        className={classNames(
          "w-16 rounded-r-lg px-1",
          currentStyle === MapStyle.Satellite ? "text-body-500 underline" : "text-body-400"
        )}
        aria-label="Map satellite style"
      >
        {t("Satellite")}
      </button>
    </ControlButtonsGroup>
  );
};
