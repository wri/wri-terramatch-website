import { Switch as WriSwitch } from "@worldresources/wri-design-systems";
import type { ComponentProps, FC } from "react";

type SwitchProps = ComponentProps<typeof WriSwitch>;

const Switch: FC<SwitchProps> = props => <WriSwitch {...props} />;

export default Switch;
