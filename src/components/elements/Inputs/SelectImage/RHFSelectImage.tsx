import { PropsWithChildren } from "react";
import { useController } from "react-hook-form";

import { useTranslatedFormOptions } from "@/components/extensive/WizardForm/utils";
import { OptionValue } from "@/types/common";

import { RHFSelectProps } from "../Select/RHFSelect";
import SelectImage from "./SelectImage";

export interface RHFSelectImageProps extends Omit<RHFSelectProps, "linkedFieldKey"> {}

const RHFSelectImage = ({ onChangeCapture, options, ...props }: PropsWithChildren<RHFSelectImageProps>) => {
  const {
    field: { value, onChange }
  } = useController(props);

  const propsOptions = useTranslatedFormOptions(options);

  const _onChange = (value: OptionValue[]) => {
    if (props.multiSelect) onChange(value);
    else onChange(value?.[0]);

    onChangeCapture?.();
    props.formHook.trigger();
  };

  return <SelectImage {...props} options={propsOptions} value={value} onChange={_onChange} />;
};

export default RHFSelectImage;
