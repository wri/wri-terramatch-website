import { When } from "react-if";

import Text from "@/components/elements/Text/Text";

const ShareSection = ({ label, value }: { label: string; value?: string | string[] }) => {
  return (
    <div>
      <Text variant="text-16-bold" className="uppercase text-darkCustom">
        {label}
      </Text>
      <When condition={value && Array.isArray(value)}>
        {value &&
          Array.isArray(value) &&
          value?.map((item, index) => (
            <Text variant="text-16-bold" className="text-nowrap uppercase text-primary" key={index}>
              {item}
            </Text>
          ))}
      </When>
      <When condition={value && !Array.isArray(value)}>
        <Text variant="text-16-bold" className="text-nowrap uppercase text-primary">
          {value}
        </Text>
      </When>
    </div>
  );
};

export default ShareSection;
