import { EntityEdit } from "@/admin/components/EntityEdit/EntityEdit";
import { FormCreate } from "@/admin/modules/form/components/FormCreate";
import { FormEdit } from "@/admin/modules/form/components/FormEdit";
import { FormList } from "@/admin/modules/form/components/FormList";
import { ReportingFrameworkCreate } from "@/admin/modules/reportingFramework/components/ReportingFrameworkCreate";
import { ReportingFrameworkEdit } from "@/admin/modules/reportingFramework/components/ReportingFrameworkEdit";
import { ReportingFrameworkList } from "@/admin/modules/reportingFramework/components/ReportingFrameworkList";
import { ReportingFrameworkShow } from "@/admin/modules/reportingFramework/components/ReportingFrameworkShow";
import { StageCreate } from "@/admin/modules/stages/StageCreate";
import { StageEdit } from "@/admin/modules/stages/StageEdit";
import { StageShow } from "@/admin/modules/stages/StageShow";
import TaskShow from "@/admin/modules/tasks/components/TaskShow";
import { TasksList } from "@/admin/modules/tasks/components/TasksList";
import ValidatePolygonFileShow from "@/admin/modules/validationPolygonFile/components/ValidationPolygonFileShow";

import { ApplicationList } from "./application/components/ApplicationList";
import { ApplicationShow } from "./application/components/ApplicationShow";
import FundingProgrammeCreate from "./fundingProgrammes/components/FundingProgrammeCreate";
import FundingProgrammeEdit from "./fundingProgrammes/components/FundingProgrammeEdit";
import { FundingProgrammeList } from "./fundingProgrammes/components/FundingProgrammeList";
import { FundingProgrammeShow } from "./fundingProgrammes/components/FundingProgrammeShow";
import { ImpactStoriesList } from "./impactStories/components/ImpactStoriesList";
import { NurseriesList } from "./nurseries/components/NurseriesList";
import NurseryShow from "./nurseries/components/NurseryShow";
import NurseryReportShow from "./nurseryReports/components/NurseryReportShow";
import { NurseryReportsList } from "./nurseryReports/components/NurseryReportsList";
import { OrganisationEdit } from "./organisations/components/OrganisationEdit";
import { OrganisationShow } from "./organisations/components/OrganisationShow";
import { OrganisationsList } from "./organisations/components/OrganisationsList";
import PitchEdit from "./pitch/components/PitchEdit";
import { PitchesList } from "./pitch/components/PitchesList";
import { PitchShow } from "./pitch/components/PitchShow";
import ProjectReportShow from "./projectReports/components/ProjectReportShow";
import { ProjectReportsList } from "./projectReports/components/ProjectReportsList";
import ProjectShow from "./projects/components/ProjectShow";
import { ProjectsList } from "./projects/components/ProjectsList";
import SiteReportShow from "./siteReports/components/SiteReportShow";
import { SiteReportsList } from "./siteReports/components/SiteReportsList";
import SiteShow from "./sites/components/SiteShow";
import { SitesList } from "./sites/components/SitesList";
import UserCreate from "./user/components/UserCreate";
import UserEdit from "./user/components/UserEdit";
import { UserList } from "./user/components/UserList";
import { UserShow } from "./user/components/UserShow";

const user = {
  ResourceName: "user",
  List: UserList,
  Show: UserShow,
  Edit: UserEdit,
  Create: UserCreate
};

const organisation = {
  ResourceName: "organisation",
  List: OrganisationsList,
  Show: OrganisationShow,
  Edit: OrganisationEdit
};

const pitch = {
  ResourceName: "pitch",
  List: PitchesList,
  Show: PitchShow,
  Edit: PitchEdit
};

const fundingProgramme = {
  ResourceName: "fundingProgramme",
  List: FundingProgrammeList,
  Edit: FundingProgrammeEdit,
  Show: FundingProgrammeShow,
  Create: FundingProgrammeCreate
};

const application = {
  ResourceName: "application",
  List: ApplicationList,
  Show: ApplicationShow
};

const stage = {
  ResourceName: "stage",
  Show: StageShow,
  Edit: StageEdit,
  Create: StageCreate
};

const form = {
  ResourceName: "form",
  List: FormList,
  Edit: FormEdit,
  Create: FormCreate
};

const reportingFramework = {
  ResourceName: "reportingFramework",
  List: ReportingFrameworkList,
  Show: ReportingFrameworkShow,
  Edit: ReportingFrameworkEdit,
  Create: ReportingFrameworkCreate
};

const project = {
  ResourceName: "project",
  List: ProjectsList,
  Show: ProjectShow,
  Edit: EntityEdit
};

const site = {
  ResourceName: "site",
  List: SitesList,
  Show: SiteShow,
  Edit: EntityEdit
};

const nursery = {
  ResourceName: "nursery",
  List: NurseriesList,
  Show: NurseryShow,
  Edit: EntityEdit
};

const task = {
  ResourceName: "task",
  List: TasksList,
  Show: TaskShow
};

const projectReport = {
  ResourceName: "projectReport",
  List: ProjectReportsList,
  Show: ProjectReportShow,
  Edit: EntityEdit
};

const siteReport = {
  ResourceName: "siteReport",
  List: SiteReportsList,
  Show: SiteReportShow,
  Edit: EntityEdit
};

const nurseryReport = {
  ResourceName: "nurseryReport",
  List: NurseryReportsList,
  Show: NurseryReportShow,
  Edit: EntityEdit
};

const audit = {
  ResourceName: "audit"
};

const validatePolygonFile = {
  ResourceName: "validatePolygonFile",
  List: ValidatePolygonFileShow
};

const impactStories = {
  ResourceName: "impactStories",
  List: ImpactStoriesList,
  Edit: <div>Edit</div>
};

const modules = {
  user,
  organisation,
  pitch,
  application,
  fundingProgramme,
  reportingFramework,
  stage,
  form,
  project,
  site,
  nursery,
  task,
  projectReport,
  siteReport,
  nurseryReport,
  audit,
  validatePolygonFile,
  impactStories
};

export default modules;
