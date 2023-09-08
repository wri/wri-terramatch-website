import { getRestorationInterventionTypeOptions } from "@/constants/options/restorationInterventionTypes";

test("snapShot test getRestorationInterventionTypeOptions", () => {
  const options = getRestorationInterventionTypeOptions();
  expect(options).toMatchSnapshot();
});
