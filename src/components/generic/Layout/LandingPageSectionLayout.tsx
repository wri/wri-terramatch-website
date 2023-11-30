import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from "react";

import Text from "@/components/elements/Text/Text";

interface LandingPageSectionLayoutProps
  extends PropsWithChildren<DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>> {
  title: string;
  preTitle?: string;
  overridePadding?: boolean;
}

const LandingPageSectionLayout = (props: LandingPageSectionLayoutProps) => {
  const { className, title, preTitle, children, overridePadding, ...divProps } = props;

  return (
    <div
      {...divProps}
      className={classNames(className, "flex flex-col items-center", !overridePadding && " py-9 md:py-15")}
    >
      <Text variant="text-heading-700" className="text-center underline">
        {preTitle}
      </Text>
      <Text variant="text-heading-700" className="text-center">
        {title}
      </Text>
      {children}
    </div>
  );
};

export default LandingPageSectionLayout;
