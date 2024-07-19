import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import { withFrameworkShow } from "@/context/framework.provider";

export interface ExpandedCardProps
  extends PropsWithChildren,
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  headerChildren?: ReactNode;
}

const ExpandedCard = ({ children, headerChildren, className, ...rest }: ExpandedCardProps) => (
  <div {...rest} className={twMerge("rounded-lg bg-neutral-40", className)}>
    <div className="flex items-center gap-4 px-5 py-4">{headerChildren}</div>
    {children && <div className="border-t border-neutral-100 px-5 py-6">{children}</div>}
  </div>
);

export default withFrameworkShow(ExpandedCard);
