import { Dialog, Transition } from "@headlessui/react";
import { Fragment, PropsWithChildren } from "react";

interface DialogProps extends PropsWithChildren {
  open: boolean;
  onClose: () => void;
}

const _Dialog = (props: DialogProps) => {
  return (
    <Transition appear show={props.open} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={props.onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 w-full overflow-y-auto">
          <div className="flex min-h-full w-full items-center justify-center py-[140px] text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="shadow-xl w-full max-w-7xl transform overflow-hidden text-left align-middle transition-all">
                {props.children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default _Dialog;
