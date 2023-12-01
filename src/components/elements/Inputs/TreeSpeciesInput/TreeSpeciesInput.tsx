import { useT } from "@transifex/react";
import { Fragment, KeyboardEvent, useId, useRef } from "react";
import { FieldError, FieldErrors } from "react-hook-form";
import { When } from "react-if";

import { IconNames } from "@/components/extensive/Icon/Icon";
import List from "@/components/extensive/List/List";
import { useDebounce } from "@/hooks/useDebounce";

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

  handleCreate?: (value: TreeSpeciesValue) => void;
  handleNameUpdate?: (value: TreeSpeciesValue) => void;
  handleAmountUpdate?: (value: TreeSpeciesValue) => void;
  handleDelete?: (uuid?: string) => void;

  onError?: () => void;
  error?: FieldErrors[];
}

export type TreeSpeciesValue = { uuid?: string; name?: string; amount?: number };

const TreeSpeciesInput = (props: TreeSpeciesInputProps) => {
  const id = useId();
  const t = useT();

  const lastInputRef = useRef<HTMLInputElement>(null);

  const handleCreate = useDebounce((value: TreeSpeciesValue) => {
    props.handleCreate?.(value);
  });

  const handleNameUpdate = useDebounce((value: TreeSpeciesValue) => {
    props.handleNameUpdate?.(value);
  });

  const handleAmountUpdate = useDebounce((value: TreeSpeciesValue) => {
    props.handleAmountUpdate?.(value);
  });

  const addValue = (e: React.MouseEvent<HTMLElement> | KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!props.error) {
      //To stop user from creating lot's of empty records
      handleCreate?.({ name: undefined, amount: undefined });
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
        <div className="mt-8 mb-2 flex justify-between">
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
          items={props.value}
          render={(value, index) => (
            <div className="relative flex w-full">
              <Input
                ref={lastInputRef}
                name="name"
                type="text"
                variant="secondary"
                defaultValue={value.name}
                onChange={e => handleNameUpdate({ ...value, name: e.target.value })}
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
                  onChange={e => handleAmountUpdate({ ...value, amount: +e.target.value })}
                  onKeyDownCapture={onKeyDownCapture}
                  containerClassName="flex-3"
                />
              </When>
              <IconButton
                iconProps={{ name: IconNames.MINUS_CIRCLE, width: 22 }}
                className="absolute right-0 top-3"
                onClick={() => props.handleDelete?.(props.value?.[index]?.uuid)}
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
