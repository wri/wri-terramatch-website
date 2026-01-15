import { FC } from "react";
import { Show } from "react-admin";

import ShowActions from "@/admin/components/Actions/ShowActions";

import ApplicationShowAside from "./ApplicationShowAside";
import { ApplicationTabs } from "./ApplicationTabs";

export const ApplicationShow: FC = () => (
  <Show
    actions={<ShowActions moduleName="Application" hasDelete={false} hasEdit={false} />}
    aside={<ApplicationShowAside />}
  >
    <ApplicationTabs />
  </Show>
);
