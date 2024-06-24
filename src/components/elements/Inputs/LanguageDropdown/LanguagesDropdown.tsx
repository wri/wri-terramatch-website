import { Popover } from "@headlessui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { PropsWithChildren, useRef, useState } from "react";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import List from "@/components/extensive/List/List";
import { Option, OptionValue } from "@/types/common";

export interface DropdownProps {
  defaultValue?: OptionValue;
  onChange?: (value: OptionValue) => void;
  className?: string;
}

const LanguagesDropdown = (props: PropsWithChildren<DropdownProps>) => {
  const t = useT();
  const Languages: Option[] = [
    { value: "en-US", title: t("English") },
    { value: "es-MX", title: t("Spanish") },
    { value: "fr-FR", title: t("French") },
    { value: "pt-BR", title: t("Portuguese") }
  ];

  const [selected, setSelected] = useState<Option>(Languages[0]);
  let buttonRef = useRef<any>();

  const onChange = (lang: Option) => {
    setSelected(lang);
    props.onChange?.(lang.value);
    buttonRef.current?.click();
  };

  return (
    <Popover className={classNames(props.className, "relative w-fit")}>
      <Popover.Button ref={buttonRef} className="flex items-center justify-between p-2">
        <Icon name={IconNames.EARTH} width={16} className="mr-2 fill-neutral-700" />
        <span className="text-14-light mr-2 whitespace-nowrap text-sm uppercase text-darkCustom">
          {selected?.title}
        </span>
        <Icon
          name={IconNames.TRIANGLE_DOWN}
          width={8}
          className="fill-neutral-700 transition ui-open:rotate-180 ui-open:transform"
        />
      </Popover.Button>

      <Popover.Panel className="border-1 absolute right-0 z-50 mt-4 w-[130px]  border border-neutral-300 bg-white shadow">
        <List
          items={Languages}
          render={item => (
            <Text
              variant={selected.value === item.value ? "text-body-900" : "text-body-600"}
              className={classNames("px-3 py-1 uppercase text-neutral-900 first:pt-2  last:pb-2 hover:bg-neutral-200")}
              onClick={() => onChange(item)}
            >
              {item.title}
            </Text>
          )}
        />
      </Popover.Panel>
    </Popover>
  );
};

export default LanguagesDropdown;
