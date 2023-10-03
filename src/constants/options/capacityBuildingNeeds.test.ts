import { getCapacityBuildingNeedOptions } from "@/constants/options/capacityBuildingNeeds";

test("snapShot test getCapacityBuildingNeedOptions", () => {
  const options = getCapacityBuildingNeedOptions();
  expect(options).toMatchSnapshot();
});
