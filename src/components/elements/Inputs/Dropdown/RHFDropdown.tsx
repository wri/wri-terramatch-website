import { difference, isEqual } from "lodash";
import { useRouter } from "next/router";
import { FC, PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
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
  const { apiOptionsSource, optionsFilterFieldName, formHook, ...displayProps } = props;
  // If the parentCodes change, it can cause the useGadmOptions hook to return null until all options
  // have loaded. In that case, we want to avoid sending null options to DropdownDisplay, as that will
  // cause it to unselect its current selections.
  const [optionsCache, setOptionsCache] = useState<Option[] | undefined>();

  const parentCodes = optionsFilterFieldName != null ? formHook?.watch(optionsFilterFieldName) : undefined;
  const level = useMemo(() => Number(apiOptionsSource.slice(-1)) as 0 | 1 | 2, [apiOptionsSource]);

  const options = useGadmOptions({ level, parentCodes: [parentCodes] });

  useEffect(() => {
    if (options != null) setOptionsCache(options);
  }, [options]);

  return optionsCache == null ? <Loader /> : <DropdownDisplay {...displayProps} options={optionsCache} />;
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
  const { onChangeCapture, formHook, optionsFilterFieldName, defaultValue, ...dropdownProps } = props;
  const { options } = dropdownProps;

  const {
    field: { value, onChange }
  } = useController(props);

  const _onChange = useCallback(
    (value: OptionValue[]) => {
      onChange(props.multiSelect && Array.isArray(value) ? value : value[0]);
      onChangeCapture?.();
    },
    [onChange, onChangeCapture, props.multiSelect]
  );

  const valueArray = useMemo(() => toArray(value), [value]);
  const defaultValueArray = useMemo(() => toArray(defaultValue), [defaultValue]);

  useEffect(() => {
    // if our options change and our current values aren't available, reset to the default.
    const filtered = valueArray.filter(value => options.find(option => option.value === value) != null);
    if (!isEqual(filtered, valueArray)) {
      if (filtered.length === 0) {
        _onChange(defaultValueArray);
      } else {
        _onChange(filtered);
      }
    }
  }, [_onChange, defaultValueArray, options, valueArray]);

  return (
    <Dropdown
      {...dropdownProps}
      value={valueArray}
      defaultValue={defaultValueArray}
      onChange={_onChange}
      optionsFilter={optionsFilterFieldName ? formHook?.watch(optionsFilterFieldName) : undefined}
      onInternalError={error => {
        if (error) formHook?.setError(props.name, error);
        else formHook?.clearErrors(props.name);
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
