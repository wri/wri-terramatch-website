import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BusinessIcon from "@mui/icons-material/Business";
import ForestIcon from "@mui/icons-material/Forest";
import UserIcon from "@mui/icons-material/Group";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
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
  </Admin>
);

export default App;
