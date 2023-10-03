import cn from "classnames";
import _ from "lodash";
import { HTMLProps, ReactNode } from "react";

import { TextVariants } from "@/types/common";

export type TextProps<T = HTMLParagraphElement> = HTMLProps<T> & {
  as?: React.ElementType;
  className?: string;
  variant: TextVariants;
  children?: ReactNode;
  containHtml?: boolean;
  capitalize?: boolean;
};

function Text<T>(props: TextProps<T>): JSX.Element {
  const { as: As, className, children, variant, capitalize, containHtml, ...rest } = props;

  const Component = As || "p";

  if (containHtml) {
    const __html = typeof children === "string" ? children.replace(/\n/g, "<br/>") : children;
    return (
      <Component
        {...rest}
        data-testid="txt"
        className={cn(className, variant, { "with-inner-html": containHtml }, { capitalize })}
        dangerouslySetInnerHTML={{ __html }}
      />
    );
  } else
    return (
      <Component {...rest} data-testid="txt" className={cn(className, variant, { capitalize })}>
        {typeof children === "string" ? _.unescape(children) : children}
      </Component>
    );
}

export default Text;
