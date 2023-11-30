import { toArray } from "@/utils/array";

describe("test toArray", () => {
  test("undefined => []", () => {
    expect(toArray(undefined)).toStrictEqual([]);
  });

  test("null => []", () => {
    expect(toArray(null)).toStrictEqual([]);
  });

  test("'' => []", () => {
    expect(toArray("")).toStrictEqual([]);
  });

  test("'input' to ['input']", () => {
    expect(toArray("input")).toStrictEqual(["input"]);
  });

  test("[1,2,3,4] to [1,2,3,4]", () => {
    expect(toArray([1, 2, 3, 4])).toStrictEqual([1, 2, 3, 4]);
  });

  test(" 1  to [1]", () => {
    expect(toArray(1)).toStrictEqual([1]);
  });
});
