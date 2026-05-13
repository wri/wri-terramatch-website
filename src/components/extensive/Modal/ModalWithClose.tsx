import classNames from "classnames";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";

import Icon, { IconNames } from "../Icon/Icon";
import { ModalProps } from "./Modal";
import { ModalBaseWithClose } from "./ModalsBases";

type ModalCloseProps = ModalProps & {
  onClose: () => void;
};

const ModalCloseLogo: FC<ModalCloseProps> = ({
  iconProps,
  title,
  content,
  primaryButtonProps,
  secondaryButtonProps,
  children,
  onClose,
  ...rest
}) => (
  <ModalBaseWithClose {...rest}>
    <div className="mb-6 flex w-full items-center justify-between">
      <Text variant="text-24-bold" className="whitespace-nowrap !font-[900]">
        {title}
      </Text>
      <button onClick={onClose} className="ml-2 rounded p-1 hover:bg-grey-800">
        <Icon name={IconNames.CLEAR} width={16} height={16} className="text-darkCustom-100" />
      </button>
    </div>

    {children}
    {iconProps != null && (
      <Icon
        {...iconProps!}
        width={iconProps?.width ?? 40}
        className={twMerge("mb-8", iconProps?.className)}
        style={{ minHeight: iconProps?.height ?? iconProps?.width ?? 40 }}
      />
    )}

    {content != null && (
      <Text variant="text-light-body-300" className="mt-2 text-center" containHtml>
        {content}
      </Text>
    )}
    <div className={classNames("mt-6 flex w-full gap-3", secondaryButtonProps ? "justify-between" : "justify-end")}>
      {secondaryButtonProps != null && <Button {...secondaryButtonProps!} variant="secondary" />}
      <Button {...primaryButtonProps} />
    </div>
  </ModalBaseWithClose>
);

export default ModalCloseLogo;
