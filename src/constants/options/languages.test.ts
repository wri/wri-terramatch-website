import { getLanguageOptions } from "@/constants/options/languages";

test("snapShot test getLanguageOptions", () => {
  const options = getLanguageOptions();
  expect(options).toMatchSnapshot();
});
