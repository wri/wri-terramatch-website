import { Popover } from "@headlessui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { useRouter } from "next/router";
import { PropsWithChildren, useRef, useState } from "react";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import List from "@/components/extensive/List/List";
import { useValueChanged } from "@/hooks/useValueChanged";
import { Option, OptionValue } from "@/types/common";

import { LanguagesDropdownVariant, VARIANT_LANGUAGES_DROPDOWN } from "./LanguagesDropdownVariant";

export interface DropdownProps {
  defaultValue?: OptionValue;
  onChange?: (value: string) => void;
  className?: string;
  variant?: LanguagesDropdownVariant;
}

const LANGUAGES: Option[] = [
  { value: "en-US", title: "English" },
  { value: "es-MX", title: "Spanish" },
  { value: "fr-FR", title: "French" },
  { value: "pt-BR", title: "Portuguese" }
];

const languageForLocale = (locale?: string | null) => LANGUAGES.find(({ value }) => value === locale) ?? LANGUAGES[0];

const LanguagesDropdown = (props: PropsWithChildren<DropdownProps>) => {
  const t = useT();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const variantClass = props.variant ?? VARIANT_LANGUAGES_DROPDOWN;

  const [selected, setSelected] = useState<Option>(languageForLocale(router.locale));
  let buttonRef = useRef<any>();

  useValueChanged(router.locale, () => {
    setSelected(languageForLocale(router.locale));
  });

  const onChange = (lang: Option) => {
    setSelected(lang);
    props.onChange?.(lang.value as string);
    buttonRef.current?.click();
  };

  return (
    <Popover
      className={classNames(props.className, variantClass.classContent, {
        [variantClass.classContentOpen]: isOpen
      })}
    >
      <Popover.Button ref={buttonRef} className={variantClass.classButtonPopover} onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-2">
          <Icon name={variantClass.icon} width={16} className={variantClass.classIcon} />
          <Icon name={variantClass.arrowIcon} width={8} className={variantClass.arrowDashboardClass} />
        </div>
        <span className={variantClass.classText}>{t(selected?.title)}</span>
        <Icon name={variantClass.arrowIcon} width={8} className={variantClass.arrowNavbarClass} />
      </Popover.Button>

      <Popover.Panel className={variantClass.classPanel}>
        <List
          items={LANGUAGES}
          render={item => (
            <Text
              variant={selected.value === item.value ? "text-body-900" : "text-body-600"}
              className={variantClass.classItem}
              onClick={() => onChange(item)}
            >
              {selected.value === item.value && (
                <Icon name={IconNames.CHECK} width={16} className={variantClass.classIconSelected} />
              )}
              {t(item.title)}
            </Text>
          )}
          className={variantClass.classList}
        />
      </Popover.Panel>
    </Popover>
  );
};

export default LanguagesDropdown;
