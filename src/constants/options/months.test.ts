import { getMonthOptions } from "@/constants/options/months";

test("snapShot test getMonthOptions", () => {
  const options = getMonthOptions();
  expect(options).toMatchSnapshot();
});
