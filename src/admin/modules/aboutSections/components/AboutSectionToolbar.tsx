import { FC } from "react";
import { SaveButton, Toolbar, ToolbarClasses, useRecordContext } from "react-admin";

import { PushTranslationsButton } from "@/admin/components/PushTranslationsButton";
import { pushAboutSectionTranslations } from "@/connections/AboutSection";
import { AboutSectionDto } from "@/generated/v3/entityService/entityServiceSchemas";

const AboutSectionTranslateButton: FC = () => {
  const section = useRecordContext<AboutSectionDto>();

  return <PushTranslationsButton uuid={section?.id} push={pushAboutSectionTranslations} />;
};

const AboutSectionToolbar: FC = () => (
  <Toolbar>
    <div className={ToolbarClasses.defaultToolbar}>
      <SaveButton />

      <div>
        <AboutSectionTranslateButton />
      </div>
    </div>
  </Toolbar>
);

export default AboutSectionToolbar;
