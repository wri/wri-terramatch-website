import { sustainableDevelopmentGoalsOptions } from "@/constants/options/sustainableDevelopmentGoals";

test("snapShot test sustainableDevelopmentGoalsOptions", () => {
  const options = sustainableDevelopmentGoalsOptions();
  expect(options).toMatchSnapshot();
});
