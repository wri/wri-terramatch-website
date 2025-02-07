import SummarizeIcon from "@mui/icons-material/Summarize";
import { Admin, Resource } from "react-admin";

import { authProvider } from "@/admin/apiProvider/authProvider";
import { dataProvider } from "@/admin/apiProvider/dataProviders";
import { AppLayout } from "@/admin/components/AppLayout";
import { theme } from "@/admin/components/theme";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { useMyUser } from "@/connections/User";
import { LoadingProvider } from "@/context/loaderAdmin.provider";
import LoginPage from "@/pages/auth/login/index.page";

import modules from "../modules";

const App = () => {
  const [, { user }] = useMyUser();
  if (user == null) return null;

  const canCreate = user.primaryRole === "admin-super";
  const isAdmin = user.primaryRole.includes("admin");
  return (
    <LoadingProvider>
      <Admin
        theme={theme}
        authProvider={authProvider}
        dataProvider={dataProvider}
        layout={AppLayout}
        loginPage={LoginPage}
      >
        {isAdmin && (
          <>
            <Resource
              name={modules.user.ResourceName}
              list={modules.user.List}
              show={modules.user.Show}
              edit={modules.user.Edit}
              create={modules.user.Create}
              icon={() => <Icon className="h-8 w-8" name={IconNames.USERS} />}
              recordRepresentation={record => `${record?.first_name} ${record?.last_name}`}
            />
            <Resource
              name={modules.organisation.ResourceName}
              list={modules.organisation.List}
              show={modules.organisation.Show}
              edit={modules.organisation.Edit}
              icon={() => <Icon className="h-8 w-8" name={IconNames.ORGANISATIONS} />}
              recordRepresentation={record => record?.name}
            />
            <Resource
              name={modules.pitch.ResourceName}
              list={modules.pitch.List}
              show={modules.pitch.Show}
              edit={modules.pitch.Edit}
              icon={() => <Icon className="h-8 w-8" name={IconNames.PITCHES} />}
              recordRepresentation={record => record?.project_name}
            />
            <Resource
              name={modules.fundingProgramme.ResourceName}
              list={modules.fundingProgramme.List}
              edit={modules.fundingProgramme.Edit}
              show={modules.fundingProgramme.Show}
              create={modules.fundingProgramme.Create}
              icon={() => <Icon className="h-8 w-8" name={IconNames.FUNDING_PROGRAMMES} />}
              options={{ label: "Funding Programmes" }}
              recordRepresentation={record => `Funding Programme "${record?.name}"`}
            />
            <Resource
              name={modules.reportingFramework.ResourceName}
              list={modules.reportingFramework.List}
              show={modules.reportingFramework.Show}
              edit={modules.reportingFramework.Edit}
              {...(canCreate ? { create: modules.reportingFramework.Create } : null)}
              icon={() => <Icon className="h-8 w-8" name={IconNames.REPORTING_FRAMEWORKS} />}
              options={{ label: "Reporting Frameworks" }}
            />
            <Resource
              name={modules.application.ResourceName}
              list={modules.application.List}
              show={modules.application.Show}
              icon={() => <Icon className="h-8 w-8" name={IconNames.APPLICATIONS} />}
              recordRepresentation={record => `${record?.id}`}
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
              icon={() => <Icon className="h-8 w-8" name={IconNames.FORMS} />}
              create={modules.form.Create}
              recordRepresentation={record => record?.project_name}
            />
          </>
        )}
        <Resource
          name={modules.project.ResourceName}
          list={modules.project.List}
          show={modules.project.Show}
          edit={modules.project.Edit}
          icon={() => <Icon className="h-8 w-8" name={IconNames.PROJECTS} />}
          recordRepresentation={record => record?.name ?? "<no project name>"}
        />
        <Resource
          name={modules.site.ResourceName}
          list={modules.site.List}
          show={modules.site.Show}
          edit={modules.site.Edit}
          icon={() => <Icon className="h-8 w-8" name={IconNames.SITES} />}
          recordRepresentation={record => record?.name ?? "<no site name>"}
        />
        <Resource
          name={modules.nursery.ResourceName}
          list={modules.nursery.List}
          show={modules.nursery.Show}
          edit={modules.nursery.Edit}
          icon={() => <Icon className="h-8 w-8" name={IconNames.NURSERIES} />}
          recordRepresentation={record => record?.name ?? "<no nursery name>"}
        />
        <Resource
          name={modules.task.ResourceName}
          list={modules.task.List}
          show={modules.task.Show}
          icon={SummarizeIcon}
          options={{ label: "Tasks" }}
          recordRepresentation={record => record?.project?.name}
        />
        <Resource
          name={modules.projectReport.ResourceName}
          list={modules.projectReport.List}
          show={modules.projectReport.Show}
          edit={modules.projectReport.Edit}
          icon={() => <Icon className="h-8 w-8" name={IconNames.REPORTS} />}
          options={{ label: "Project Reports" }}
          recordRepresentation={record => record?.title}
        />
        <Resource
          name={modules.siteReport.ResourceName}
          list={modules.siteReport.List}
          show={modules.siteReport.Show}
          edit={modules.siteReport.Edit}
          icon={() => <Icon className="h-8 w-8" name={IconNames.REPORTS} />}
          options={{ label: "Site Reports" }}
          recordRepresentation={record => record?.title}
        />
        <Resource
          name={modules.nurseryReport.ResourceName}
          list={modules.nurseryReport.List}
          show={modules.nurseryReport.Show}
          edit={modules.nurseryReport.Edit}
          icon={() => <Icon className="h-8 w-8" name={IconNames.REPORTS} />}
          options={{ label: "Nursery Reports" }}
          recordRepresentation={record => record?.title}
        />
        {isAdmin && (
          <>
            <Resource name={modules.audit.ResourceName} />
            <Resource
              name={modules.validatePolygonFile.ResourceName}
              list={modules.validatePolygonFile.List}
              icon={() => <Icon className="h-8 w-8" name={IconNames.REPORTS} />}
              options={{ label: "Test Polygon" }}
            />
          </>
        )}
      </Admin>
    </LoadingProvider>
  );
};

export default App;
