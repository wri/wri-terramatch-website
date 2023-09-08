import { renderHook } from "@testing-library/react";

import { wait } from "@/utils/test-utils";

import { useDebounce } from "./useDebounce";

describe("Test useDebounce hook", () => {
  let func: jest.Mock;
  let debouncedFunc: Function;

  beforeEach(() => {
    func = jest.fn();
    debouncedFunc = renderHook(() => useDebounce(func, 500)).result.current;
  });

  test("Execute just once", async () => {
    //Fast execute for 100times
    for (let i = 0; i < 100; i++) {
      debouncedFunc();
    }

    //Wait for 500 to debounce get's fired
    await wait(500);

    expect(func).toBeCalledTimes(1);
  });

  test("Execute just twice", async () => {
    for (let i = 0; i < 100; i++) {
      debouncedFunc();

      if (i === 30) {
        //Wait for 500 to debounce get's fired once
        await wait(500);
      }
    }

    //Wait for 500 to debounce get's fired
    await wait(500);

    expect(func).toBeCalledTimes(2);
  });

  test("To pass arguments", async () => {
    const expected = { id: 3234, name: "3Sidedcube" };

    debouncedFunc(expected);
    await wait(500);

    expect(func).toBeCalledWith(expected);
  });
});
