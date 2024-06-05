import { PropsWithChildren, useEffect } from "react";
import { useController } from "react-hook-form";

import { OptionValue } from "@/types/common";

import { RHFSelectProps } from "../Select/RHFSelect";
import SelectImage from "./SelectImage";

export interface RHFSelectImageProps extends RHFSelectProps {}

/**
 * @param props PropsWithChildren<RHFSelectImageProps>
 * @returns React Hook Form Ready SelectImage Component
 */
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

  useEffect(() => {
    props.formHook.trigger();
  }, [value, props.formHook]);
  return <SelectImage {...props} value={value} onChange={_onChange} />;
};

export default RHFSelectImage;
