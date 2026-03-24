import { useT } from "@transifex/react";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

export type AnrPlotMapPopupProps = {
  plotId?: number;
  areaM2?: number;
  select?: string | null;
  onClose: () => void;
};

export const AnrPlotMapPopup = ({ plotId, areaM2, select, onClose }: AnrPlotMapPopupProps) => {
  const t = useT();

  return (
    <div className="shadow-md border-gray-500 relative w-[240px] rounded border-t-[5px] bg-white px-3 pb-3 pt-2">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-1 top-1 rounded p-1 hover:bg-grey-800"
        aria-label={t("Close")}
      >
        <Icon name={IconNames.CLEAR} className="h-3 w-3 text-darkCustom-100" />
      </button>
      <Text variant="text-12-bold" className="mb-2 pr-6 text-darkCustom">
        {t("ANR monitoring plot")}
      </Text>
      <div className="flex flex-col gap-1.5 text-darkCustom">
        <div className="flex justify-between gap-2">
          <Text variant="text-12-light">{t("Plot ID")}</Text>
          <Text variant="text-12">{plotId != null ? String(plotId) : "—"}</Text>
        </div>
        <div className="flex justify-between gap-2">
          <Text variant="text-12-light">{t("Area (m²)")}</Text>
          <Text variant="text-12">{areaM2 != null ? String(areaM2) : "—"}</Text>
        </div>
        <div className="flex justify-between gap-2">
          <Text variant="text-12-light">{t("Selected")}</Text>
          <Text variant="text-12">{select != null && select !== "" ? select : "—"}</Text>
        </div>
      </div>
    </div>
  );
};
