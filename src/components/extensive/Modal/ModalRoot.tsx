import { Dialog, Transition } from "@headlessui/react";
import classNames from "classnames";
import { Fragment } from "react";

import { useModalContext } from "@/context/modal.provider";

const ModalRoot = () => {
  const { modalContent, modalOpen, closeModal, coverToolbar } = useModalContext();

  return (
    <Transition appear show={modalOpen} as={Fragment}>
      <Dialog as="div" className={classNames("relative", coverToolbar ? "z-50" : "z-40")} onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Dialog.Panel className={classNames("fixed inset-0 flex w-full items-center justify-center p-4")}>
            {modalContent}
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default ModalRoot;
