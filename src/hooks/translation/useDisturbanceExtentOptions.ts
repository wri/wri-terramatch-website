import { useT } from "@transifex/react";
import { useMemo } from "react";

export const useDisturbanceExtentOption = () => {
  const t = useT();

  return useMemo(
    () => [
      { value: "0-20", title: t("0-20") },
      { value: "21-40", title: t("21-40") },
      { value: "41-60", title: t("41-60") },
      { value: "61-80", title: t("61-80") },
      { value: "81-100", title: t("81-100") }
    ],
    [t]
  );
};
