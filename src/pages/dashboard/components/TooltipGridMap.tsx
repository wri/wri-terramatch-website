import { useT } from "@transifex/react";

import Text from "@/components/elements/Text/Text";

export interface TooltipItemProps {
  id: string;
  title: string;
  value: string;
}

export interface TooltipGridProps {
  label: string;
  learnMore?: any;
  isoCountry?: string;
  items?: TooltipItemProps[];
}
type Item = {
  id: string;
  title: string;
  value: string;
};

const TooltipGridMap = (props: TooltipGridProps) => {
  const { label, learnMore, isoCountry, items } = props;
  const t = useT();
  return (
    <div className="w-auto min-w-[17vw] max-w-[20vw] rounded bg-white p-2 lg:min-w-[17vw] lg:max-w-[15vw]">
      <div className="min-w-40 flex flex-col gap-1">
        <div className="mb-1 flex items-center gap-2">
          {isoCountry && (
            <img
              src={`/flags/${isoCountry?.toLowerCase()}.svg`}
              alt="flag"
              className="h-4 w-6 min-w-[24px] object-cover"
            />
          )}
          <Text className="text-start text-darkCustom" variant="text-12-bold">
            {t(label)}
          </Text>
        </div>
        <div>
          {items &&
            items.map((item: Item) => (
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
        {learnMore && (
          <button>
            <Text onClick={() => learnMore()} className="mt-1 text-start text-primary underline" variant="text-12-bold">
              {t("Learn More")}
            </Text>
          </button>
        )}
      </div>
    </div>
  );
};

export default TooltipGridMap;
