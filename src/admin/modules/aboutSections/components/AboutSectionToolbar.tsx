import { Button } from "@mui/material";
import { FC, useCallback, useState } from "react";
import { SaveButton, Toolbar, ToolbarClasses, useRecordContext } from "react-admin";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { pushAboutSectionTranslations } from "@/connections/AboutSection";
import { AboutSectionDto } from "@/generated/v3/entityService/entityServiceSchemas";
import ApiSlice from "@/store/apiSlice";

const AboutSectionTranslateButton: FC = () => {
  const section = useRecordContext<AboutSectionDto>();
  const [isPushing, setIsPushing] = useState(false);

  const pushTranslations = useCallback(async () => {
    if (section?.id == null || isPushing) return;

    // Make sure we don't have a stashed resource from a previous translation run with this id
    ApiSlice.pruneCache("formTranslations", [section.id]);

    setIsPushing(true);
    await pushAboutSectionTranslations({ id: section.id });
    setIsPushing(false);
  }, [isPushing, section.id]);

  return (
    <Button onClick={pushTranslations}>
      {isPushing ? (
        <Icon name={IconNames.SPINNER} className="h-5 w-5 animate-spin lg:h-6 lg:w-6" />
      ) : (
        <Icon name={IconNames.UPLOAD_PA} className="h-5 w-5 lg:h-6 lg:w-6" />
      )}
      Push Translations
    </Button>
  );
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
