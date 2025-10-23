import { useT } from "@transifex/react";
import classNames from "classnames";
import { useState } from "react";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

interface PolygonChecksPanelProps {
  hasOverlaps: boolean;
  canFixAny: boolean;
  fixableCount: number;
  totalCount: number;
  getFixabilityMessage: (t: (key: string) => string) => string;
}

export const PolygonChecksPanel = ({
  hasOverlaps,
  canFixAny,
  fixableCount,
  totalCount,
  getFixabilityMessage
}: PolygonChecksPanelProps) => {
  const t = useT();
  const [openCollapse, setOpenCollapse] = useState(false);

  return (
    <div className="relative flex max-h-[300px] w-[231px] flex-col gap-2 rounded-xl p-3">
      <div className="absolute left-0 top-0 -z-10 h-full w-full rounded-xl bg-[#FFFFFF33] backdrop-blur-md" />
      <button onClick={() => setOpenCollapse(!openCollapse)} className="flex items-center justify-between">
        <Text variant="text-10-bold" className="text-white">
          {t("Polygon Checks")}
        </Text>
        <Icon
          name={IconNames.CHEVRON_DOWN}
          className={classNames(
            "h-4 w-4 text-white duration-300",
            openCollapse ? "rotate-180 transform" : "rotate-0 transform"
          )}
        />
      </button>
      {openCollapse && (
        <div className="flex min-h-0 grow flex-col gap-2 overflow-auto">
          <Text variant="text-10-light" className="text-white">
            {getFixabilityMessage(t)}
          </Text>
          {hasOverlaps && totalCount > 0 && (
            <div className="rounded bg-white bg-opacity-10 p-2">
              <Text variant="text-8-light" className="text-white">
                {t("Fixable criteria: ≤3.5% overlap AND ≤0.1 ha area")}
              </Text>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
