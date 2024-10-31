import React from "react";

import Text from "@/components/elements/Text/Text";

interface LeyendItemProps {
  key: string | number;
  backgroundColor: string;
  label: string;
  percentage: string;
}

const LeyendItem = (props: LeyendItemProps) => {
  const { key, backgroundColor, label, percentage } = props;
  return (
    <div className="flex" key={key}>
      <div className="h-[inherit] w-[2px] rounded" style={{ backgroundColor }} />
      <div className="flex-col pl-2">
        <Text variant="text-10-light" className="leading-[normal]">
          {label}
        </Text>
        <Text variant="text-10-light" className="leading-[normal]">
          {percentage}
        </Text>
      </div>
    </div>
  );
};

export default LeyendItem;
