import { getLandUseTypeOptions } from "@/constants/options/landUseType";

test("snapShot test getLandUseTypeOptions", () => {
  const options = getLandUseTypeOptions();
  expect(options).toMatchSnapshot();
});
