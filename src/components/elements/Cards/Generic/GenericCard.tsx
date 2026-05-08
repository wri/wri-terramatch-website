import classNames from "classnames";
import { DetailedHTMLProps, FC, HTMLAttributes, PropsWithChildren } from "react";

import Icon, { IconProps } from "@/components/extensive/Icon/Icon";

import Text, { TextProps } from "../../Text/Text";

type ContainerProps = PropsWithChildren<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>;

const Container: FC<ContainerProps> = ({ children, className, ...rest }) => (
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

type ImageProps = PropsWithChildren<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    imageUrl: string;
  }
>;

const Image: FC<ImageProps> = ({ imageUrl, children, className, ...rest }) => (
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

type ImageFooterProps = PropsWithChildren<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>;

const ImageFooter: FC<ImageFooterProps> = ({ children, className, ...rest }) => (
  <div
    {...rest}
    className={classNames(className, "absolute bottom-0 right-0 left-0 flex gap-2 px-6 py-2", {
      "bg-black": !className?.includes("bg-"),
      "items-center": !className?.includes("items-")
    })}
  >
    {children}
  </div>
);

type BodyProps = PropsWithChildren<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>;

const Body: FC<BodyProps> = ({ children, className, ...rest }) => (
  <div {...rest} className={classNames(className, "flex-1 px-6 py-4")}>
    {children}
  </div>
);

const ActionContainer = ({ children, className, ...rest }: BodyProps) => (
  <div {...rest} className={classNames(className, "px-6 py-4.5")}>
    {children}
  </div>
);

type TitleProps = Omit<TextProps, "variant">;

const Title: FC<TitleProps> = ({ children, className, ...rest }) => (
  <Text {...rest} variant="text-heading-300" className={classNames(className, "mb-3")}>
    {children}
  </Text>
);

type DataRowProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  children: string | number;
  icon?: IconProps;
  divider?: boolean;
};

const DataRow: FC<DataRowProps> = ({ children, className, icon, divider, ...rest }) => (
  <div
    {...rest}
    className={classNames("flex items-start gap-2 border-b border-neutral-500 border-opacity-25 py-3 last:border-none")}
  >
    {icon != null && <Icon {...icon!} className={classNames(icon?.className)} />}
    <Text variant="text-body-400" containHtml className={className}>
      {children}
    </Text>
  </div>
);

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
