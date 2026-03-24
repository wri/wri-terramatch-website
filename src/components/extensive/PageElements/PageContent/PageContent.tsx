import classNames from "classnames";
import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

const PageContent = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      {...props}
      className={twMerge(classNames("bg-theme-neutral-200 flex h-full w-full flex-col gap-5 py-5 px-6"), className)}
    />
  );
};

export default PageContent;
