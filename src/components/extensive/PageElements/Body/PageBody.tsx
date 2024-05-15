import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export interface PageBodyProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    PropsWithChildren {}

const PageBody = ({ children, className, ...props }: PageBodyProps) => {
  return (
    <div
      {...props}
      className={twMerge(classNames("min-h-[calc(100vh-70px)] w-full space-y-15 bg-neutral-50 pt-10"), className)}
    >
      {children}
    </div>
  );
};

export default PageBody;
