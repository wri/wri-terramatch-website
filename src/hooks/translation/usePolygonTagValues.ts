import { useT } from "@transifex/react";
import { useMemo } from "react";

import { MappedTagState } from "@/redesignComponents/actions/Tags/MappedTag/MappedTag";

export const usePolygonTagValues = () => {
  const t = useT();

  return useMemo(
    (): Record<MappedTagState, string> => ({
      draft: t("Draft"),
      "pending-approval": t("Pending Approval"),
      "information-required": t("Information Required"),
      approved: t("Approved"),
      deleted: t("Deleted")
    }),
    [t]
  );
};
