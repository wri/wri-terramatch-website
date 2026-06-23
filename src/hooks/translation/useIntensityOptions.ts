import { useT } from "@transifex/react";
import { useMemo } from "react";

export const useIntensityOptions = () => {
  const t = useT();

  return useMemo(
    () => [
      { title: t("Low"), value: "low" },
      { title: t("Medium"), value: "medium" },
      { title: t("High"), value: "high" }
    ],
    [t]
  );
};
