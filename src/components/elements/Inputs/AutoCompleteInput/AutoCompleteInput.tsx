import { Popover, Transition } from "@headlessui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { ChangeEvent, forwardRef, Fragment, Ref, useState } from "react";
import { Else, If, Then } from "react-if";

import { useDebounce } from "@/hooks/useDebounce";

import Text from "../../Text/Text";
import Input, { InputProps } from "../Input/Input";

export interface AutoCompleteInputProps extends InputProps {
  onSearch: (query: string) => Promise<string[]>;
  disableAutoComplete?: boolean;
  classNameMenu?: string;
  onSelected?: (item: string) => void;
}

//TODO: Bugfix: Users can enter space in this input
const AutoCompleteInput = forwardRef(
  (
    { onSearch, disableAutoComplete, classNameMenu, onSelected, ...inputProps }: AutoCompleteInputProps,
    ref?: Ref<HTMLInputElement>
  ) => {
    const t = useT();
    const [list, setList] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const onSelect = (item: string) => {
      if (inputProps.formHook) {
        inputProps.formHook.setValue(inputProps.name, item);
      } else {
        inputProps.onChange?.({ target: { name: inputProps.name, value: item } } as ChangeEvent<HTMLInputElement>);
      }

      onSelected?.(item);

      setList([]);
    };

    const search = useDebounce(async (query: string) => {
      setLoading(true);

      onSearch(query)
        .then(resp => {
          setList(resp);
          setLoading(false);
        })
        .catch(() => {
          setList([]);
          setLoading(false);
        });
    });

    return (
      <Popover as="div" className="w-full">
        <Popover.Button as={Fragment}>
          <Input
            {...inputProps}
            ref={ref}
            onChangeCapture={e => !disableAutoComplete && search(e.currentTarget.value)}
          />
        </Popover.Button>

        <Transition
          show={list.length > 0 || !!loading}
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Popover.Panel
            as="div"
            className={classNames("border-light mt-2 max-h-[230px] overflow-auto rounded-lg", classNameMenu)}
          >
            <If condition={loading}>
              <Then>
                <Text variant="text-body-600" className="p-3">
                  {t("Loading ...")}
                </Text>
              </Then>
              <Else>
                {list.map(item => (
                  <Text
                    key={item}
                    variant="text-body-600"
                    className="cursor-pointer p-3 hover:bg-neutral-100"
                    onClick={() => onSelect(item)}
                  >
                    {item}
                  </Text>
                ))}
              </Else>
            </If>
          </Popover.Panel>
        </Transition>
      </Popover>
    );
  }
);

export default AutoCompleteInput;
