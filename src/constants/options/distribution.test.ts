import { getDistributionOptions } from "@/constants/options/distribution";

test("snapShot test getDistributionOptions", () => {
  const options = getDistributionOptions();
  expect(options).toMatchSnapshot();
});
