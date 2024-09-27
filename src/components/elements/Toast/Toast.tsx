import { Transition } from "@headlessui/react";
import classNames from "classnames";
import Lottie from "lottie-react";
import { FC, HTMLAttributes } from "react";

import ErrorLottie from "@/assets/animations/error.json";
import TickLottie from "@/assets/animations/tick.json";
import Text from "@/components/elements/Text/Text";
import PageSection from "@/components/extensive/PageElements/Section/PageSection";
import { ToastType, useToastContext } from "@/context/toast.provider";

interface IProps extends HTMLAttributes<HTMLDivElement> {}

const Toast: FC<IProps> = ({ className, ...rest }) => {
  const { details } = useToastContext();

  return (
    <Transition
      show={details.open}
      enter="transition-all ease-in duration-300 transform"
      enterFrom="translate-y-full opacity-0"
      enterTo="-translate-y-0 opacity-100"
      leave="transition-all ease-in duration-300 transform"
      leaveFrom="-translate-y-0"
      leaveTo="translate-y-full"
      className="fixed bottom-8 left-0 right-0 z-20 px-15"
    >
      <PageSection>
        <div
          role="alert"
          className={classNames(
            details.type === ToastType.SUCCESS && "bg-secondary-200",
            details.type === ToastType.ERROR && "bg-error-200",
            "flex w-fit-content items-center gap-3 rounded-xl px-6 py-5"
          )}
        >
          <Lottie
            animationData={details.type === ToastType.SUCCESS ? TickLottie : ErrorLottie}
            className={classNames(
              details.type === ToastType.SUCCESS && "h-6.5 w-6.5",
              details.type === ToastType.ERROR && "h-[2.1rem] w-[2.1rem]" // Blurry issue - needs creative fix
            )}
            loop={false}
          />

          <Text variant="text-bold-subtitle-500" className="relative top-[1px]">
            {details.text}
          </Text>
        </div>
      </PageSection>
    </Transition>
  );
};

export default Toast;
