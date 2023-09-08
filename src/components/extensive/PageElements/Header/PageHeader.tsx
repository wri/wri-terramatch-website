import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";

import BackButton from "@/components/elements/Button/BackButton";
import Text from "@/components/elements/Text/Text";

export interface PageHeaderProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>,
    PropsWithChildren {
  title: string;
}

const PageHeader = ({ title, children, className, ...props }: PageHeaderProps) => {
  return (
    <header
      {...props}
      className={classNames("flex w-full flex-col bg-treesHeaderWithOverlay bg-cover bg-no-repeat", className)}
    >
      <div className="m-auto flex h-full w-full max-w-7xl flex-1 flex-col items-start justify-between gap-10  p-10 text-white xl:px-0">
        <BackButton />
        <div className="flex w-full items-start justify-between gap-8">
          <Text as="h1" variant="text-heading-700" className="flex-1 text-white">
            {title}
          </Text>
          {children}
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
