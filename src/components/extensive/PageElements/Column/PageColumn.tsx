import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export interface PageColumnProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    PropsWithChildren {}

const PageColumn = ({ children, className, ...props }: PageColumnProps) => {
  return (
    <div {...props} className={twMerge("min-w-[500px] flex-1 space-y-8", className)}>
      {children}
    </div>
  );
};

export default PageColumn;
