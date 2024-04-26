import { useT } from "@transifex/react";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useRefresh } from "react-admin";
import { useLocation } from "react-router-dom";

import ControlButtonsGroup from "@/components/elements/Map-mapbox/components/ControlButtonsGroup";
import ControlDivider from "@/components/elements/Map-mapbox/components/ControlDivider";
import { MapStyle } from "@/components/elements/Map-mapbox/MapControls/types";
import { useMapContext } from "@/context/map.provider";
import { useMapSiteContext } from "@/context/mapSites.provider";

export const StyleControl = () => {
  const t = useT();
  const refresh = useRefresh();
  const location = useLocation();
  const path = location.pathname;
  const { map } = path.includes("show/1") ? useMapSiteContext() : useMapContext();
  const [currentStyle, setCurrentStyle] = useState(MapStyle.Satellite);
  useEffect(() => {
    if (map?.areTilesLoaded()) {
      refresh();
    }
  }, [currentStyle, map]);
  return (
    <ControlButtonsGroup direction="row" className="h-auto">
      <button
        onClick={() => {
          map?.setStyle(MapStyle.Street);
          setCurrentStyle(MapStyle.Street);
          refresh();
        }}
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
        onClick={() => {
          map?.setStyle(MapStyle.Satellite);
          setCurrentStyle(MapStyle.Satellite);
          refresh();
        }}
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
