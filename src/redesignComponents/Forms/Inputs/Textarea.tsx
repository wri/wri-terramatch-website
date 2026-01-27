import { Textarea as WriTextarea } from "@worldresources/wri-design-systems";
import type { ComponentProps } from "react";
import { FC } from "react";

const Textarea: FC<ComponentProps<typeof WriTextarea>> = props => <WriTextarea {...props} />;

export default Textarea;
