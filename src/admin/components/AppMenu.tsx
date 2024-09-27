import classNames from "classnames";
import { Menu } from "react-admin";
import { useLocation } from "react-router-dom";

import modules from "../modules";

const AppMenu = () => {
  const location = useLocation();
  const hash = location.pathname.split("/")[1];
  return (
    <Menu className="!w-full">
      <div className={classNames({ "Sidebar-active": hash === "user" })}>
        <Menu.ResourceItem name={modules.user.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": hash === "organisation" })}>
        <Menu.ResourceItem name={modules.organisation.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": hash === "pitch" })}>
        <Menu.ResourceItem name={modules.pitch.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": hash === "fundingProgramme" })}>
        <Menu.ResourceItem name={modules.fundingProgramme.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": hash === "reportingFramework" })}>
        <Menu.ResourceItem name={modules.reportingFramework.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": hash === "application" })}>
        <Menu.ResourceItem name={modules.application.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": hash === "stage" })}>
        <Menu.ResourceItem name={modules.stage.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": hash === "form" })}>
        <Menu.ResourceItem name={modules.form.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": hash === "project" })}>
        <Menu.ResourceItem name={modules.project.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": hash === "site" })}>
        <Menu.ResourceItem name={modules.site.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": hash === "nursery" })}>
        <Menu.ResourceItem name={modules.nursery.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": hash === "task" })}>
        <Menu.ResourceItem name={modules.task.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": hash === "projectReport" })}>
        <Menu.ResourceItem name={modules.projectReport.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": hash === "siteReport" })}>
        <Menu.ResourceItem name={modules.siteReport.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": hash === "nurseryReport" })}>
        <Menu.ResourceItem name={modules.nurseryReport.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": hash === "audit" })}>
        <Menu.ResourceItem name={modules.audit.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": hash === "validationPolygon" })}>
        <Menu.ResourceItem name={modules.validatePolygonFile.ResourceName} />
      </div>
    </Menu>
  );
};
export default AppMenu;
