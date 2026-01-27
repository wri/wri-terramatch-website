import { TextInput as WriTextInput } from "@worldresources/wri-design-systems";
import type { ComponentProps } from "react";
import { FC } from "react";

const TextInput: FC<ComponentProps<typeof WriTextInput>> = props => <WriTextInput {...props} />;

export default TextInput;
