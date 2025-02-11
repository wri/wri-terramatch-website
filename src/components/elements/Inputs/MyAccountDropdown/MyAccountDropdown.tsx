import { Popover } from "@headlessui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { useRouter } from "next/router";
import { PropsWithChildren, useRef, useState } from "react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import List from "@/components/extensive/List/List";

import Text from "../../Text/Text";
import { MyAccountDropdownVariant, VARIANT_MY_ACCOUNT_DROPDOWN } from "./MyAccountDropdownVariant";

export interface MyAccountDropdownProps {
  variant?: MyAccountDropdownVariant;
  className?: string;
}

const MyAccountDropdown = (props: PropsWithChildren<MyAccountDropdownProps>) => {
  const t = useT();
  const router = useRouter();
  const firstSegment = router.asPath.split("?")[0].split("/")[1];
  const [isOpen, setIsOpen] = useState(false);
  const variantClass = props.variant ?? VARIANT_MY_ACCOUNT_DROPDOWN;

  let buttonRef = useRef<any>();

  const OptionMyAccount = [
    {
      value: firstSegment === "dashboard" ? "Project Developer view" : "Dashboard View",
      title: firstSegment === "dashboard" ? "Project Developer view" : "Dashboard View",
      icon: IconNames.IC_SWITCH
    },
    {
      value: "Admin view",
      title: "Admin view",
      icon: IconNames.IC_SWITCH
    },
    {
      value: "Logout",
      title: "Logout",
      icon: IconNames.LOGOUT
    }
  ];

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
        <span className={variantClass.classText}>{t("MY ACCOUNT")}</span>
        <Icon name={variantClass.arrowIcon} width={8} className={variantClass.arrowNavbarClass} />
      </Popover.Button>

      <Popover.Panel className={variantClass.classPanel}>
        <List
          items={OptionMyAccount}
          render={item => (
            <Text variant="text-14" className={variantClass.classItem} onClick={() => {}}>
              <Icon name={item.icon} width={16} className={variantClass.classIconSelected} />

              {t(item.title)}
            </Text>
          )}
          className={variantClass.classList}
        />
      </Popover.Panel>
    </Popover>
  );
};

export default MyAccountDropdown;
