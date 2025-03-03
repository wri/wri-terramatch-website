import { Popover } from "@headlessui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { useRouter } from "next/router";
import { PropsWithChildren, useMemo, useRef, useState } from "react";

import { removeAccessToken } from "@/admin/apiProvider/utils/token";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import List from "@/components/extensive/List/List";
import { useMyUser } from "@/connections/User";

import Text from "../../Text/Text";
import { MyAccountDropdownVariant, VARIANT_MY_ACCOUNT_DROPDOWN } from "./MyAccountDropdownVariant";

export interface MyAccountDropdownProps {
  variant?: MyAccountDropdownVariant;
  className?: string;
  isLoggedIn?: boolean;
}

const MyAccountDropdown = (props: PropsWithChildren<MyAccountDropdownProps>) => {
  const t = useT();
  const router = useRouter();
  const rootPath = router.asPath.split("?")[0].split("/")[1];
  const isOnDashboard = rootPath === "dashboard";
  const [loaded, { isAdmin }] = useMyUser();
  const variantClass = props.variant ?? VARIANT_MY_ACCOUNT_DROPDOWN;
  const [selectedIndex, setSelectedIndex] = useState(0);

  let buttonRef = useRef<any>();

  const OptionMyAccount = useMemo(() => {
    return props.isLoggedIn
      ? [
          {
            value: isOnDashboard ? (isAdmin ? "Admin view" : "Project Developer view") : "Dashboard",
            title: isOnDashboard ? (isAdmin ? "Admin view" : "Project Developer view") : "Dashboard",
            icon: IconNames.IC_SWITCH
          },
          {
            value: "Logout",
            title: "Logout",
            icon: IconNames.LOGOUT
          }
        ]
      : [
          {
            value: "Go To Login",
            title: "Go To Login",
            icon: IconNames.LOGOUT
          }
        ];
  }, [props.isLoggedIn, isOnDashboard, isAdmin]);

  const onChange = (item: any) => {
    if (item.value === "Go To Login") {
      router.push("/auth/login");
    } else if (item.value === "Logout") {
      removeAccessToken();
      router.push("/auth/login");
    } else {
      if (!loaded) return;
      if (isOnDashboard) {
        if (isAdmin) {
          router.push("/admin");
        }
        router.push("/home");
      } else {
        router.push("/dashboard");
      }
    }
    setTimeout(() => {
      router.reload();
    }, 1000);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      onChange(OptionMyAccount[selectedIndex]);
    }
    if (event.key === "ArrowDown") {
      setSelectedIndex(prev => (prev + 1) % OptionMyAccount.length);
    } else if (event.key === "ArrowUp") {
      setSelectedIndex(prev => (prev - 1 + OptionMyAccount.length) % OptionMyAccount.length);
    }
  };

  return (
    <div onKeyDownCapture={handleKeyDown}>
      <Popover className={classNames(props.className, variantClass.classContent)}>
        <Popover.Button ref={buttonRef} className={variantClass.classButtonPopover}>
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
            render={(item, index) => (
              <Text
                variant="text-14"
                className={classNames(variantClass.classItem, {
                  "bg-neutral-200": selectedIndex === index
                })}
                onClick={() => onChange(item)}
              >
                <Icon name={item.icon} width={16} className={variantClass.classIconSelected} />

                {t(item.title)}
              </Text>
            )}
            className={variantClass.classList}
          />
        </Popover.Panel>
      </Popover>
    </div>
  );
};

export default MyAccountDropdown;
