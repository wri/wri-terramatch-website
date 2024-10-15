import { useT } from "@transifex/react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";

export interface TooltipItemProps {
  id: string;
  title: string;
  value: string;
}

export interface TooltipGridProps {
  label: string;
  learnMore?: boolean;
  isoCountry?: string;
}

const TooltipGridMap = (props: TooltipGridProps) => {
  const { label, learnMore, isoCountry } = props;
  const t = useT();

  const items = [
    {
      id: "1",
      title: "No. of Projects",
      value: "32"
    },
    {
      id: "2",
      title: "Trees Planted",
      value: "2,234"
    },
    {
      id: "3",
      title: "Restoration Hectares",
      value: "832"
    },
    {
      id: "4",
      title: "Jobs Created",
      value: "1,306"
    }
  ];

  return (
    <div className="w-auto rounded bg-white p-2">
      <div className="flex min-w-40 max-w-52 flex-col gap-1">
        <div className="mb-1 flex items-center gap-2">
          <img src={`/flags/${isoCountry?.toLowerCase()}.svg`} alt="flag" className="h-4 w-6 object-cover" />
          <Text className="text-start text-darkCustom" variant="text-12-bold">
            {t(label)}
          </Text>
        </div>
        <div>
          {items.map(item => (
            <div className="flex gap-10" key={item.id}>
              <Text className="flex-1 text-start text-darkCustom" variant="text-12-light">
                {t(item.title)}
              </Text>
              <Text className="text-end text-darkCustom" variant="text-12-bold">
                {t(item.value)}
              </Text>
            </div>
          ))}
        </div>

        <When condition={learnMore}>
          <Text className="mt-1 text-start text-primary underline" variant="text-12-bold">
            {t("Learn More")}
          </Text>
        </When>
      </div>
    </div>
  );
};

export default TooltipGridMap;
