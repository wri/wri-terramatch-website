import { renderHook } from "@testing-library/react";
import { act } from "react-dom/test-utils";

import { wait } from "@/utils/test-utils";

import ModalProvider, { useModalContext } from "./modal.provider";

const Modal1 = <div data-testid="modal-content-1" />;
const Modal2 = <div data-testid="modal-content-2" />;

describe("Modal context provider", () => {
  test("openModal is opening the modals", async () => {
    const { result } = renderHook(() => useModalContext(), {
      wrapper: ({ children }) => <ModalProvider>{children}</ModalProvider>
    });

    act(() => result.current.openModal("modal1", Modal1));
    act(() => result.current.openModal("modal2", Modal2));

    expect(result.current.modals).toHaveLength(2);
    expect(result.current.modals[0].content).toEqual(Modal1);
    expect(result.current.modals[1].content).toEqual(Modal2);
  });

  test("closeModal is closing a specific modal", async () => {
    const { result } = renderHook(() => useModalContext(), {
      wrapper: ({ children }) => <ModalProvider>{children}</ModalProvider>
    });

    act(() => result.current.openModal("modal1", Modal1));
    await wait(200);
    act(() => result.current.openModal("modal2", Modal2));
    await wait(200);

    act(() => result.current.closeModal("modal1"));
    await wait(200);

    expect(result.current.modals).toHaveLength(1);
    expect(result.current.modals[0].content).toEqual(Modal2);
  });

  test("setModalContent is updating modal content", async () => {
    const { result } = renderHook(() => useModalContext(), {
      wrapper: ({ children }) => <ModalProvider>{children}</ModalProvider>
    });

    act(() => result.current.openModal("modal1", Modal1));
    act(() => result.current.setModalContent("modal1", Modal2));

    expect(result.current.modals).toHaveLength(1);
    expect(result.current.modals[0].content).toEqual(Modal2);
  });
});
