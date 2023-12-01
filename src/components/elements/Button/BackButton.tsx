import { useT } from "@transifex/react";
import Link from "next/link";

import Button from "@/components/elements/Button/Button";
import { IconNames } from "@/components/extensive/Icon/Icon";
import { History, useRouteHistoryContext } from "@/context/routeHistory.provider";

const BackButton = (props: { fallback?: History }) => {
  const t = useT();
  const { previousRoute } = useRouteHistoryContext();
  const to = previousRoute || props.fallback || { path: "/home", title: t("Home") };

  return (
    <Button
      as={Link}
      variant="text"
      iconProps={{ name: IconNames.CHEVRON_LEFT_CIRCLE, width: 32, height: 32 }}
      className="gap-2 px-0"
      href={to?.path}
    >
      {t("Back to {pageName}", { pageName: to?.title })}
    </Button>
  );
};

export default BackButton;
