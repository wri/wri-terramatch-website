import { Typography } from "@mui/material";
import { Create, SimpleForm } from "react-admin";

import FundingForm from "./FundingForm";

export const FundingProgrammeCreate = () => (
  <Create>
    <Typography variant="h5" marginX="1rem" marginTop="1.75rem">
      Create Form
    </Typography>
    <SimpleForm defaultValues={{ stages: { data: [{}] } }} noValidate paddingY="1.5rem">
      <FundingForm />
    </SimpleForm>
  </Create>
);

export default FundingProgrammeCreate;
