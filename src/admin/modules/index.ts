import { FormCreate } from "@/admin/modules/form/components/FormCreate";
import { FormEdit } from "@/admin/modules/form/components/FormEdit";
import { FormList } from "@/admin/modules/form/components/FormList";
import { StageCreate } from "@/admin/modules/stages/StageCreate";
import { StageEdit } from "@/admin/modules/stages/StageEdit";
import { StageShow } from "@/admin/modules/stages/StageShow";

import { ApplicationList } from "./application/components/ApplicationList";
import { ApplicationShow } from "./application/components/ApplicationShow";
import FundingProgrammeCreate from "./fundingProgrammes/components/FundingProgrammeCreate";
import FundingProgrammeEdit from "./fundingProgrammes/components/FundingProgrammeEdit";
import { FundingProgrammeList } from "./fundingProgrammes/components/FundingProgrammeList";
import { FundingProgrammeShow } from "./fundingProgrammes/components/FundingProgrammeShow";
import { OrganisationEdit } from "./organisations/components/OrganisationEdit";
import { OrganisationShow } from "./organisations/components/OrganisationShow";
import { OrganisationsList } from "./organisations/components/OrganisationsList";
import PitchEdit from "./pitch/components/PitchEdit";
import { PitchesList } from "./pitch/components/PitchesList";
import { PitchShow } from "./pitch/components/PitchShow";
import UserEdit from "./user/components/UserEdit";
import { UserList } from "./user/components/UserList";
import { UserShow } from "./user/components/UserShow";

const user = {
  ResourceName: "user",
  List: UserList,
  Show: UserShow,
  Edit: UserEdit
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

const modules = { user, organisation, pitch, application, fundingProgramme, stage, form };

export default modules;
