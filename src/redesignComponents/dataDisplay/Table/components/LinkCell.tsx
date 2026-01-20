import { useT } from "@transifex/react";
import classNames from "classnames";

interface LinkCellProps {
  value: string;
  href?: string;
  truncate?: boolean;
  widthLinkCell?: string;
}

export const LinkCell = ({ value, href, widthLinkCell = "!max-w-96 !w-96" }: LinkCellProps) => {
  const t = useT();

  return (
    <div className={classNames("flex overflow-hidden", widthLinkCell)}>
      <a
        href={href || "#"}
        className="overflow-hidden truncate text-theme-primary-900 underline decoration-dotted underline-offset-4"
      >
        {t(value)}
      </a>
    </div>
  );
};
