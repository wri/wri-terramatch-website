import { SaveButton, Toolbar, ToolbarClasses } from "react-admin";

import { CloneForm } from "@/admin/modules/form/components/CloneForm";
import { CopyFormToOtherEnv } from "@/admin/modules/form/components/CopyFormToOtherEnv";

import { TranslateButton } from "./TranslateButton";

export const FormToolbar = () => {
  return (
    <Toolbar>
      <div className={ToolbarClasses.defaultToolbar}>
        <SaveButton />

        <div>
          <TranslateButton />
          <CloneForm />
          <CopyFormToOtherEnv />
        </div>
      </div>
    </Toolbar>
  );
};
