import classNames from "classnames";
import { FC, HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

const PageContent: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div
    {...props}
    className={twMerge(classNames("flex h-full w-full flex-col gap-5 bg-theme-neutral-200 py-5 px-6"), className)}
  />
);

export default PageContent;
