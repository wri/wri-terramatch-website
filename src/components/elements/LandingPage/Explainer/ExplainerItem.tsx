import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes } from "react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import Text from "../../Text/Text";

export interface ExplainerItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  title: string;
  description: string;
  iconName: IconNames;
}

export const ExplainerItem = (props: ExplainerItemProps) => {
  const { className, title, description, iconName, ...rest } = props;
  return (
    <div {...rest} className={classNames("flex flex-col items-center", className)}>
      <Icon name={iconName} className="fill-success" width={110} />
      <Text variant="text-heading-200" className="mb-[10px] mt-6 md:mb-5">
        {title}
      </Text>
      <Text variant="text-heading-100" className="max-w-[250px] text-center">
        {description}
      </Text>
    </div>
  );
};
