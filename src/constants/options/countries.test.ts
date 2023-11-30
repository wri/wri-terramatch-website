import { getCountriesOptions } from "@/constants/options/countries";

test("snapShot getCountriesOptions", () => {
  const options = getCountriesOptions();
  expect(options).toMatchSnapshot();
});
