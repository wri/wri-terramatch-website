import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";

export interface PagSectionProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    PropsWithChildren {
  hasCarousel?: boolean;
  hasFull?: boolean;
}

const PageSection = ({
  title,
  children,
  className,
  hasCarousel = false,
  hasFull = false,
  ...props
}: PagSectionProps) => {
  return (
    <div
      {...props}
      className={classNames(
        "m-auto",
        hasCarousel ? "w-[calc( 82vw + 158px )]" : hasFull ? "max-w-full" : "max-w-[82vw]",
        className
      )}
      style={hasCarousel ? { width: "calc( 82vw + 158px )" } : {}}
    >
      {children}
    </div>
  );
};

export default PageSection;
