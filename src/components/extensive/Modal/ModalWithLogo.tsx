import classNames from "classnames";
import { FC } from "react";
import { When } from "react-if";
import { twMerge } from "tailwind-merge";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";

import Icon, { IconNames } from "../Icon/Icon";
import { ModalBaseProps, ModalProps } from "./Modal";

export const ModalBaseWithLogo: FC<ModalBaseProps> = ({ children, className, ...rest }) => {
  return (
    <div
      {...rest}
      className={twMerge(
        "margin-4 z-50 m-auto flex max-h-full max-w-[800px] flex-col items-center justify-start overflow-y-auto rounded-lg border-2 border-neutral-100 bg-white pb-8",
        className
      )}
    >
      {children}
    </div>
  );
};

export interface ModalWithLogoProps extends ModalProps {
  primaryButtonText?: string;
}

const ModalWithLogo: FC<ModalWithLogoProps> = ({
  iconProps,
  title,
  content,
  primaryButtonProps,
  primaryButtonText,
  secondaryButtonProps,
  children,
  ...rest
}) => {
  return (
    <ModalBaseWithLogo {...rest}>
      <div className="w-full border-b border-b-neutral-200 px-8 py-5">
        <Icon name={IconNames.WRI_LOGO} width={108} height={30} className="min-w-[108px]" />
      </div>
      <div className="px-8 pt-8">
        <When condition={!!iconProps}>
          <Icon
            {...iconProps!}
            width={iconProps?.width || 40}
            className={twMerge("mb-8", iconProps?.className)}
            style={{ minHeight: iconProps?.height || iconProps?.width || 40 }}
          />
        </When>
        <Text variant="text-20-bold">{title}</Text>
        <When condition={!!content}>
          <Text variant="text-12-light" className="mt-2" containHtml>
            {content}
          </Text>
        </When>
        {children}
        <div className={classNames("flex w-full justify-end gap-3")}>
          <When condition={!!secondaryButtonProps}>
            <Button {...secondaryButtonProps!} variant="secondary" />
          </When>
          <Button {...primaryButtonProps}>
            <Text variant="text-14-bold" className="capitalize text-white">
              {primaryButtonText}
            </Text>
          </Button>
        </div>
      </div>
    </ModalBaseWithLogo>
  );
};

export default ModalWithLogo;
