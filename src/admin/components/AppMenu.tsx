// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
import { Menu } from "react-admin";
import { useLocation } from "react-router-dom";

import modules from "../modules";

const AppMenu = () => {
  const location = useLocation();
  //   const router = useRouter();

  //   useEffect(() => {
  //     const handleRouteChange = (url: any) => {
  //       console.log("Route changed to:", url);
  //     };

  //     router.events.on("routeChangeComplete", handleRouteChange);
  //   }, [router.events]);

  console.log(location);

  return (
    <Menu>
      <div className={`${location.hash === "#/user" && "bg-black"}`}>
        <Menu.ResourceItem name={modules.user.ResourceName} />
      </div>
      <Menu.ResourceItem name={modules.organisation.ResourceName} />
      <Menu.ResourceItem name={modules.pitch.ResourceName} />
      <Menu.ResourceItem name={modules.fundingProgramme.ResourceName} />
      <Menu.ResourceItem name={modules.reportingFramework.ResourceName} />
      <Menu.ResourceItem name={modules.application.ResourceName} />
      <Menu.ResourceItem name={modules.stage.ResourceName} />
      <Menu.ResourceItem name={modules.form.ResourceName} />
      <Menu.ResourceItem name={modules.project.ResourceName} />
      <Menu.ResourceItem name={modules.site.ResourceName} />
      <Menu.ResourceItem name={modules.nursery.ResourceName} />
      <Menu.ResourceItem name={modules.task.ResourceName} />
      <Menu.ResourceItem name={modules.projectReport.ResourceName} />
      <Menu.ResourceItem name={modules.siteReport.ResourceName} />
      <Menu.ResourceItem name={modules.nurseryReport.ResourceName} />
      <Menu.ResourceItem name={modules.airtable.ResourceName} />
      <Menu.ResourceItem name={modules.audit.ResourceName} />
    </Menu>
  );
};
export default AppMenu;
