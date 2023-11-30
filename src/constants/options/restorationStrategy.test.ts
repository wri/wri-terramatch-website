import { getRestorationStrategyOptions } from "@/constants/options/restorationStrategy";

test("snapShot test getRestorationStrategy", () => {
  const options = getRestorationStrategyOptions();
  expect(options).toMatchSnapshot();
});
