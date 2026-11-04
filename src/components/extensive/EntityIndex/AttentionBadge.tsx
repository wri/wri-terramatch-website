import { useT } from "@transifex/react";
import { FC } from "react";

import { useIsMobile } from "@/hooks/useIsMobile";
import TextBadge from "@/redesignComponents/status/Badge/TextBadge";

const AttentionBadge: FC<{ count: number }> = ({ count }) => {
  const t = useT();
  const isMobile = useIsMobile();

  if (count <= 0) return null;

  return <TextBadge>{isMobile ? count : t("{count} Require Attention", { count })}</TextBadge>;
};

export default AttentionBadge;
