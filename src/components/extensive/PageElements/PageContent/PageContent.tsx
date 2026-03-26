import classNames from "classnames";
import { FC, HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

const PageContent: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div
    {...props}
    className={twMerge(classNames("bg-theme-neutral-200 flex h-full w-full flex-col gap-5 px-6 pt-6 pb-10"), className)}
  />
);

export default PageContent;
