import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";

const BackgroundLayout = ({
  className,
  children,
  ...sectionProps
}: PropsWithChildren<DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>>) => (
  <section {...sectionProps} className={classNames("flex min-h-0 w-full flex-1 flex-col bg-neutral-150", className)}>
    {children}
  </section>
);

export default BackgroundLayout;
