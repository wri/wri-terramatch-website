import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";

import BackButton from "@/components/elements/Button/BackButton";
import Text from "@/components/elements/Text/Text";

export interface PageHeaderProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>,
    PropsWithChildren {
  title: string;
  subtitles?: string[];
  hasBackButton?: boolean;
}

const PageHeader = ({
  title,
  subtitles = [],
  children,
  className,
  hasBackButton = true,
  ...props
}: PageHeaderProps) => {
  return (
    <header
      {...props}
      className={classNames("flex w-full flex-col bg-treesHeaderWithOverlay bg-cover bg-no-repeat", className)}
    >
      <div className="m-auto flex h-full w-full max-w-[82vw] flex-1 flex-col items-start justify-between gap-10 p-10 text-white xl:px-0 mobile:w-full mobile:min-w-full mobile:p-3">
        {hasBackButton && <BackButton />}
        <div className="flex h-full w-full items-center justify-between gap-8">
          <div className="space-y-2">
            <Text
              as="h1"
              variant="text-bold-headline-800"
              className="flex-1 text-white mobile:text-lg mobile:leading-[normal]"
            >
              {title}
            </Text>
            {subtitles.map(subtitle => (
              <Text key={subtitle} variant="text-bold-subtitle-500" className="mobile:text-sm mobile:leading-[normal]">
                {subtitle}
              </Text>
            ))}
          </div>
          {children}
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
