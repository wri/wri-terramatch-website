import React from "react";
import { Edit, SimpleForm, TextField } from "react-admin";

import FundingForm from "./FundingForm";
import FundingProgrammeTitle from "./FundingProgrammeTitle";

const FundingProgrammeEdit = () => {
  return (
    <Edit title={<FundingProgrammeTitle />} mutationMode="pessimistic">
      <TextField source="name" component="h5" variant="h5" className="mt-10" marginX="1rem" paddingTop="1.75rem" />
      <SimpleForm noValidate paddingY="1.5rem">
        <FundingForm />
      </SimpleForm>
    </Edit>
  );
};

export default FundingProgrammeEdit;
