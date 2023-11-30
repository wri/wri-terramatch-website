import { getStatusOptions } from "@/constants/options/status";

test("snapShot getStatusOptions", () => {
  const options = getStatusOptions();
  expect(options).toMatchSnapshot();
});
