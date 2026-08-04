import { Badge as WriBadge } from "@worldresources/wri-design-systems";
import type { ComponentProps, FC } from "react";

type BadgeProps = ComponentProps<typeof WriBadge>;

const Badge: FC<BadgeProps> = props => <WriBadge {...props} />;

export default Badge;
