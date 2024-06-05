import { difference } from "lodash";
import { useRouter } from "next/router";
import { PropsWithChildren, useMemo } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import { useGetV2FormsOptionLabels } from "@/generated/apiComponents";
import { Option, OptionValue } from "@/types/common";
import { toArray } from "@/utils/array";

import Dropdown, { DropdownProps } from "./Dropdown";

export interface RHFDropdownProps
  extends Omit<DropdownProps, "defaultValue" | "value" | "onChange" | "optionsFilter">,
    UseControllerProps<any> {
  onChangeCapture?: () => void;
  formHook?: UseFormReturn;
  optionsFilterFieldName?: string;
  enableAdditionalOptions?: boolean;
}

/**
 * @param props PropsWithChildren<RHFDropdownProps>
 * @returns React Hook Form Ready Dropdown Component
 */
const RHFDropdown = ({
  optionsFilterFieldName,
  enableAdditionalOptions,
  ...props
}: PropsWithChildren<RHFDropdownProps>) => {
  const { locale } = useRouter();
  const {
    field: { value, onChange }
  } = useController(props);

  const _onChange = (value: OptionValue[]) => {
    onChange(props.multiSelect && Array.isArray(value) ? value : value[0]);
    props.onChangeCapture?.();
    props.formHook?.trigger();
  };

  const additionalOptionValue = useMemo(
    () =>
      difference<OptionValue>(
        toArray(value),
        props.options.map(op => op.value)
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.options]
  );

  //To fetch additional option labels that are not included in original options list
  const { data: optionsData } = useGetV2FormsOptionLabels(
    {
      queryParams: {
        lang: locale,
        keys: additionalOptionValue.join(",")
      }
    },
    {
      enabled: additionalOptionValue.length > 0
    }
  );

  const additionalOptions =
    //@ts-ignore
    (optionsData?.data?.map((option: any) => ({
      title: option.label,
      value: option.slug,
      meta: { image_url: option.image_url }
    })) || []) as Option[];

  const notFoundOptions = useMemo(
    () =>
      difference<OptionValue>(
        additionalOptionValue,
        additionalOptions.map(item => item.value)
      ).map(value => ({ title: value, value } as Option)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [additionalOptions]
  );

  return (
    <Dropdown
      {...props}
      options={
        enableAdditionalOptions && !props.hasOtherOptions
          ? [...props.options, ...additionalOptions, ...notFoundOptions]
          : props.options
      }
      value={toArray(value)}
      defaultValue={toArray(props.defaultValue)}
      onChange={_onChange}
      optionsFilter={optionsFilterFieldName ? props.formHook?.watch(optionsFilterFieldName) : undefined}
      onInternalError={error => {
        if (error) props.formHook?.setError(props.name, error);
        else props.formHook?.clearErrors(props.name);
      }}
    />
  );
};

export default RHFDropdown;
