import { Typography } from "@mui/material";
import { FC } from "react";
import { Create, SimpleForm } from "react-admin";

import AboutSectionForm from "@/admin/modules/aboutSections/components/AboutSectionForm";

const AboutSectionCreate: FC = () => (
  <Create>
    <Typography variant="h5" marginX="1rem" marginTop="1.75rem">
      Create About Section
    </Typography>
    <SimpleForm defaultValues={{}}>
      <AboutSectionForm />
    </SimpleForm>
  </Create>
);

export default AboutSectionCreate;
