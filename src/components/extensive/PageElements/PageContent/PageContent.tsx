import classNames from "classnames";
import { FC, HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

import { useLayoutShell } from "@/redesignComponents/Loayout/LayoutShell.provider";

export interface PageContentProps extends HTMLAttributes<HTMLDivElement> {
  heightFull?: boolean;
}

const PageContent: FC<PageContentProps> = ({ className, heightFull = true, ...props }) => {
  const { isBulkActionToolbarVisible } = useLayoutShell();

  return (
    <div
      {...props}
      className={twMerge(
        classNames("bg-theme-neutral-200 flex w-full min-w-0 flex-col gap-5 px-6 pt-6 pb-9"),
        isBulkActionToolbarVisible && "pb-[5.75rem]",
        heightFull && "h-full",
        className
      )}
    />
  );
};

export default PageContent;
