import { useT } from "@transifex/react";
import classNames from "classnames";

import Button from "@/components/elements/Button/Button";

interface ValidationButtonProps {
  polygonCheck: boolean;
  isLoadingDelayedJob?: boolean;
  onClick: () => void;
}

export const ValidationButton = ({ polygonCheck, isLoadingDelayedJob, onClick }: ValidationButtonProps) => {
  const t = useT();

  return (
    <Button
      variant="text"
      className={classNames(
        "text-10-bold my-2 flex justify-center rounded-lg border border-tertiary-600 bg-tertiary-600 p-2",
        "hover:border-white disabled:cursor-not-allowed disabled:opacity-60",
        polygonCheck ? "w-full" : "!w-52"
      )}
      onClick={onClick}
      disabled={isLoadingDelayedJob}
    >
      {polygonCheck ? t("Check Polygons") : t("Check All Polygons")}
    </Button>
  );
};
