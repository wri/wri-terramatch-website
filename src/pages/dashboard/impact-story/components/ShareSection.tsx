import { FC } from "react";

import Text from "@/components/elements/Text/Text";
import { toArray } from "@/utils/array";

type ShareSectionProps = {
  label: string;
  value?: string | string[];
};

const ShareSection: FC<ShareSectionProps> = ({ label, value }) => (
  <div className="flex flex-col gap-3">
    <Text variant="text-16-bold" className="uppercase text-darkCustom">
      {label}
    </Text>
    {toArray(value).map((item, index) => (
      <Text variant="text-16" className="uppercase leading-[normal] text-primary" key={index}>
        {item}
      </Text>
    ))}
  </div>
);

export default ShareSection;
