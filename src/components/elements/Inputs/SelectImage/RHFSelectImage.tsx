import { PropsWithChildren } from "react";
import { useController } from "react-hook-form";

import { OptionValue } from "@/types/common";

import { RHFSelectProps } from "../Select/RHFSelect";
import SelectImage from "./SelectImage";

// TODO:
//  * Remove options prop, get from Connection with new optionsList string prop
export interface RHFSelectImageProps extends RHFSelectProps {}

const RHFSelectImage = ({ onChangeCapture, ...props }: PropsWithChildren<RHFSelectImageProps>) => {
  const {
    field: { value, onChange }
  } = useController(props);

  const _onChange = (value: OptionValue[]) => {
    if (props.multiSelect) onChange(value);
    else onChange(value?.[0]);

    onChangeCapture?.();
    props.formHook.trigger();
  };

  return <SelectImage {...props} value={value} onChange={_onChange} />;
};

export default RHFSelectImage;
