import {
  getFarmersEngagementStrategyOptions,
  getWomenEngagementStrategyOptions,
  getYoungerThan35EngagementStrategyOptions
} from "@/constants/options/engagementStrategy";

describe("test ", () => {
  test("snapShot test getWomenEngagementStrategyOptions", () => {
    const options = getWomenEngagementStrategyOptions();
    expect(options).toMatchSnapshot();
  });

  test("snapShot test getFarmersEngagementStrategyOptions", () => {
    const options = getFarmersEngagementStrategyOptions();
    expect(options).toMatchSnapshot();
  });

  test("snapShot test getYoungerThan35EngagementStrategyOptions", () => {
    const options = getYoungerThan35EngagementStrategyOptions();
    expect(options).toMatchSnapshot();
  });
});
