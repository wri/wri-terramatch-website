import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export interface PageRowProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    PropsWithChildren {}

const PageRow = ({ children, className, ...props }: PageRowProps) => {
  return (
    <div {...props} className={twMerge("mx-auto flex max-w-7xl flex-wrap gap-8", className)}>
      {children}
    </div>
  );
};

export default PageRow;
