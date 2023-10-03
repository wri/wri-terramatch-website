import { combineDataProviders } from "react-admin";

import modules from "@/admin/modules";

import { applicationDataProvider } from "./applicationDataProvider";
import { formDataProvider } from "./formDataProvider";
import { fundingProgrammeDataProvider } from "./fundingProgrammeDataProvider";
import { organisationDataProvider } from "./organisationDataProvider";
import { pitchDataProvider } from "./pitchDataProviders";
import { stageDataProvider } from "./stageDataProvider";
import { userDataProvider } from "./userDataProvider";

//@ts-ignore
export const dataProvider = combineDataProviders(resource => {
  switch (resource) {
    case modules.user.ResourceName:
      return userDataProvider;

    case modules.organisation.ResourceName:
      return organisationDataProvider;

    case modules.pitch.ResourceName:
      return pitchDataProvider;

    case modules.application.ResourceName:
      return applicationDataProvider;

    case modules.fundingProgramme.ResourceName:
      return fundingProgrammeDataProvider;

    case modules.stage.ResourceName:
      return stageDataProvider;

    case modules.form.ResourceName:
      return formDataProvider;

    default:
      throw new Error(`Unknown resource: ${resource}`);
  }
});
