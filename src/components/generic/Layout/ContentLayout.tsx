import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";

const ContentLayout = ({
  className,
  children,
  ...sectionProps
}: PropsWithChildren<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>>) => (
  <div {...sectionProps} className={classNames("mx-auto my-10 w-full max-w-[800px]", className)}>
    {children}
  </div>
);

export default ContentLayout;
