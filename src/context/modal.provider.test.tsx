import { renderHook } from "@testing-library/react";

import { wait } from "@/utils/test-utils";

import ModalProvider, { useModalContext } from "./modal.provider";

const Modal = <div data-testid="modal-content" />;

describe("Modal context provider", () => {
  test("openModal is opening the modal", async () => {
    const { result } = renderHook(() => useModalContext(), {
      wrapper: props => <ModalProvider>{props.children}</ModalProvider>
    });

    result.current.openModal(Modal);
    await wait(200);

    expect(result.current.modalOpen).toEqual(true);
    expect(result.current.modalContent).toEqual(Modal);
  });

  test("closeModal is closing the modal", async () => {
    const { result } = renderHook(() => useModalContext(), {
      wrapper: props => <ModalProvider>{props.children}</ModalProvider>
    });

    result.current.openModal(Modal);
    await wait(200);

    result.current.closeModal();
    await wait(200);

    expect(result.current.modalOpen).toEqual(false);
  });

  test("setModalContent is updating modal content", async () => {
    const { result } = renderHook(() => useModalContext(), {
      wrapper: props => <ModalProvider>{props.children}</ModalProvider>
    });

    result.current.setModalContent(Modal);
    await wait(200);

    expect(result.current.modalContent).toEqual(Modal);
  });
});
