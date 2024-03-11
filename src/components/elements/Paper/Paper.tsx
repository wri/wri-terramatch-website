import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export interface PaperProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    PropsWithChildren {}

const Paper = ({ children, className, ...props }: PaperProps) => {
  return (
    <div {...props} className={twMerge("w-full rounded-xl border border-neutral-200 bg-white p-8", className)}>
      {children}
    </div>
  );
};

export default Paper;
