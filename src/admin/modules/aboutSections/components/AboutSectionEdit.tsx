import { isEmpty } from "lodash";
import { FC } from "react";
import { Edit, SimpleForm, useRecordContext } from "react-admin";

import ShowActions from "@/admin/components/Actions/ShowActions";
import AboutSectionForm from "@/admin/modules/aboutSections/components/AboutSectionForm";
import AboutSectionToolbar from "@/admin/modules/aboutSections/components/AboutSectionToolbar";
import { useSectionTitle } from "@/admin/modules/aboutSections/util";
import { AboutSectionDto } from "@/generated/v3/entityService/entityServiceSchemas";

const AboutSectionEditActions: FC = () => {
  const record = useRecordContext();
  const title = useSectionTitle();

  // Deleting the default is not allowed.
  const deleteEnabled = record != null && !isEmpty((record as AboutSectionDto).frameworks);

  return (
    <ShowActions
      hasEdit={false}
      deleteProps={{
        confirmTitle: `Delete ${title}?`,
        confirmContent: "This action cannot be undone",
        mutationMode: "pessimistic"
      }}
      hasDelete={deleteEnabled}
    />
  );
};

const AboutSectionEdit: FC = () => (
  <Edit mutationMode="pessimistic" actions={<AboutSectionEditActions />} sx={{ marginBottom: 2, maxWidth: "100%" }}>
    <SimpleForm toolbar={<AboutSectionToolbar />}>
      <AboutSectionForm />
    </SimpleForm>
  </Edit>
);

export default AboutSectionEdit;
