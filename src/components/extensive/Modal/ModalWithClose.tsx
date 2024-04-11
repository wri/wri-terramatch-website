import classNames from "classnames";
import { FC } from "react";
import { When } from "react-if";
import { twMerge } from "tailwind-merge";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";

import Icon, { IconNames } from "../Icon/Icon";
import { ModalBaseProps, ModalProps } from "./Modal";

export const ModalBaseWithClose: FC<ModalBaseProps> = ({ children, className, ...rest }) => {
  return (
    <div
      {...rest}
      className={twMerge(
        "margin-4 z-50 m-auto flex max-h-full max-w-[800px] flex-col items-center justify-start overflow-y-auto rounded-lg border-2 border-neutral-100 bg-white p-8",
        className
      )}
    >
      {children}
    </div>
  );
};

export interface ModalCloseProps extends ModalProps {
  onCLose: () => void;
}

const ModalCloseLogo: FC<ModalCloseProps> = ({
  iconProps,
  title,
  content,
  primaryButtonProps,
  secondaryButtonProps,
  children,
  onCLose,
  ...rest
}) => {
  return (
    <ModalBaseWithClose {...rest}>
      <div className="mb-6 flex w-full items-center justify-between">
        <Text variant="text-24-bold" className="whitespace-nowrap !font-[900]">
          {title}
        </Text>
        <Button variant="transparent-toggle" onClick={onCLose}>
          <Icon name={IconNames.CROSS} width={24} height={24} />
        </Button>
      </div>

      {children}
      <When condition={!!iconProps}>
        <Icon
          {...iconProps!}
          width={iconProps?.width || 40}
          className={twMerge("mb-8", iconProps?.className)}
          style={{ minHeight: iconProps?.height || iconProps?.width || 40 }}
        />
      </When>

      <When condition={!!content}>
        <Text variant="text-light-body-300" className="mt-2 text-center" containHtml>
          {content}
        </Text>
      </When>
      <div
        className={classNames("mt-6 flex w-full gap-3", secondaryButtonProps ? "justify-between" : "justify-center")}
      >
        <When condition={!!secondaryButtonProps}>
          <Button {...secondaryButtonProps!} variant="secondary" />
        </When>
        <Button {...primaryButtonProps} />
      </div>
    </ModalBaseWithClose>
  );
};

export default ModalCloseLogo;
