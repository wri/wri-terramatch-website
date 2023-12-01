import Link from "next/link";
import { PropsWithChildren } from "react";
import { UrlObject } from "url";

export interface LinkWrapperProps extends PropsWithChildren {
  href?: string | UrlObject;
}

const LinkWrapper = ({ href, children }: LinkWrapperProps) => {
  if (href) {
    return <Link href={href}>{children}</Link>;
  } else {
    return <>{children}</>;
  }
};

export default LinkWrapper;
