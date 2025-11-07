import { useT } from "@transifex/react";

import Button from "@/components/elements/Button/Button";
import { getFixabilitySummaryMessage } from "@/utils/polygonFixValidation";

interface FixPolygonButtonProps {
  isLoadingDelayedJob?: boolean;
  canFixAny: boolean;
  fixableCount: number;
  totalCount: number;
  onClick: () => void;
}

export const FixPolygonButton = ({
  isLoadingDelayedJob,
  canFixAny,
  fixableCount,
  totalCount,
  onClick
}: FixPolygonButtonProps) => {
  const t = useT();

  return (
    <Button
      variant="text"
      className="text-10-bold my-2 flex w-full justify-center rounded-lg border border-white bg-white p-2 text-darkCustom-100 hover:border-primary
       disabled:cursor-not-allowed disabled:opacity-60"
      onClick={onClick}
      disabled={isLoadingDelayedJob}
      title={
        canFixAny
          ? getFixabilitySummaryMessage(fixableCount, totalCount, t)
          : t("No polygons can be fixed. Overlaps exceed the fixable limits (≤3.5% and ≤0.1 ha).")
      }
    >
      {t("Fix Polygons")}
    </Button>
  );
};
