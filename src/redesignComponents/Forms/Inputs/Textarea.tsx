import { Textarea as WriTextarea } from "@worldresources/wri-design-systems";
import type { ComponentProps, FC } from "react";

type WriTextareaProps = ComponentProps<typeof WriTextarea>;

export type TextareaProps = WriTextareaProps;

const Textarea: FC<TextareaProps> = props => <WriTextarea {...props} />;

export default Textarea;
