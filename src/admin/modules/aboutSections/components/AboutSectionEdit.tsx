import { Typography } from "@mui/material";
import { FC } from "react";
import { Edit, SimpleForm } from "react-admin";

import AboutSectionForm from "@/admin/modules/aboutSections/components/AboutSectionForm";

const AboutSectionEdit: FC = () => (
  <Edit mutationMode="pessimistic" sx={{ marginBottom: 2, maxWidth: "100%" }}>
    <Typography variant="h5" marginX="1rem" marginTop="1.75rem" className="w-full">
      Edit Existing About Section
    </Typography>
    <SimpleForm>
      <AboutSectionForm />
    </SimpleForm>
  </Edit>
);

export default AboutSectionEdit;
