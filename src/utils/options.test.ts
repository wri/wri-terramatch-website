import { formatOptionsList, optionToChoices } from "./options";

describe("Test formatOptionsList", () => {
  test("to work as expected", () => {
    expect(
      formatOptionsList(
        [
          { title: "Option 1", value: "1" },
          { title: "Option 2", value: "2" },
          { title: "Option 3", value: "3" }
        ],

        "3"
      )
    ).toBe("Option 3");
  });
});

describe("Test optionToChoices", () => {
  test("to work as expected", () => {
    expect(
      optionToChoices([
        { title: "Option 1", value: "1" },
        { title: "Option 2", value: "2" },
        { title: "Option 3", value: "3" }
      ])
    ).toEqual([
      {
        id: "1",
        name: "Option 1"
      },
      {
        id: "2",
        name: "Option 2"
      },
      {
        id: "3",
        name: "Option 3"
      }
    ]);
  });
});
