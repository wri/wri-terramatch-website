import { useT } from "@transifex/react";
import { useMemo } from "react";

import { LANDSCAPE_MAPPINGS, LandscapeName } from "@/utils/landscapeUtils";

export const useLandscapeMappings = () => {
  const t = useT();

  return useMemo(
    (): Record<LandscapeName, string> => ({
      "Greater Rift Valley of Kenya": t("Greater Rift Valley of Kenya"),
      "Ghana Cocoa Belt": t("Ghana Cocoa Belt"),
      "Lake Kivu & Rusizi River Basin": t("Lake Kivu & Rusizi River Basin")
    }),
    [t]
  );
};

export const useLandscapeOptions = () => {
  const landscapeMappings = useLandscapeMappings();

  return useMemo(
    () =>
      (Object.keys(LANDSCAPE_MAPPINGS) as LandscapeName[]).map(name => ({
        title: landscapeMappings[name],
        value: name
      })),
    [landscapeMappings]
  );
};
