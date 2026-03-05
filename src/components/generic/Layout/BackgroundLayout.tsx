import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";

const BackgroundLayout = ({
  className,
  children,
  ...sectionProps
}: PropsWithChildren<DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>>) => (
  <section {...sectionProps} className={classNames("h-[calc(100vh-70px)] w-full bg-neutral-150", className)}>
    {children}
  </section>
);

export default BackgroundLayout;
