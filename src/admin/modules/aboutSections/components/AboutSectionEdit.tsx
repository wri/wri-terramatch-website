import { FC } from "react";
import { Edit, SimpleForm } from "react-admin";

import ShowTitle from "@/admin/components/ShowTitle";
import AboutSectionForm from "@/admin/modules/aboutSections/components/AboutSectionForm";

const AboutSectionEdit: FC = () => (
  <Edit mutationMode="pessimistic" title={<ShowTitle moduleName="AboutSections" />} sx={{ marginBottom: 2 }}>
    <SimpleForm>
      <AboutSectionForm />
    </SimpleForm>
  </Edit>
);

export default AboutSectionEdit;
