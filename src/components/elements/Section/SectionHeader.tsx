import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";
import { When } from "react-if";

import Button, { IButtonProps } from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";

interface SectionHeaderProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    PropsWithChildren {
  title: string;
  ctaProps?: IButtonProps;
}

const SectionHeader = ({ title, ctaProps, className, ...divProps }: SectionHeaderProps) => {
  return (
    <div
      {...divProps}
      className={classNames(className, "flex items-center justify-between border-b border-neutral-400 pt-5 pb-4 pr-6")}
    >
      <Text variant="text-heading-700">{title}</Text>
      <When condition={!!ctaProps}>
        <Button {...ctaProps!} />
      </When>
    </div>
  );
};

export default SectionHeader;
