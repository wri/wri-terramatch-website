import { useT } from "@transifex/react";
import { useMemo } from "react";

export const useValidationResultsLabels = () => {
  const t = useT();

  return useMemo(
    (): Record<number, string> => ({
      3: t("No Overlapping Polygon"),
      4: t("No Self-Intersection"),
      5: t("Inside Coordinate System"),
      6: t("Inside Size Limit"),
      7: t("Within Country"),
      8: t("No Spike"),
      10: t("Polygon Type"),
      12: t("Within Total Area Expected"),
      14: t("Data Completed"),
      15: t("Plant Start Date")
    }),
    [t]
  );
};
