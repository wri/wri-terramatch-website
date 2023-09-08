import React, { Dispatch, ReactNode, SetStateAction, useContext, useMemo, useState } from "react";

type ModalContextType = {
  modalOpen: boolean;
  modalContent: ReactNode;
  coverToolbar: boolean;
  setModalContent: Dispatch<SetStateAction<ReactNode>>;
  openModal: (content: ReactNode, coverToolbar?: boolean) => void;
  closeModal: () => void;
};

export const ModalContext = React.createContext<ModalContextType>({
  modalOpen: false,
  modalContent: undefined,
  coverToolbar: false,
  setModalContent: () => {},
  openModal: () => {},
  closeModal: () => {}
});

type ModalProviderProps = {
  children: React.ReactNode;
};

const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<ReactNode>();
  const [_coverToolbar, setCoverToolbar] = useState<boolean>(false);

  /** Opens the modal and sets the content. */
  const openModal = (content: ReactNode, coverToolbar = false) => {
    setCoverToolbar(coverToolbar);
    setModalContent(content);
    setModalOpen(true);
  };

  /** Resets and closes the modal. */
  const closeModal = () => {
    setModalOpen(false);
  };

  // All exported values go here
  const value = useMemo(
    () => ({
      modalOpen,
      modalContent,
      setModalContent,
      openModal,
      closeModal,
      coverToolbar: _coverToolbar
    }),
    // eslint-disable-next-line
    [modalOpen, modalContent]
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};

export const useModalContext = () => useContext(ModalContext);

export default ModalProvider;
