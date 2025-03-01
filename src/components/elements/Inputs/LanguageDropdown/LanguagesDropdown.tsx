import { Popover } from "@headlessui/react";
import { useMediaQuery } from "@mui/material";
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
  const variantClass = props.variant ?? VARIANT_LANGUAGES_DROPDOWN;
  const isMobile = useMediaQuery("(max-width: 1200px)");
  const [selected, setSelected] = useState<Option>(languageForLocale(router.locale));

  const [selectedIndex, setSelectedIndex] = useState(LANGUAGES.findIndex(lang => lang.value === selected.value) || 0);
  let buttonRef = useRef<any>();

  useValueChanged(router.locale, () => {
    setSelected(languageForLocale(router.locale));
  });

  const onChange = (lang: Option) => {
    setSelected(lang);
    props.onChange?.(lang.value as string);
    buttonRef.current?.click();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      onChange(LANGUAGES[selectedIndex]);
    }
    if (event.key === "ArrowDown") {
      setSelectedIndex(prev => (prev + 1) % LANGUAGES.length);
    } else if (event.key === "ArrowUp") {
      setSelectedIndex(prev => (prev - 1 + LANGUAGES.length) % LANGUAGES.length);
    }
  };

  const mobileLanguages = LANGUAGES.filter(lang => lang.value !== "pt-BR" && lang.value !== "es-MX");

  return (
    <div onKeyDownCapture={handleKeyDown}>
      <Popover className={classNames(props.className, variantClass.classContent)}>
        <Popover.Button ref={buttonRef} className={variantClass.classButtonPopover}>
          <div className="flex items-start gap-2 mobile:items-center">
            <div>
              <Icon name={variantClass.icon} width={16} className={variantClass.classIcon} />
              <span className={variantClass.classTextDashboard}>{t(selected?.title.slice(0, 2))}</span>
            </div>
            <Icon name={variantClass.arrowIcon} width={8} className={variantClass.arrowDashboardClass} />
          </div>
          <span className={variantClass.classText}>{t(selected?.title)}</span>
          <Icon name={variantClass.arrowIcon} width={8} className={variantClass.arrowNavbarClass} />
        </Popover.Button>
        <Popover.Panel className={variantClass.classPanel}>
          <List
            items={isMobile || router.pathname.includes("dashboard") ? mobileLanguages : LANGUAGES}
            render={(item, index) => (
              <Text
                variant={selected.value === item.value ? "text-body-900" : "text-body-600"}
                className={classNames(variantClass.classItem, {
                  "bg-neutral-200": selectedIndex === index
                })}
                onClick={() => onChange(item)}
              >
                {(isMobile || selected.value === item.value) && (
                  <Icon
                    name={
                      isMobile
                        ? selected.value === item.value
                          ? IconNames.CHECK_LANGUAGES
                          : IconNames.NO_CHECK_LANGUAGES
                        : IconNames.CHECK
                    }
                    width={16}
                    className={variantClass.classIconSelected}
                  />
                )}
                {t(isMobile ? item.title.slice(0, 2) : item.title)}
              </Text>
            )}
            className={variantClass.classList}
          />
        </Popover.Panel>
      </Popover>
    </div>
  );
};

export default LanguagesDropdown;
