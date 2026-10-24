import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

import { withFrameworkShow } from "@/context/framework.provider";

export interface PageRowProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    PropsWithChildren {}

const PageRow = ({ children, className, ...props }: PageRowProps) => (
  <div
    {...props}
    className={twMerge(
      "mx-auto flex max-w-[calc(100%-2.1875rem)] flex-wrap gap-8 mobile:m-0 mobile:w-full mobile:max-w-[100%]",
      className
    )}
  >
    {children}
  </div>
);

export default withFrameworkShow(PageRow);
