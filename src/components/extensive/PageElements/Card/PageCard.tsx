import classNames from "classnames";
import { DetailedHTMLProps, HTMLAttributes, PropsWithChildren, ReactNode } from "react";
import { When } from "react-if";

import Text from "@/components/elements/Text/Text";

export interface PageCardProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    PropsWithChildren {
  title?: string;
  subtitle?: string;
  headerChildren?: ReactNode;
}

const PageCard = ({ title, subtitle, children, headerChildren, className, ...props }: PageCardProps) => {
  return (
    <div {...props} className={classNames("w-full rounded-xl bg-white p-8 shadow", className)}>
      <When condition={!!title || !!headerChildren}>
        <div className="mb-3 flex justify-between">
          <When condition={!!title}>
            <Text variant="text-bold-headline-1000" className="flex-1">
              {title}
            </Text>
          </When>
          <When condition={!!title}>{headerChildren}</When>
        </div>
      </When>
      <When condition={!!subtitle}>
        <Text variant="text-light-subtitle-400">{subtitle}</Text>
      </When>
      <When condition={!!children}>
        <div className="mt-8">{children}</div>
      </When>
    </div>
  );
};

export default PageCard;
