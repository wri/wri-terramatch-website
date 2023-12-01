import { getEntitiesOptions } from "@/constants/options/entities";

test("snapShot getEntitiesOptions", () => {
  const options = getEntitiesOptions();
  expect(options).toMatchSnapshot();
});
