import { useT } from "@transifex/react";

import Text from "@/components/elements/Text/Text";

const TooltipGraphicDashboard = () => {
  const t = useT();

  const data = [
    {
      label: "Total",
      value: "555"
    },
    {
      label: "Non-Profit",
      value: "271"
    },
    {
      label: "Enterprise",
      value: "284"
    }
  ];

  return (
    <div className="absolute left-[54%] top-[21%] w-auto rounded border border-darkCustom bg-white p-2">
      <Text variant="text-12-bold" className="text-darkCustom">
        {t("Number of Trees in 2024")}
      </Text>
      {data.map((item, index) => (
        <div key={index} className="mt-1 flex items-center gap-2">
          <Text variant="text-12-light" className="text-darkCustom">
            {t(item.label)}
          </Text>
          <Text variant="text-12-bold" className="text-darkCustom">
            {t(item.value)}
          </Text>
        </div>
      ))}
    </div>
  );
};
export default TooltipGraphicDashboard;
