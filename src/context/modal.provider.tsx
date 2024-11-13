import React, { ReactNode, useContext, useMemo, useState } from "react";

type ModalType = {
  id: string;
  content: ReactNode;
  coverToolbar: boolean;
  loading: boolean;
};

type ModalContextType = {
  modals: ModalType[];
  setModalContent: (id: string, content: ReactNode) => void;
  openModal: (id: string, content: ReactNode, coverToolbar?: boolean) => void;
  closeModal: (id: string) => void;
  setModalLoading: (id: string, loading: boolean) => void;
};

export const ModalContext = React.createContext<ModalContextType>({
  modals: [],
  setModalContent: () => {},
  openModal: () => {},
  closeModal: () => {},
  setModalLoading: () => {}
});

type ModalProviderProps = {
  children: React.ReactNode;
};

const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modals, setModals] = useState<ModalType[]>([]);

  /** Opens the modal and sets the content. */
  const openModal = (id: string, content: ReactNode, coverToolbar = false) => {
    setModals(prevModals => [...prevModals, { id, content, coverToolbar, loading: false }]);
  };

  /** Resets and closes the modal. */
  const closeModal = (id: string) => {
    setModals(prevModals => prevModals.filter(modal => modal.id !== id));
  };

  const setModalContent = (id: string, content: ReactNode) => {
    setModals(prevModals => prevModals.map(modal => (modal.id === id ? { ...modal, content } : modal)));
  };

  const setModalLoading = (id: string, loading: boolean) => {
    setModals(prevModals => prevModals.map(modal => (modal.id === id ? { ...modal, loading } : modal)));
  };

  const value = useMemo(
    () => ({
      modals,
      setModalContent,
      openModal,
      closeModal,
      setModalLoading
    }),
    [modals]
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};

export const useModalContext = () => useContext(ModalContext);

export default ModalProvider;
