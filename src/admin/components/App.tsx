import { WatchLater } from "@mui/icons-material";
import ArticleIcon from "@mui/icons-material/Article";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BusinessIcon from "@mui/icons-material/Business";
import ForestIcon from "@mui/icons-material/Forest";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import UserIcon from "@mui/icons-material/Group";
import LanguageIcon from "@mui/icons-material/Language";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import SummarizeIcon from "@mui/icons-material/Summarize";
import { Admin, Resource } from "react-admin";

import { authProvider } from "@/admin/apiProvider/authProvider";
import { dataProvider } from "@/admin/apiProvider/dataProviders";
import { AppLayout } from "@/admin/components/AppLayout";
import { theme } from "@/admin/components/theme";

import modules from "../modules";
import AdminLoginPage from "../pages/AdminLoginPage";

const App = () => (
  <Admin
    theme={theme}
    authProvider={authProvider}
    dataProvider={dataProvider}
    layout={AppLayout}
    loginPage={AdminLoginPage}
  >
    <Resource
      name={modules.user.ResourceName}
      list={modules.user.List}
      show={modules.user.Show}
      edit={modules.user.Edit}
      icon={UserIcon}
    />
    <Resource
      name={modules.organisation.ResourceName}
      list={modules.organisation.List}
      show={modules.organisation.Show}
      edit={modules.organisation.Edit}
      icon={BusinessIcon}
    />
    <Resource
      name={modules.pitch.ResourceName}
      list={modules.pitch.List}
      show={modules.pitch.Show}
      edit={modules.pitch.Edit}
      icon={ForestIcon}
    />
    <Resource
      name={modules.fundingProgramme.ResourceName}
      list={modules.fundingProgramme.List}
      edit={modules.fundingProgramme.Edit}
      show={modules.fundingProgramme.Show}
      create={modules.fundingProgramme.Create}
      icon={AttachMoneyIcon}
      options={{ label: "Funding Programmes" }}
    />
    <Resource
      name={modules.reportingFramework.ResourceName}
      list={modules.reportingFramework.List}
      show={modules.reportingFramework.Show}
      edit={modules.reportingFramework.Edit}
      create={modules.reportingFramework.Create}
      icon={WatchLater}
      options={{ label: "Reporting Frameworks" }}
    />
    <Resource
      name={modules.application.ResourceName}
      list={modules.application.List}
      show={modules.application.Show}
      icon={LibraryBooksIcon}
    />
    <Resource
      name={modules.stage.ResourceName}
      show={modules.stage.Show}
      edit={modules.stage.Edit}
      create={modules.stage.Create}
    />
    <Resource
      name={modules.form.ResourceName}
      list={modules.form.List}
      edit={modules.form.Edit}
      create={modules.form.Create}
    />
    <Resource
      name={modules.project.ResourceName}
      list={modules.project.List}
      show={modules.project.Show}
      edit={modules.project.Edit}
      icon={ArticleIcon}
    />
    <Resource
      name={modules.site.ResourceName}
      list={modules.site.List}
      show={modules.site.Show}
      edit={modules.site.Edit}
      icon={LanguageIcon}
    />
    <Resource
      name={modules.nursery.ResourceName}
      list={modules.nursery.List}
      show={modules.nursery.Show}
      edit={modules.nursery.Edit}
      icon={FullscreenIcon}
    />
    <Resource
      name={modules.projectReport.ResourceName}
      list={modules.projectReport.List}
      show={modules.projectReport.Show}
      edit={modules.projectReport.Edit}
      icon={SummarizeIcon}
      options={{ label: "Project Reports" }}
    />
    <Resource
      name={modules.siteReport.ResourceName}
      list={modules.siteReport.List}
      show={modules.siteReport.Show}
      edit={modules.siteReport.Edit}
      icon={SummarizeIcon}
      options={{ label: "Site Reports" }}
    />
    <Resource
      name={modules.nurseryReport.ResourceName}
      list={modules.nurseryReport.List}
      show={modules.nurseryReport.Show}
      edit={modules.nurseryReport.Edit}
      icon={SummarizeIcon}
      options={{ label: "Nursery Reports" }}
    />
    <Resource name={modules.audit.ResourceName} />
  </Admin>
);

export default App;
