import classNames from "classnames";
import { DetailedHTMLProps, Fragment, HTMLAttributes } from "react";

import LinkWrapper from "@/components/elements/LinkWrapper/LinkWrapper";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { History } from "@/context/routeHistory.provider";

export interface BreadcrumbsProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  links: (Omit<History, "path"> & { path?: string })[];
}

const Breadcrumbs = ({ className, links, ...props }: BreadcrumbsProps) => {
  return (
    <div {...props} className={classNames(className, "flex items-center gap-3")}>
      {links.map((item, index) => (
        <Fragment key={`${item.path} + ${index}`}>
          <LinkWrapper href={item.path}>
            <Text
              variant="text-14-bold"
              className={classNames(
                { "text-darkCustom opacity-60 hover:underline": !!item.path, "text-darkCustom": !item.path },
                "line-clamp-1"
              )}
              title={item.title}
            >
              {item.title}
            </Text>
          </LinkWrapper>
          {index < links.length - 1 && <Icon name={IconNames.CHEVRON_RIGHT} width={12} className="text-darkCustom" />}
        </Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;
