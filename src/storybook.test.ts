import initStoryShots, { multiSnapshotWithOptions } from "@storybook/addon-storyshots";

import { render } from "./utils/test-utils";

jest.mock("next/router", () => require("next-router-mock"));

initStoryShots({
  framework: "react",
  renderer: render,
  storyKindRegex: /^((?!.*?Map).)*$/, //To skip map from snapshot testing
  test: multiSnapshotWithOptions({})
});
