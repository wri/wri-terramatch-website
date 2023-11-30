import classNames from "classnames";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";
import { When } from "react-if";
import { twMerge } from "tailwind-merge";

import Button, { IButtonProps } from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";

import Icon, { IconProps } from "../Icon/Icon";

export type ModalBaseProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
export interface ModalProps extends ModalBaseProps {
  title: string;
  iconProps?: IconProps;
  content?: string;
  primaryButtonProps: IButtonProps;
  secondaryButtonProps?: IButtonProps;
}

export const ModalBase: FC<ModalBaseProps> = ({ children, className, ...rest }) => {
  return (
    <div
      {...rest}
      className={twMerge(
        "margin-4 z-50 m-auto flex max-h-full max-w-[800px] flex-col items-center justify-start overflow-y-auto rounded-lg border-2 border-neutral-100 bg-white p-15",
        className
      )}
    >
      {children}
    </div>
  );
};

const Modal: FC<ModalProps> = ({
  iconProps,
  title,
  content,
  primaryButtonProps,
  secondaryButtonProps,
  children,
  ...rest
}) => {
  return (
    <ModalBase {...rest}>
      <When condition={!!iconProps}>
        <Icon
          {...iconProps!}
          width={iconProps?.width || 40}
          className={twMerge("mb-8", iconProps?.className)}
          style={{ minHeight: iconProps?.height || iconProps?.width || 40 }}
        />
      </When>
      <Text variant="text-bold-headline-1000" className="text-center uppercase">
        {title}
      </Text>
      <When condition={!!content}>
        <Text variant="text-light-body-300" className="mt-2 text-center" containHtml>
          {content}
        </Text>
      </When>
      <div
        className={classNames("mt-15 flex w-full gap-3", secondaryButtonProps ? "justify-between" : "justify-center")}
      >
        <When condition={!!secondaryButtonProps}>
          <Button {...secondaryButtonProps!} variant="secondary" />
        </When>
        <Button {...primaryButtonProps} />
      </div>
    </ModalBase>
  );
};

export default Modal;
