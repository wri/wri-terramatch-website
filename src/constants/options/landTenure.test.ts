import { getLandTenureOptions } from "@/constants/options/landTenure";

test("snapShot test getLandTenureOptions", () => {
  const options = getLandTenureOptions();
  expect(options).toMatchSnapshot();
});
