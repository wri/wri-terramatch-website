import { difference } from "lodash";
import { FC, PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import Loader from "@/components/generic/Loading/Loader";
import { useGadmOptions } from "@/connections/Gadm";
import { useOptionLabels } from "@/connections/util/Form";
import { useDisturbanceOptions } from "@/hooks/useDisturbanceOptions";
import { Option, OptionValue } from "@/types/common";
import { toArray } from "@/utils/array";

import Dropdown, { DropdownProps } from "./Dropdown";

type ApiOptionsSource = "gadm-level-0" | "gadm-level-1" | "gadm-level-2";
type DisturbanceOptionsSource = "disturbance-type" | "disturbance-subtype";

export interface RHFDropdownProps
  extends Omit<DropdownProps, "defaultValue" | "value" | "onChange" | "optionsFilter">,
    UseControllerProps<any> {
  onChangeCapture?: () => void;
  formHook?: UseFormReturn;
  optionsFilterFieldName?: string;
  enableAdditionalOptions?: boolean;
  apiOptionsSource?: ApiOptionsSource;
  disturbanceOptionsSource?: DisturbanceOptionsSource;
  linkedFieldKey?: string;
}

type WithApiOptionsProps = Omit<RHFDropdownProps, "enableAdditionalOptions" | "disturbanceOptionsSource"> & {
  apiOptionsSource: ApiOptionsSource; // make it required
};

type WithDisturbanceOptionsProps = Omit<RHFDropdownProps, "enableAdditionalOptions" | "apiOptionsSource"> & {
  disturbanceOptionsSource: DisturbanceOptionsSource; // make it required
};

type WithBuiltinOptionsProps = Omit<RHFDropdownProps, "apiOptionsSource" | "disturbanceOptionsSource">;

type DropdownDisplayProps = Omit<
  RHFDropdownProps,
  "enableAdditionalOptions" | "apiOptionsSource" | "disturbanceOptionsSource"
>;

// Helper function to find the disturbance type field name
const findDisturbanceTypeFieldName = (formHook?: UseFormReturn): string | undefined => {
  if (!formHook) return undefined;

  const formValues = formHook.getValues();

  for (const [fieldName, value] of Object.entries(formValues)) {
    if (value === "climatic" || value === "ecological" || value === "manmade") {
      return fieldName;
    }
  }

  return undefined;
};

const WithApiOptions: FC<WithApiOptionsProps> = props => {
  const { apiOptionsSource, optionsFilterFieldName, formHook, ...displayProps } = props;
  // If the parentCodes change, it can cause the useGadmOptions hook to return null until all options
  // have loaded. In that case, we want to avoid sending null options to DropdownDisplay, as that will
  // cause it to unselect its current selections.
  const [optionsCache, setOptionsCache] = useState<Option[] | undefined>();

  const parentFieldValue = optionsFilterFieldName != null ? formHook?.watch(optionsFilterFieldName) : undefined;
  const parentCodes = useMemo(
    () => (parentFieldValue == null ? undefined : toArray(parentFieldValue)),
    [parentFieldValue]
  );
  const level = useMemo(() => Number(apiOptionsSource.slice(-1)) as 0 | 1 | 2, [apiOptionsSource]);
  const options = useGadmOptions({ level, parentCodes });

  useEffect(() => {
    if (options != null) setOptionsCache(options);
  }, [options]);

  return optionsCache == null ? (
    <Loader />
  ) : (
    <DropdownDisplay {...displayProps} formHook={formHook} options={optionsCache} />
  );
};

const WithBuiltinOptions: FC<WithBuiltinOptionsProps> = props => {
  const { enableAdditionalOptions, ...displayProps } = props;
  const {
    field: { value }
  } = useController(props);

  const additionalOptionValue = useMemo(
    () =>
      difference<OptionValue>(
        toArray(value),
        props.options.map(op => op.value)
      ) as string[],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.options]
  );

  //To fetch additional option labels that are not included in original options list
  const [, { data: optionsData }] = useOptionLabels({ ids: additionalOptionValue });

  const additionalOptions = useMemo(
    () =>
      //@ts-ignore
      Object.values(optionsData ?? {}).map(option => ({
        title: option.label,
        value: option.slug,
        meta: { image_url: option.imageUrl }
      })) as Option[],
    //@ts-ignore
    [optionsData]
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

const WithDisturbanceOptions: FC<WithDisturbanceOptionsProps> = props => {
  const { disturbanceOptionsSource, formHook, ...displayProps } = props;

  const parentFieldName =
    disturbanceOptionsSource === "disturbance-subtype" ? findDisturbanceTypeFieldName(formHook) : undefined;

  const options = useDisturbanceOptions(
    disturbanceOptionsSource === "disturbance-type" ? "type" : "subtype",
    formHook,
    parentFieldName
  );

  return <DropdownDisplay {...displayProps} options={options} />;
};

const DropdownDisplay: FC<DropdownDisplayProps> = props => {
  const { onChangeCapture, formHook, optionsFilterFieldName, defaultValue, ...dropdownProps } = props;

  const {
    field: { value, onChange }
  } = useController(props);

  const _onChange = useCallback(
    (value: OptionValue[]) => {
      onChange(props.multiSelect && Array.isArray(value) ? value : value[0]);
      onChangeCapture?.();
      props.formHook?.trigger();
    },
    [onChange, onChangeCapture, props.formHook, props.multiSelect]
  );

  const valueArray = useMemo(() => toArray(value), [value]);
  const defaultValueArray = useMemo(() => toArray(defaultValue), [defaultValue]);

  return (
    <Dropdown
      {...dropdownProps}
      value={valueArray}
      defaultValue={defaultValueArray}
      onChange={_onChange}
      optionsFilter={optionsFilterFieldName ? formHook?.watch(optionsFilterFieldName) : undefined}
      onInternalError={error => {
        if (error != null) formHook?.setError(props.name, error);
        else formHook?.clearErrors(props.name);
      }}
    />
  );
};

const RHFDropdown = ({ apiOptionsSource, enableAdditionalOptions, ...props }: PropsWithChildren<RHFDropdownProps>) => {
  // Check if this is a disturbance field based on linkedFieldKey
  const linkedFieldKey = props.linkedFieldKey;
  const isDisturbanceType = linkedFieldKey === "dis-rep-disturbance-type";
  const isDisturbanceSubtype = linkedFieldKey === "dis-rep-disturbance-subtype";
  const disturbanceOptionsSource = isDisturbanceType
    ? "disturbance-type"
    : isDisturbanceSubtype
    ? "disturbance-subtype"
    : undefined;

  if (apiOptionsSource != null) {
    return <WithApiOptions {...props} apiOptionsSource={apiOptionsSource} />;
  }

  if (disturbanceOptionsSource != null) {
    return <WithDisturbanceOptions {...props} disturbanceOptionsSource={disturbanceOptionsSource} />;
  }

  return <WithBuiltinOptions {...props} enableAdditionalOptions={enableAdditionalOptions} />;
};

export default RHFDropdown;
