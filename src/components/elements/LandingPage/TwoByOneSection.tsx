import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";

const Container = (props: PropsWithChildren<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>) => {
  const { className, ...divProps } = props;
  return <div {...divProps} className={classNames("w-full md:flex md:flex-row-reverse", className)}></div>;
};

const Bottom = (props: PropsWithChildren<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>) => {
  const { className, children, ...divProps } = props;
  return (
    <div {...divProps} className={classNames("flex items-center justify-center md:w-[50%]", className)}>
      <div className="flex flex-col items-start gap-4">{children}</div>
    </div>
  );
};

const Top = (props: PropsWithChildren<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>) => {
  const { className, ...divProps } = props;
  return <div {...divProps} className={classNames("md:w-[50%]", className)} />;
};

const TwoByOneSection = {
  Container,
  Top,
  Bottom
};

export default TwoByOneSection;
