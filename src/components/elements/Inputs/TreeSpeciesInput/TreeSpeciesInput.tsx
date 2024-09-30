import { useT } from "@transifex/react";
import { remove } from "lodash";
import { Fragment, KeyboardEvent, useCallback, useId, useRef } from "react";
import { FieldError, FieldErrors } from "react-hook-form";
import { When } from "react-if";
import { v4 as uuidv4 } from "uuid";

import { IconNames } from "@/components/extensive/Icon/Icon";
import List from "@/components/extensive/List/List";
import { useDebounce } from "@/hooks/useDebounce";
import { updateArrayState } from "@/utils/array";

import Button from "../../Button/Button";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import IconButton from "../../IconButton/IconButton";
import Text from "../../Text/Text";
import Input from "../Input/Input";
import InputWrapper, { InputWrapperProps } from "../InputElements/InputWrapper";

export interface TreeSpeciesInputProps extends Omit<InputWrapperProps, "error"> {
  title: string;
  buttonCaptionSuffix: string;
  withNumbers?: boolean;
  withTreeSearch?: boolean;
  value: TreeSpeciesValue[];
  onChange: (value: any[]) => void;
  clearErrors: () => void;
  collection?: string;

  onError?: () => void;
  error?: FieldErrors[];
}

export type TreeSpeciesValue = { uuid?: string; name?: string; amount?: number };

const TreeSpeciesInput = (props: TreeSpeciesInputProps) => {
  const id = useId();
  const t = useT();
  const lastInputRef = useRef<HTMLInputElement>(null);

  const { onChange, value, clearErrors, collection } = props;

  const handleCreate = useDebounce(
    useCallback(
      (treeValue: TreeSpeciesValue) => {
        onChange([...value, { ...treeValue, collection }]);
        clearErrors();
      },
      [onChange, value, collection, clearErrors]
    )
  );

  const handleUpdate = useDebounce(
    useCallback(
      (treeValue: TreeSpeciesValue) => {
        onChange(updateArrayState(value, treeValue, "uuid"));
        clearErrors();
      },
      [value, onChange, clearErrors]
    )
  );

  const handleDelete = useCallback(
    (uuid: string | undefined) => {
      if (uuid != null) {
        remove(value, (v: TreeSpeciesValue) => v.uuid == uuid);
        onChange(value);
        clearErrors();
      }
    },
    [value, onChange, clearErrors]
  );

  const addValue = (e: React.MouseEvent<HTMLElement> | KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!props.error) {
      handleCreate?.({ uuid: uuidv4(), name: undefined, amount: undefined });
      lastInputRef.current && lastInputRef.current.focus();
    }
  };

  const onKeyDownCapture = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    addValue(e);
  };

  return (
    <InputWrapper
      inputId={id}
      label={props.label}
      description={props.description}
      containerClassName={props.containerClassName}
      required={props.required}
      feedbackRequired={props.feedbackRequired}
    >
      <div>
        <div className="mb-2 mt-8 flex justify-between">
          <Text variant="text-body-900" className="uppercase">
            {props.title} ({props.value.length})
          </Text>
          <When condition={props.withNumbers}>
            <Text variant="text-body-900" className="uppercase">
              {t(`Total Count: ({number})`, { number: props.value.reduce((total, v) => total + (v.amount || 0), 0) })}
            </Text>
          </When>
        </div>

        <List
          as="div"
          className="max-h-[300px] overflow-y-auto"
          itemAs={Fragment}
          uniqueId={"uuid"}
          items={props.value}
          render={(value, index) => (
            <div className="relative flex w-full">
              <Input
                ref={lastInputRef}
                name="name"
                type="text"
                variant="secondary"
                defaultValue={value.name}
                onChange={e => handleUpdate({ ...value, name: e.target.value })}
                placeholder={t("Species Name")}
                error={props.error?.[index]?.name ? ({} as FieldError) : undefined}
                onKeyDownCapture={onKeyDownCapture}
                containerClassName="flex-1"
              />
              <When condition={props.withNumbers}>
                <Input
                  name="amount"
                  type="number"
                  variant="secondary"
                  defaultValue={value.amount}
                  placeholder={t("Enter value")}
                  error={props.error?.[index]?.amount ? ({} as FieldError) : undefined}
                  onChange={e => handleUpdate({ ...value, amount: +e.target.value })}
                  onKeyDownCapture={onKeyDownCapture}
                  containerClassName="flex-3"
                />
              </When>
              <IconButton
                iconProps={{ name: IconNames.MINUS_CIRCLE, width: 22 }}
                className="absolute right-0 top-3"
                onClick={() => handleDelete(props.value?.[index]?.uuid)}
              />
            </div>
          )}
        />
        <When condition={!!props.error}>
          <ErrorMessage error={{ message: t("One or more values are missing"), type: "required" }} className="mt-5" />
        </When>
        <Button
          variant="secondary"
          onClick={addValue}
          className="mt-4 w-fit"
          iconProps={{ name: IconNames.PLUS_THICK, width: 12 }}
        >
          {props.value.length > 0
            ? t(`Add Another {suffix}`, { suffix: props.buttonCaptionSuffix })
            : t("Add {suffix}", { suffix: props.buttonCaptionSuffix })}
        </Button>
      </div>
    </InputWrapper>
  );
};

export default TreeSpeciesInput;
