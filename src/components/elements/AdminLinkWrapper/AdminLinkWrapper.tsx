import { Link } from "@chakra-ui/react";
import { forwardRef } from "react";

const AdminLinkWrapper = forwardRef<
  HTMLAnchorElement,
  { href?: string; to?: string; children?: React.ReactNode; className?: string }
>(({ href, to, children, className, ...props }, ref) => {
  const url = href ?? to;
  const isFullUrl = url?.startsWith("http://") || url?.startsWith("https://");

  if (isFullUrl) {
    return (
      <a
        ref={ref}
        href={url}
        className={className}
        onClick={e => {
          e.preventDefault();
          if (url) window.location.href = url;
        }}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link ref={ref} href={url || "#"} className={className} {...props}>
      {children}
    </Link>
  );
});

AdminLinkWrapper.displayName = "AdminLinkWrapper";

export default AdminLinkWrapper;
