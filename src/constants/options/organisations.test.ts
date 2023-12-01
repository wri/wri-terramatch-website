import { getOrganisationTypeOptions } from "@/constants/options/organisations";

test("snapShot test getOrganisationTypeOptions", () => {
  const options = getOrganisationTypeOptions();
  expect(options).toMatchSnapshot();
});
