import { useT } from "@transifex/react";

import Text from "@/components/elements/Text/Text";

import { DashboardTableDataProps } from "../index.page";

const GraphicDashboard = ({ data, maxValue }: { data: DashboardTableDataProps[]; maxValue: number }) => {
  const t = useT();

  return (
    <div className="w-full rounded-lg border border-grey-350 p-4">
      {data.map((item, index) => {
        const widthBar = (item.value * 100) / maxValue;

        return (
          <div key={index} className={`${index + 1 !== data.length && "border-b"} border-grey-350 py-2`}>
            <div className="relative h-4 rounded bg-blueCustom lg:h-5" style={{ width: `${widthBar}%` }}>
              <Text variant="text-14" className="absolute bottom-0 left-[102%] leading-[normal] text-darkCustom">
                {t(item.valueText)}
              </Text>
            </div>

            <Text variant="text-14-light" className="mt-1 text-darkCustom">
              {t(item.label)}
            </Text>
          </div>
        );
      })}

      <Text variant="text-14" className="mt-1 text-primary underline">
        {t("VIEW ALL PROJECTS ")}
      </Text>
    </div>
  );
};

export default GraphicDashboard;
