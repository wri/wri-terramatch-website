import { Box, Typography } from "@mui/material";
import { FC } from "react";
import { Create, SimpleForm } from "react-admin";

import AboutSectionForm from "@/admin/modules/aboutSections/components/AboutSectionForm";

const AboutSectionCreate: FC = () => (
  <Create
    actions={
      <Box sx={{ display: "flex", alignItems: "center", paddingBottom: "12px" }}>
        <Typography variant="h4" component="h2" sx={{ flexGrow: 1 }}>
          Create About Section
        </Typography>
      </Box>
    }
    sx={{ marginBottom: 2, maxWidth: "100%" }}
  >
    <SimpleForm defaultValues={{}}>
      <AboutSectionForm />
    </SimpleForm>
  </Create>
);

export default AboutSectionCreate;
