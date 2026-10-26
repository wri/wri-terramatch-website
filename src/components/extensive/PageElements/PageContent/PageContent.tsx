import classNames from "classnames";
import { FC, HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export interface PageContentProps extends HTMLAttributes<HTMLDivElement> {
  heightFull?: boolean;
}

const PageContent: FC<PageContentProps> = ({ className, heightFull = true, ...props }) => (
  <div
    {...props}
    className={twMerge(
      classNames("flex w-full min-w-0 flex-col gap-5 bg-theme-neutral-200 px-6 pt-6 pb-9"),
      heightFull && "h-full",
      className
    )}
  />
);

export default PageContent;
