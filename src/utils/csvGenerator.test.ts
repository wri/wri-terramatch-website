import { CSVGenerator } from "@/utils/csvGenerator";

describe("test CSV Generator", () => {
  test("", () => {
    const csv = new CSVGenerator();
    csv.pushRow(["ID", "Name", "Phone"]);
    csv.pushRow(["1", undefined, 5465466]);
    csv.pushRow(["2", "Milad", undefined]);
    csv.pushRow(["3", "Milad", "46546"]);

    expect(csv.getCSVText()).toMatchInlineSnapshot(`
      ""ID","Name","Phone"
      "1",,"5465466"
      "2","Milad",
      "3","Milad","46546""
    `);
  });
});
