import Link from "next/link";
import { ComponentProps, forwardRef } from "react";

type NextLinkAdapterProps = Omit<ComponentProps<typeof Link>, "href"> & { to: string };

const NextLinkAdapter = forwardRef<HTMLAnchorElement, NextLinkAdapterProps>(({ to, ...props }, ref) => (
  <Link {...props} href={to} ref={ref} />
));

NextLinkAdapter.displayName = "NextLinkAdapter";

export default NextLinkAdapter;
