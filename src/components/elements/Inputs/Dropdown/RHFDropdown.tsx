import { useT } from "@transifex/react";
import { difference } from "lodash";
import { FC, PropsWithChildren, useCallback, useEffect, useMemo, useState } from "react";
import { useController, UseControllerProps, UseFormReturn } from "react-hook-form";

import { getHardcodedOptions, toFormOptions, useFilterFieldName } from "@/components/extensive/WizardForm/utils";
import Loader from "@/components/generic/Loading/Loader";
import { useGadmOptions } from "@/connections/Gadm";
import { useOptionLabels } from "@/connections/util/Form";
import { FormQuestionOptionDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { Option, OptionValue } from "@/types/common";
import { toArray } from "@/utils/array";

import Dropdown, { DropdownProps } from "./Dropdown";

export interface RHFDropdownProps
  extends Omit<DropdownProps, "defaultValue" | "value" | "onChange" | "optionsFilter" | "options">,
    UseControllerProps<any> {
  onChangeCapture?: () => void;
  formHook?: UseFormReturn;
  options?: FormQuestionOptionDto[] | Option[];
  enableAdditionalOptions?: boolean;
  optionsList?: string;
  linkedFieldKey?: string;
}

type WithOptionsList = Omit<RHFDropdownProps, "optionsList"> & {
  optionsList: string; // make it required
};

type WithBuiltinOptionsProps = Omit<RHFDropdownProps, "options"> & {
  options: FormQuestionOptionDto[] | Option[]; // make it required
};

type DropdownDisplayProps = Omit<RHFDropdownProps, "enableAdditionalOptions" | "optionsList" | "options"> & {
  options: Option[]; // make it required
};

const WithGadmOptions: FC<WithOptionsList> = props => {
  const { optionsList, linkedFieldKey, formHook, ...displayProps } = props;
  // If the parentCodes change, it can cause the useGadmOptions hook to return null until all options
  // have loaded. In that case, we want to avoid sending null options to DropdownDisplay, as that will
  // cause it to unselect its current selections.
  const [optionsCache, setOptionsCache] = useState<Option[] | undefined>();
  const filterFieldName = useFilterFieldName(linkedFieldKey);

  const parentFieldValue = filterFieldName != null ? formHook?.watch(filterFieldName) : undefined;
  const parentCodes = useMemo(
    () => (parentFieldValue == null ? undefined : toArray(parentFieldValue)),
    [parentFieldValue]
  );
  const level = useMemo(() => Number(optionsList.slice(-1)) as 0 | 1 | 2, [optionsList]);
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

const WithHardcodedOptions: FC<WithOptionsList> = ({ optionsList, ...displayProps }) => {
  const t = useT();
  const options = useMemo(() => getHardcodedOptions(optionsList, t), [optionsList, t]);
  return <WithBuiltinOptions {...displayProps} options={options} />;
};

const WithBuiltinOptions: FC<WithBuiltinOptionsProps> = ({ options, enableAdditionalOptions, ...displayProps }) => {
  const {
    field: { value }
  } = useController(displayProps);

  const propsOptions = useMemo(() => toFormOptions(options), [options]);

  const additionalOptionValue = useMemo(
    () =>
      difference<OptionValue>(
        toArray(value),
        propsOptions.map(op => op.value)
      ) as string[],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [propsOptions]
  );

  // To fetch additional option labels that are not included in original options list
  const [, { data: optionsData }] = useOptionLabels({ ids: additionalOptionValue });

  const additionalOptions = useMemo(
    () =>
      Object.values(optionsData ?? {}).map(option => ({
        title: option.label,
        value: option.slug,
        meta: { image_url: option.imageUrl }
      })) as Option[],
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

  const allOptions = useMemo(
    () =>
      enableAdditionalOptions && !displayProps.hasOtherOptions
        ? [...propsOptions, ...additionalOptions, ...notFoundOptions]
        : propsOptions,
    [additionalOptions, enableAdditionalOptions, notFoundOptions, displayProps.hasOtherOptions, propsOptions]
  );

  return <DropdownDisplay {...displayProps} options={allOptions} />;
};

const DropdownDisplay: FC<DropdownDisplayProps> = props => {
  const { onChangeCapture, formHook, linkedFieldKey, defaultValue, ...dropdownProps } = props;
  const filterFieldName = useFilterFieldName(linkedFieldKey);

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
      optionsFilter={filterFieldName == null ? undefined : formHook?.watch(filterFieldName)}
      onInternalError={error => {
        if (error != null) formHook?.setError(props.name, error);
        else formHook?.clearErrors(props.name);
      }}
    />
  );
};

const RHFDropdown = ({ optionsList, options, ...props }: PropsWithChildren<RHFDropdownProps>) =>
  options != null ? (
    <WithBuiltinOptions {...props} options={options} />
  ) : optionsList?.startsWith("gadm-level-") ? (
    <WithGadmOptions {...props} optionsList={optionsList} />
  ) : (
    <WithHardcodedOptions {...props} optionsList={optionsList ?? ""} />
  );

export default RHFDropdown;
