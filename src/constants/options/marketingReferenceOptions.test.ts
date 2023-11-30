import { getMarketingReferenceOptions } from "@/constants/options/marketingReferenceOptions";

test("snapShot test getMarketingReferenceOptions", () => {
  const options = getMarketingReferenceOptions();
  expect(options).toMatchSnapshot();
});
