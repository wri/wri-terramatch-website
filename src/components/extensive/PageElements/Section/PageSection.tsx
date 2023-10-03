import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";

export interface PagSectionProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    PropsWithChildren {
  hasCarousel?: boolean;
}

const PageSection = ({ title, children, className, hasCarousel = false, ...props }: PagSectionProps) => {
  return (
    <div {...props} className={classNames("m-auto", hasCarousel ? "max-w-[1440px]" : "max-w-7xl", className)}>
      {children}
    </div>
  );
};

export default PageSection;
