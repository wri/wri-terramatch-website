import DefaultIcon from "@mui/icons-material/ViewList";
import classNames from "classnames";
import { createElement, FC } from "react";
import { Menu, useGetResourceLabel, useResourceDefinitions } from "react-admin";
import { useLocation } from "react-router-dom";

import Log from "@/utils/log";

import modules from "../modules";

const FilterClearMenuItem: FC<{ resourceName: string }> = ({ resourceName }) => {
  const resources = useResourceDefinitions();
  const getResourceLabel = useGetResourceLabel();
  const resource = resources?.[resourceName];
  if (resource == null) {
    Log.error("Resource not found for admin nav", { resourceName });
    return null;
  }

  return (
    // @ts-expect-error react-admin types fix
    <Menu.Item
      to={`/${resourceName}?filter=%7B%7D`}
      primaryText={getResourceLabel(resourceName, 2)}
      leftIcon={resource.icon ? createElement(resource.icon) : <DefaultIcon />}
    />
  );
};

const AppMenu = () => {
  const location = useLocation();
  const hash = location.pathname.split("/")[1];
  return (
    <Menu className="!w-full">
      <div className={classNames({ "Sidebar-active": hash === "user" })}>
        <FilterClearMenuItem resourceName={modules.user.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": hash === "organisation" })}>
        <FilterClearMenuItem resourceName={modules.organisation.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": hash === "fundingProgramme" })}>
        <FilterClearMenuItem resourceName={modules.fundingProgramme.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": hash === "reportingFramework" })}>
        <FilterClearMenuItem resourceName={modules.reportingFramework.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": hash === "application" })}>
        <FilterClearMenuItem resourceName={modules.application.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": hash === "form" })}>
        <FilterClearMenuItem resourceName={modules.form.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": hash === "project" })}>
        <FilterClearMenuItem resourceName={modules.project.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": hash === "site" })}>
        <FilterClearMenuItem resourceName={modules.site.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": hash === "nursery" })}>
        <FilterClearMenuItem resourceName={modules.nursery.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": hash === "task" })}>
        <FilterClearMenuItem resourceName={modules.task.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": hash === "projectReport" })}>
        <FilterClearMenuItem resourceName={modules.projectReport.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": hash === "siteReport" })}>
        <FilterClearMenuItem resourceName={modules.siteReport.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": hash === "nurseryReport" })}>
        <FilterClearMenuItem resourceName={modules.nurseryReport.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": hash === "financialReport" })}>
        <FilterClearMenuItem resourceName={modules.financialReport.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": hash === "impactStories" })}>
        <FilterClearMenuItem resourceName={modules.impactStories.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": hash === "disturbanceReport" })}>
        <FilterClearMenuItem resourceName={modules.disturbanceReport.ResourceName} />
      </div>
      <div className={classNames({ "Sidebar-active": hash === "srpReport" })}>
        <FilterClearMenuItem resourceName={modules.srpReport.ResourceName} />
      </div>
    </Menu>
  );
};
export default AppMenu;
