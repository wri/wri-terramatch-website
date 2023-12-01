import { Typography } from "@mui/material";
import { Create, SimpleForm } from "react-admin";

import { FormBuilderForm } from "@/admin/modules/form/components/FormBuilder";

export const FormCreate = () => {
  return (
    <Create>
      <Typography variant="h5" marginX="1rem" marginTop="1.75rem">
        Create Form
      </Typography>
      <SimpleForm defaultValues={{ form_sections: [{}] }} noValidate paddingY="1.5rem">
        <FormBuilderForm />
      </SimpleForm>
    </Create>
  );
};
