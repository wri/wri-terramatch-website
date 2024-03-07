import { combineDataProviders } from "react-admin";

import { reportingFrameworkDataProvider } from "@/admin/apiProvider/dataProviders/reportingFrameworkDataProvider";
import { taskDataProvider } from "@/admin/apiProvider/dataProviders/taskDataProvider";
import modules from "@/admin/modules";

import { applicationDataProvider } from "./applicationDataProvider";
import { auditDataProvider } from "./auditDataProvider";
import { formDataProvider } from "./formDataProvider";
import { fundingProgrammeDataProvider } from "./fundingProgrammeDataProvider";
import { nurseryDataProvider } from "./nurseryDataProvider";
import { nurseryReportDataProvider } from "./nurseryReportDataProvider";
import { organisationDataProvider } from "./organisationDataProvider";
import { pitchDataProvider } from "./pitchDataProviders";
import { projectDataProvider } from "./projectDataProvider";
import { projectReportDataProvider } from "./projectReportDataProvider";
import { siteDataProvider } from "./siteDataProvider";
import { siteReportDataProvider } from "./siteReportDataProvider";
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

    case modules.reportingFramework.ResourceName:
      return reportingFrameworkDataProvider;

    case modules.stage.ResourceName:
      return stageDataProvider;

    case modules.form.ResourceName:
      return formDataProvider;

    case modules.project.ResourceName:
      return projectDataProvider;

    case modules.site.ResourceName:
      return siteDataProvider;

    case modules.nursery.ResourceName:
      return nurseryDataProvider;

    case modules.task.ResourceName:
      return taskDataProvider;

    case modules.projectReport.ResourceName:
      return projectReportDataProvider;

    case modules.siteReport.ResourceName:
      return siteReportDataProvider;

    case modules.nurseryReport.ResourceName:
      return nurseryReportDataProvider;

    case modules.audit.ResourceName:
      return auditDataProvider;

    default:
      throw new Error(`Unknown resource: ${resource}`);
  }
});
