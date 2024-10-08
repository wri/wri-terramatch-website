import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

import Breadcrumbs from "@/components/elements/Breadcrumbs/Breadcrumbs";
import { History, useRouteHistoryContext } from "@/context/routeHistory.provider";
import { TextVariants } from "@/types/common";

export interface PageHeaderProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    PropsWithChildren {
  links?: (Omit<History, "path"> & { path?: string })[];
  clasNameText?: string;
  textVariant?: TextVariants;
}

const PageBreadcrumbs = ({ links, children, className, clasNameText, textVariant, ...props }: PageHeaderProps) => {
  const { history } = useRouteHistoryContext();

  return (
    <div {...props} className={twMerge("flex h-12 items-center bg-primary-100 p-4 px-10 xl:px-0", className)}>
      <Breadcrumbs
        links={links || history}
        className="mx-auto w-full max-w-[82vw]"
        clasNameText={clasNameText}
        textVariant={textVariant}
      />
    </div>
  );
};

export default PageBreadcrumbs;
