import { Show } from "react-admin";

import ShowActions from "@/admin/components/Actions/ShowActions";
import ShowTitle from "@/admin/components/ShowTitle";

import ApplicationShowAside from "./ApplicationShowAside";
import { ApplicationTabs } from "./ApplicationTabs";
export const ApplicationShow = () => {
  return (
    <>
      <Show
        title={<ShowTitle moduleName="Application" getTitle={item => `${item?.id}`} />}
        actions={<ShowActions moduleName="Application" hasDelete={false} hasEdit={false} />}
        aside={<ApplicationShowAside />}
      >
        <ApplicationTabs />
      </Show>
    </>
  );
};
