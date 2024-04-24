import classNames from "classnames";
import { Menu } from "react-admin";
import { useLocation } from "react-router-dom";

import modules from "../modules";

const AppMenu = () => {
  const location = useLocation();
  return (
    <Menu>
      <div className={classNames({ "Sidebar-active": location.pathname.split("/")[1] === "user" })}>
        <Menu.ResourceItem name={modules.user.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": location.pathname.split("/")[1] === "organisation" })}>
        <Menu.ResourceItem name={modules.organisation.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": location.pathname.split("/")[1] === "pitch" })}>
        <Menu.ResourceItem name={modules.pitch.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": location.pathname.split("/")[1] === "fundingProgramme" })}>
        <Menu.ResourceItem name={modules.fundingProgramme.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": location.pathname.split("/")[1] === "reportingFramework" })}>
        <Menu.ResourceItem name={modules.reportingFramework.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": location.pathname.split("/")[1] === "application" })}>
        <Menu.ResourceItem name={modules.application.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": location.pathname.split("/")[1] === "stage" })}>
        <Menu.ResourceItem name={modules.stage.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": location.pathname.split("/")[1] === "form" })}>
        <Menu.ResourceItem name={modules.form.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": location.pathname.split("/")[1] === "project" })}>
        <Menu.ResourceItem name={modules.project.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": location.pathname.split("/")[1] === "site" })}>
        <Menu.ResourceItem name={modules.site.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": location.pathname.split("/")[1] === "nursery" })}>
        <Menu.ResourceItem name={modules.nursery.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": location.pathname.split("/")[1] === "task" })}>
        <Menu.ResourceItem name={modules.task.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": location.pathname.split("/")[1] === "projectReport" })}>
        <Menu.ResourceItem name={modules.projectReport.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": location.pathname.split("/")[1] === "siteReport" })}>
        <Menu.ResourceItem name={modules.siteReport.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": location.pathname.split("/")[1] === "nurseryReport" })}>
        <Menu.ResourceItem name={modules.nurseryReport.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": location.pathname.split("/")[1] === "airtable" })}>
        <Menu.ResourceItem name={modules.airtable.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": location.pathname.split("/")[1] === "audit" })}>
        <Menu.ResourceItem name={modules.audit.ResourceName} />
      </div>
    </Menu>
  );
};
export default AppMenu;
