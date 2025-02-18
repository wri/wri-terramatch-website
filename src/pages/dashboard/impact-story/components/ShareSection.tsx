import { useT } from "@transifex/react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";

const ShareSection = ({ label, value }: { label: string; value?: string | string[] }) => {
  const t = useT();

  return (
    <div className="flex flex-col gap-3">
      <Text variant="text-16-bold" className="uppercase text-darkCustom">
        {t(label)}
      </Text>
      <When condition={value && Array.isArray(value)}>
        {value &&
          Array.isArray(value) &&
          value?.map((item, index) => (
            <Text variant="text-16-bold" className="uppercase leading-[normal] text-primary" key={index}>
              {t(item)}
            </Text>
          ))}
      </When>
      <When condition={value && !Array.isArray(value)}>
        <Text variant="text-16-bold" className="uppercase leading-[normal] text-primary">
          {value}
        </Text>
      </When>
    </div>
  );
};

export default ShareSection;
