import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";
import { When } from "react-if";

import Icon, { IconProps } from "@/components/extensive/Icon/Icon";

import Text, { TextProps } from "../../Text/Text";

export interface ContainerProps
  extends PropsWithChildren,
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const Container = ({ children, className, ...rest }: ContainerProps) => {
  return (
    <div
      {...rest}
      className={classNames(
        className,
        "flex w-full flex-col overflow-hidden rounded-lg border border-neutral-500 border-opacity-25 bg-white"
      )}
    >
      {children}
    </div>
  );
};

export interface ImageProps
  extends PropsWithChildren,
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  imageUrl: string;
}

const Image = ({ imageUrl, children, className, ...rest }: ImageProps) => {
  return (
    <div
      {...rest}
      className={classNames(
        className,
        "relative flex aspect-[5/3] min-h-[180px] items-start justify-between bg-cover bg-center bg-no-repeat p-4 wide:p-6"
      )}
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      {children}
    </div>
  );
};

export interface ImageFooterProps
  extends PropsWithChildren,
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const ImageFooter = ({ children, className, ...rest }: ImageFooterProps) => {
  return (
    <div
      {...rest}
      className={classNames(className, "absolute bottom-0 left-0 right-0 flex gap-2 px-6 py-2", {
        "bg-black": !className?.includes("bg-"),
        "items-center": !className?.includes("items-")
      })}
    >
      {children}
    </div>
  );
};

export interface BodyProps
  extends PropsWithChildren,
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const Body = ({ children, className, ...rest }: BodyProps) => {
  return (
    <div {...rest} className={classNames(className, "flex-1 px-6 py-4")}>
      {children}
    </div>
  );
};

export interface ActionContainerProps
  extends PropsWithChildren,
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const ActionContainer = ({ children, className, ...rest }: BodyProps) => {
  return (
    <div {...rest} className={classNames(className, "px-6 py-4.5")}>
      {children}
    </div>
  );
};

export interface TitleProps extends Omit<TextProps, "variant"> {}

const Title = ({ children, className, ...rest }: TitleProps) => {
  return (
    <Text {...rest} variant="text-heading-300" className={classNames(className, "mb-3")}>
      {children}
    </Text>
  );
};

export interface DataRowProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: string | number;
  icon?: IconProps;
  divider?: boolean;
}

const DataRow = ({ children, className, icon, divider, ...rest }: DataRowProps) => {
  return (
    <div
      {...rest}
      className={classNames(
        "flex items-start gap-2 border-b border-neutral-500 border-opacity-25 py-3 last:border-none"
      )}
    >
      <When condition={!!icon}>
        <Icon {...icon!} className={classNames(icon?.className)} />
      </When>
      <Text variant="text-body-400" containHtml className={className}>
        {children}
      </Text>
    </div>
  );
};

const Card = {
  Container,
  Body,
  ActionContainer,
  Image,
  ImageFooter,
  Title,
  DataRow
};

export default Card;
