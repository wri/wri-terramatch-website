import { Password as WriPassword } from "@worldresources/wri-design-systems";
import type { ComponentProps } from "react";
import { FC } from "react";

const Password: FC<ComponentProps<typeof WriPassword>> = props => <WriPassword {...props} />;

export default Password;
