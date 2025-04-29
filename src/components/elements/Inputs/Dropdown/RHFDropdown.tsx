import { difference } from "lodash";
import { useRouter } from "next/router";
import { FC, PropsWithChildren, useMemo } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import Loader from "@/components/generic/Loading/Loader";
import { useGadmOptions } from "@/connections/Gadm";
import { useGetV2FormsOptionLabels } from "@/generated/apiComponents";
import { Option, OptionValue } from "@/types/common";
import { toArray } from "@/utils/array";

import Dropdown, { DropdownProps } from "./Dropdown";

type ApiOptionsSource = "gadm-level-0" | "gadm-level-1" | "gadm-level-2";

export interface RHFDropdownProps
  extends Omit<DropdownProps, "defaultValue" | "value" | "onChange" | "optionsFilter">,
    UseControllerProps<any> {
  onChangeCapture?: () => void;
  formHook?: UseFormReturn;
  optionsFilterFieldName?: string;
  enableAdditionalOptions?: boolean;
  apiOptionsSource?: ApiOptionsSource;
}

type WithApiOptionsProps = Omit<RHFDropdownProps, "enableAdditionalOptions"> & {
  apiOptionsSource: ApiOptionsSource; // make it required
};

type WithBuiltinOptionsProps = Omit<RHFDropdownProps, "apiOptionsSource">;

type DropdownDisplayProps = Omit<RHFDropdownProps, "enableAdditionalOptions" | "apiOptionsSource">;

const WithApiOptions: FC<WithApiOptionsProps> = props => {
  const { apiOptionsSource, optionsFilterFieldName, ...displayProps } = props;

  const parentCodes =
    optionsFilterFieldName != null ? (displayProps.formHook?.watch(optionsFilterFieldName) as string[]) : undefined;
  const level = useMemo(() => Number(apiOptionsSource.slice(-1)) as 0 | 1 | 2, [apiOptionsSource]);
  const options = useGadmOptions({ level, parentCodes });

  return options == null ? <Loader /> : <DropdownDisplay {...displayProps} options={options} />;
};

const WithBuiltinOptions: FC<WithBuiltinOptionsProps> = props => {
  const { enableAdditionalOptions, ...displayProps } = props;
  const { locale } = useRouter();
  const {
    field: { value }
  } = useController(props);

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

  const additionalOptions = useMemo(
    () =>
      //@ts-ignore
      (optionsData?.data?.map((option: any) => ({
        title: option.label,
        value: option.slug,
        meta: { image_url: option.image_url }
      })) || []) as Option[],
    //@ts-ignore
    [optionsData?.data]
  );

  const notFoundOptions = useMemo(
    () =>
      difference<OptionValue>(
        additionalOptionValue,
        additionalOptions.map(item => item.value)
      ).map(value => ({ title: value, value } as Option)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [additionalOptions]
  );

  const options = useMemo(
    () =>
      enableAdditionalOptions && !props.hasOtherOptions
        ? [...props.options, ...additionalOptions, ...notFoundOptions]
        : props.options,
    [additionalOptions, enableAdditionalOptions, notFoundOptions, props.hasOtherOptions, props.options]
  );

  return <DropdownDisplay {...displayProps} options={options} />;
};

const DropdownDisplay: FC<DropdownDisplayProps> = props => {
  const { onChangeCapture, formHook, optionsFilterFieldName, ...dropdownProps } = props;

  const {
    field: { value, onChange }
  } = useController(props);

  const _onChange = (value: OptionValue[]) => {
    onChange(props.multiSelect && Array.isArray(value) ? value : value[0]);
    onChangeCapture?.();
    formHook?.trigger();
  };

  return (
    <Dropdown
      {...dropdownProps}
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

const RHFDropdown = ({ apiOptionsSource, enableAdditionalOptions, ...props }: PropsWithChildren<RHFDropdownProps>) =>
  apiOptionsSource == null ? (
    <WithBuiltinOptions {...props} enableAdditionalOptions={enableAdditionalOptions} />
  ) : (
    <WithApiOptions {...props} apiOptionsSource={apiOptionsSource} />
  );

export default RHFDropdown;
