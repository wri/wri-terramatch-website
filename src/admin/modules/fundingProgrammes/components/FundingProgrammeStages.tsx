import { Datagrid, ReferenceManyField, SimpleShowLayout, TextField } from "react-admin";

import modules from "@/admin/modules";

const FundingProgrammeStages = () => {
  return (
    <SimpleShowLayout>
      <ReferenceManyField label="Stages" reference={modules.stage.ResourceName} target="funding_programme_id">
        <Datagrid>
          <TextField source="name" label="Stage Name" />
          <TextField source="order" label="Order" />
          <TextField source="form.title" label="Form" />
        </Datagrid>
      </ReferenceManyField>
    </SimpleShowLayout>
  );
};

export default FundingProgrammeStages;
