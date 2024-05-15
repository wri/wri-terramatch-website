import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";

const BackgroundLayout = ({
  className,
  children,
  ...sectionProps
}: PropsWithChildren<DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>>) => (
  <section {...sectionProps} className={classNames("bg-primary-50 min-h-[calc(100vh-74px)] w-full", className)}>
    {children}
  </section>
);

export default BackgroundLayout;
