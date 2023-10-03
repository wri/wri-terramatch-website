import { getFundingTypesOptions } from "@/constants/options/fundingTypes";

test("snapShot test getFundingTypesOptions", () => {
  const options = getFundingTypesOptions();
  expect(options).toMatchSnapshot();
});
