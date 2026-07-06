import { useT } from "@transifex/react";
import { useMemo } from "react";

import GoogleViewIcon from "@/redesignComponents/foundations/Icons/Function/GoogleViewIcon";
import MapViewIcon from "@/redesignComponents/foundations/Icons/Function/MapViewIcon";
import SatelliteViewIcon from "@/redesignComponents/foundations/Icons/Function/SatelliteViewIcon";

export const useMapTypesOptions = () => {
  const t = useT();
  return useMemo(
    () => [
      {
        icon: <SatelliteViewIcon boxSize={4} />,
        label: t("Satellite"),
        value: "satellite"
      },
      {
        icon: <GoogleViewIcon boxSize={4} />,
        label: t("Google"),
        value: "google-satellite"
      },
      {
        icon: <MapViewIcon boxSize={4} />,
        label: t("Map"),
        value: "street"
      }
    ],
    [t]
  );
};
