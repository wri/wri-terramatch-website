import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC, useMemo, useState } from "react";

import Button from "@/components/elements/Button/Button";
import { useChampionsMap } from "@/components/elements/Map-mapbox/championsMap.context";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import LegendPanel from "@/redesignComponents/containers/Panel/LegendPanel/LegendPanel";

const CHAMPIONS_LEGEND_SPECS = [
  { text: "Draft", color: "neutralActive.3" },
  { text: "Pending Approval", color: "neutralActive.1" },
  { text: "Information Required", color: "attention.1" },
  { text: "Approved", color: "positive.1" }
] as const;

const FilterControl: FC = () => {
  const championsMap = useChampionsMap();
  const [showFilters, setShowFilters] = useState(false);
  const t = useT();

  const buttons = [
    { color: "pinkCustom", text: "Draft" },
    { color: "blue", text: "Submitted" },
    { color: "tertiary-600", text: "Needs More Info" },
    { color: "green", text: "Approved" }
  ];

  const legendPanelItems = useMemo(
    () =>
      CHAMPIONS_LEGEND_SPECS.map(legendItem => ({
        attribute: t(legendItem.text),
        color: legendItem.color,
        indicatorType: "raster" as const,
        show: false
      })),
    [t]
  );

  return (
    <div className="">
      {championsMap ? (
        <LegendPanel legendItems={legendPanelItems} title="Legend" />
      ) : (
        <>
          {showFilters ? (
            <div className="relative">
              <div className="absolute bottom-1 w-max rounded-lg bg-white p-2 shadow">
                {buttons.map((button, index) => (
                  <Button
                    key={index}
                    variant="text"
                    className="text-12-bold text-nowrap h-fit w-full !justify-start rounded-lg bg-white p-2"
                    onClick={() => {}}
                  >
                    <div className="text-12-semibold flex items-center">
                      <div className={`mr-2 h-3 w-3 rounded-sm bg-${button.color} lg:h-4 lg:w-4 wide:h-5 wide:w-5`} />
                      {t(button.text)}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          ) : null}
          <Button
            variant="text"
            className="text-12-bold h-fit rounded border border-neutral-175 bg-white p-2 shadow"
            onClick={() => setShowFilters(!showFilters)}
          >
            <div className="text-12-bold flex items-center gap-2">
              {t("Polygon Status")}
              <Icon
                name={IconNames.CHEVRON_DOWN}
                className={classNames("fill-neutral-900 transition", showFilters ? "rotate-180" : undefined)}
                width={16}
              />
            </div>
          </Button>
        </>
      )}
    </div>
  );
};

export default FilterControl;
