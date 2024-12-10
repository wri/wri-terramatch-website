import { useT } from "@transifex/react";
import classNames from "classnames";
import { isEmpty, remove } from "lodash";
import { Fragment, KeyboardEvent, useCallback, useId, useRef, useState } from "react";
import { FieldError, FieldErrors } from "react-hook-form";
import { Else, If, Then, When } from "react-if";
import { v4 as uuidv4 } from "uuid";

import { useAutocompleteSearch } from "@/components/elements/Inputs/TreeSpeciesInput/useAutocompleteSearch";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import List from "@/components/extensive/List/List";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useModalContext } from "@/context/modal.provider";
import { useDebounce } from "@/hooks/useDebounce";
import { updateArrayState } from "@/utils/array";

import Button from "../../Button/Button";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";
import IconButton from "../../IconButton/IconButton";
import Text from "../../Text/Text";
import AutoCompleteInput from "../AutoCompleteInput/AutoCompleteInput";
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

export type TreeSpeciesValue = { uuid?: string; name?: string; taxon_id?: string; amount?: number };

const NonScientificConfirmationModal = ({ onConfirm }: { onConfirm: () => void }) => {
  const t = useT();
  const { closeModal } = useModalContext();

  return (
    <div className="margin-4 z-50 m-auto flex max-h-full flex-col items-center justify-start overflow-y-auto rounded-lg border-2 border-neutral-100 bg-white">
      <div className="flex w-full items-center justify-center gap-1 border-b-2 border-neutral-100 py-1">
        <Icon name={IconNames.EXCLAMATION_CIRCLE_FILL} className="min-h-4 min-w-4 mb-1 h-4 w-4 text-tertiary-600" />
        <Text variant="text-16-semibold" className="mb-1 text-blueCustom-700">
          {t("Your input is a not a scientific name")}
        </Text>
      </div>
      <div className="w-full p-4">
        <div className="w-full rounded-lg border border-dashed bg-neutral-250 p-2">
          <div className="flex items-center gap-1">
            <Text variant="text-14-light" className="text-blueCustom-700">
              {t("You can add this species, but it will be pending review from Admin.")}
            </Text>
          </div>
        </div>
        <div className="mt-4 flex w-full justify-end gap-3">
          <Button variant="secondary" onClick={() => closeModal(ModalId.ERROR_MODAL)}>
            {t("CANCEL")}
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              closeModal(ModalId.ERROR_MODAL);
              onConfirm();
            }}
          >
            {t("CONFIRM")}
          </Button>
        </div>
      </div>
    </div>
  );
};

const TreeSpeciesInput = (props: TreeSpeciesInputProps) => {
  const id = useId();
  const t = useT();
  const lastInputRef = useRef<HTMLInputElement>(null);
  const autoCompleteRef = useRef<HTMLInputElement>(null);

  const [valueAutoComplete, setValueAutoComplete] = useState("");
  const [searchResult, setSearchResult] = useState<string[]>();
  const [editIndex, setEditIndex] = useState<string | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<TreeSpeciesValue | null>(null);
  const refPlanted = useRef<HTMLDivElement>(null);
  const refTotal = useRef<HTMLDivElement>(null);
  const refTreeSpecies = useRef<HTMLDivElement>(null);
  const { openModal } = useModalContext();

  const { autocompleteSearch, findTaxonId } = useAutocompleteSearch();

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
    if (props.error) return;

    const taxonId = findTaxonId(valueAutoComplete);

    const doAdd = () => {
      handleCreate?.({
        uuid: uuidv4(),
        name: valueAutoComplete,
        taxon_id: taxonId,
        amount: props.withNumbers ? 0 : undefined
      });

      lastInputRef.current?.focus();
    };

    if (!isEmpty(searchResult) && taxonId == null) {
      // In this case the use had valid values to choose from, but decided to add a value that isn't
      // on the list, so they haven't been shown the warning yet.
      openModal(ModalId.ERROR_MODAL, <NonScientificConfirmationModal onConfirm={doAdd} />);
    } else {
      doAdd();
    }
  };

  const updateValue = () => {
    const taxonId = findTaxonId(valueAutoComplete);

    const doUpdate = () => {
      setEditIndex(null);

      handleUpdate({
        ...editValue,
        name: valueAutoComplete,
        taxon_id: findTaxonId(valueAutoComplete)
      });

      setValueAutoComplete("");
    };

    if (!isEmpty(searchResult) && taxonId == null) {
      openModal(ModalId.ERROR_MODAL, <NonScientificConfirmationModal onConfirm={doUpdate} />);
    } else {
      doUpdate();
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
      label={"ADD TREE SPECIES"}
      description={props.description}
      containerClassName={props.containerClassName}
      required={props.required}
      feedbackRequired={props.feedbackRequired}
    >
      <div>
        <When condition={!props.withNumbers}>
          <div className="text-12 flex w-[66%] gap-1 rounded border border-tertiary-80 bg-tertiary-50 p-2">
            <Icon name={IconNames.EXCLAMATION_CIRCLE_FILL} className="min-h-4 min-w-4 h-4 w-4 text-tertiary-600" />
            {t(
              "If you would like to add a species not included on the original Restoration Project, it will be flagged to the admin as new information pending review."
            )}
          </div>
        </When>
        <div className="mb-2 mt-8">
          <Text variant="text-14-light" className="text-black">
            {t("Scientific Name:")}
          </Text>
          <div className="mt-3 flex items-start gap-3">
            <div className="relative w-[40%]">
              <AutoCompleteInput
                ref={autoCompleteRef}
                name="treeSpecies"
                classNameMenu="bg-white z-10 w-full"
                type="text"
                placeholder={t("Start typing")}
                value={valueAutoComplete}
                onChange={e => setValueAutoComplete(e.target.value)}
                onSearch={async search => {
                  const result = await autocompleteSearch(search);
                  setSearchResult(result);
                  return result;
                }}
              />
              <When condition={valueAutoComplete.length > 0}>
                <button onClick={() => setValueAutoComplete("")} className="absolute right-4 top-4 ">
                  <Icon name={IconNames.CLEAR} className="min-h-3 min-w-3 h-3 w-3" />
                </button>
              </When>
            </div>
            <If condition={!editIndex}>
              <Then>
                <button onClick={addValue} disabled={valueAutoComplete.length < 1}>
                  <Icon
                    name={IconNames.IC_ADD_BUTTON}
                    className={classNames("h-10 w-10 text-neutral-500 hover:text-primary", {
                      "hover:!text-red": valueAutoComplete.length < 1,
                      "cursor-not-allowed": valueAutoComplete.length < 1
                    })}
                  />
                </button>
              </Then>
              <Else>
                <Button onClick={updateValue} variant="secondary">
                  {t("Save")}
                </Button>
                <Button
                  onClick={() => {
                    setEditIndex(null);
                    setValueAutoComplete("");
                  }}
                  variant="secondary"
                >
                  {t("Cancel")}
                </Button>
              </Else>
            </If>
          </div>
        </div>
        <When condition={!isEmpty(valueAutoComplete) && searchResult != null && isEmpty(searchResult)}>
          <div className="w-[40%] rounded-lg border border-primary bg-neutral-250 p-2">
            <Text variant="text-14-semibold" className="mb-1 text-blueCustom-700">
              {t("No matches available")}
            </Text>
            <div className="flex items-center gap-1">
              <Icon name={IconNames.EXCLAMATION_CIRCLE_FILL} className="min-h-4 min-w-4 h-4 w-4 text-tertiary-600" />
              <Text variant="text-14-light" className="text-blueCustom-700">
                {t("You can add this species, but it will be pending review from Admin.")}
              </Text>
            </div>
          </div>
        </When>
        <div className="mb-1 mt-9 flex gap-6 border-b pb-4">
          <div
            className={classNames({ "w-[75%]": props.withNumbers, "w-[50%]": !props.withNumbers })}
            ref={refTreeSpecies}
          >
            <Text variant="text-14-bold" className="uppercase text-black">
              {props.title}
            </Text>
            <Text variant="text-20-bold" className="text-primary">
              {props.value.length}
            </Text>
          </div>
          <div className={classNames({ "border-r pr-6": !props.withNumbers })} ref={refPlanted}>
            <Text variant="text-14-bold" className="uppercase text-black">
              {props.withNumbers ? "TREES TO BE PLANTED:" : "SPECIES PLANTED:"}
            </Text>
            <Text variant="text-20-bold" className="text-primary">
              {props.withNumbers ? props.value.reduce((total, v) => total + (v.amount || 0), 0) : "0"}
            </Text>
          </div>
          <When condition={!props.withNumbers}>
            <div className="" ref={refTotal}>
              <Text variant="text-14-bold" className="uppercase text-black">
                {"TOTAL PLANTED TO DATE:"}
              </Text>
              <Text variant="text-20-bold" className="text-primary">
                47,800
              </Text>
            </div>
          </When>
        </div>
        <List
          as="div"
          className=""
          itemAs={Fragment}
          uniqueId={"uuid"}
          items={props.value}
          render={(value, index) => (
            <div
              className={classNames("relative flex w-full items-center gap-6 border-b border-neutral-450 py-2", {
                "blur-sm": editIndex && editIndex !== value.uuid
              })}
            >
              <When condition={deleteIndex === value.uuid && deleteIndex}>
                <div className="absolute right-0 top-0 z-10 flex h-full w-full items-center justify-between bg-neutral-250 px-4 shadow-monitored">
                  <Text variant="text-16" className="text-blueCustom-700">
                    {t(`Are you sure you want to delete “${value.name}”?`)}
                  </Text>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setDeleteIndex(null);
                        handleDelete(props.value?.[index]?.uuid);
                      }}
                      className="text-16 text-error-500 underline underline-offset-2"
                    >
                      {t("Confirm")}
                    </button>
                    <button onClick={() => setDeleteIndex(null)} className="text-16 text-blueCustom-700">
                      {t("Cancel")}
                    </button>
                  </div>
                </div>
              </When>
              <When condition={editIndex === value.uuid}>
                <div className="absolute right-0 top-0 z-10 flex h-full w-full items-center gap-1 bg-neutral-250 px-4 shadow-monitored">
                  <Icon name={IconNames.EDIT_TA} className="min-h-6 min-w-6 h-6 w-6 text-primary" />
                  <Text variant="text-16" className="text-blueCustom-700">
                    {t("Editing: {name}", { name: value.name })}
                  </Text>
                </div>
              </When>
              <div
                style={
                  refTreeSpecies
                    ? {
                        width: `${refTreeSpecies.current?.clientWidth}px`,
                        minWidth: `${refTreeSpecies.current?.clientWidth}px`
                      }
                    : {}
                }
              >
                <div className="flex items-center gap-1">
                  <When condition={value.taxon_id == null}>
                    <Icon name={IconNames.NON_SCIENTIFIC_NAME} className="min-h-8 min-w-8 h-8 w-8" />
                  </When>
                  <When condition={false /* TODO */}>
                    <Icon name={IconNames.NEW_TAG_TREE_SPECIES} className="min-h-8 min-w-8 h-8 w-8" />
                  </When>
                  <Text variant="text-14-light" className="text-black ">
                    {t(value.name)}
                  </Text>
                </div>
              </div>
              <div
                className=""
                style={
                  refPlanted && props.withNumbers
                    ? {
                        width: `${refPlanted.current?.clientWidth}px`
                      }
                    : refPlanted && !props.withNumbers
                    ? {
                        width: `${refPlanted.current?.clientWidth}px`,
                        minWidth: `${refPlanted.current?.clientWidth}px`
                      }
                    : {}
                }
              >
                <Input
                  name="amount"
                  type="number"
                  variant="treePlanted"
                  defaultValue={props.withNumbers ? value.amount : ""}
                  placeholder={t("0")}
                  error={props.error?.[index]?.amount ? ({} as FieldError) : undefined}
                  onChange={e => (props.withNumbers ? handleUpdate({ ...value, amount: +e.target.value }) : {})}
                  onKeyDownCapture={onKeyDownCapture}
                  containerClassName=""
                />
              </div>
              <div className="flex flex-1 justify-end gap-6">
                <IconButton
                  iconProps={{ name: IconNames.EDIT_TA, width: 24 }}
                  className="text-blueCustom-700 hover:text-primary"
                  onClick={() => {
                    setValueAutoComplete(value.name ?? "");
                    setEditIndex(value.uuid ?? null);
                    setEditValue(value);
                    autoCompleteRef.current?.focus();
                  }}
                />
                <IconButton
                  iconProps={{ name: IconNames.TRASH_TA, width: 24 }}
                  className="text-blueCustom-700 hover:text-primary"
                  onClick={() => setDeleteIndex(value.uuid ?? null)}
                />
              </div>
            </div>
          )}
        />
        <When condition={!!props.error}>
          <ErrorMessage error={{ message: t("One or more values are missing"), type: "required" }} className="mt-5" />
        </When>
      </div>
    </InputWrapper>
  );
};

export default TreeSpeciesInput;
