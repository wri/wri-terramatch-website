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
        "m-auto mobile:min-w-[95%]",
        hasCarousel ? "w-[calc( 100% - 32px )]" : hasFull ? "max-w-full" : "max-w-[calc(100%-35px)]",
        className
      )}
      style={hasCarousel ? { width: "calc( 100% - 32px )" } : {}}
    >
      {children}
    </div>
  );
};

export default PageSection;
