import { useT } from "@transifex/react";
import { useMemo } from "react";

export const useDownloadToastMessages = () => {
  const t = useT();

  return useMemo(
    () => ({
      complete: t("Download complete"),
      error: t("Something went wrong!")
    }),
    [t]
  );
};
