import React, { forwardRef } from "react";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export interface PaperProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    PropsWithChildren {}

const Paper = forwardRef<HTMLDivElement, PaperProps>(({ children, className, ...props }, ref) => (
  <div {...props} ref={ref} className={twMerge("w-full rounded-xl border border-neutral-200 bg-white p-8", className)}>
    {children}
  </div>
));

export default Paper;
