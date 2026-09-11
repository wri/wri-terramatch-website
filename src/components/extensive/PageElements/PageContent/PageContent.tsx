import classNames from "classnames";
import { FC, HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

import { useLayoutShell } from "@/redesignComponents/Loayout/LayoutShell.provider";

const PageContent: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  const { isBulkActionToolbarVisible } = useLayoutShell();

  return (
    <div
      {...props}
      className={twMerge(
        classNames("flex h-full w-full min-w-0 flex-col gap-5 bg-theme-neutral-200 px-6 pt-6 pb-9"),
        isBulkActionToolbarVisible && "pb-[5.75rem]",
        className
      )}
    />
  );
};

export default PageContent;
