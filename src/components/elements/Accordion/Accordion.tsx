import { Disclosure } from "@headlessui/react";
import classNames from "classnames";
import { PropsWithChildren } from "react";
import { When } from "react-if";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import Text from "../Text/Text";

export interface AccordionProps extends PropsWithChildren {
  title: string;
  className?: string;
  variant?: "default" | "secondary" | "drawer";
  defaultOpen?: boolean;
  ctaButtonProps?: {
    text: string;
    onClick: () => void;
  };
}

const Accordion = ({
  title,
  defaultOpen,
  variant = "default",
  className,
  ctaButtonProps,
  children
}: AccordionProps) => {
  return (
    <Disclosure
      as="div"
      defaultOpen={defaultOpen}
      className={classNames(className, {
        "rounded-lg border-2 border-neutral-100 shadow": variant === "default" || variant === "secondary"
      })}
    >
      {({ open }) => (
        <>
          <Disclosure.Button
            className={classNames(`flex w-full items-center justify-between`, {
              "px-15 py-9": variant === "default",
              "p-6 ": variant === "secondary"
            })}
          >
            <Text
              variant={
                variant === "secondary"
                  ? "text-heading-500"
                  : variant === "drawer"
                  ? "text-16-bold"
                  : "text-heading-700"
              }
              className="text-left"
            >
              {title}
            </Text>
            <div className="flex items-center space-x-6">
              <When condition={!!ctaButtonProps}>
                <Text
                  variant="text-body-600"
                  className="cursor-pointer underline"
                  role="button"
                  onClick={ctaButtonProps?.onClick}
                >
                  {ctaButtonProps?.text}
                </Text>
              </When>
              <Icon
                name={variant === "drawer" ? IconNames.CHEVRON_DOWN_PA : IconNames.CHEVRON_DOWN}
                width={16}
                className={`transform transition-all duration-300 ${open ? "rotate-180" : "rotate-0"}`}
              />
            </div>
          </Disclosure.Button>
          <When condition={variant === "default" && open}>
            <div className="h-[1px] w-full bg-neutral-400" />
          </When>
          <Disclosure.Panel
            className={classNames({
              "px-15 py-8": variant === "default",
              "px-6 pb-6": variant === "secondary",
              "pt-4": variant === "drawer"
            })}
          >
            {children}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Accordion;
