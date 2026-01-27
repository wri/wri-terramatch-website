import { InputWithUnits as WriInputWithUnits } from "@worldresources/wri-design-systems";
import type { ComponentProps } from "react";
import { FC } from "react";

const InputWithUnits: FC<ComponentProps<typeof WriInputWithUnits>> = props => <WriInputWithUnits {...props} />;

export default InputWithUnits;
