import { Datagrid, FunctionField, ReferenceField, ReferenceManyField, SimpleShowLayout, TextField } from "react-admin";

import modules from "@/admin/modules";
import { FormLightDto } from "@/generated/v3/entityService/entityServiceSchemas";

const FundingProgrammeStages = () => {
  return (
    <SimpleShowLayout>
      <ReferenceManyField label="Stages" reference={modules.stage.ResourceName} target="funding_programme_id">
        <Datagrid>
          <TextField source="name" label="Stage Name" />
          <TextField source="order" label="Order" />
          <ReferenceField source="form.uuid" label="Form" reference={modules.form.ResourceName}>
            <FunctionField render={(record: FormLightDto) => `${record?.title ?? ""}`} />
          </ReferenceField>
        </Datagrid>
      </ReferenceManyField>
    </SimpleShowLayout>
  );
};

export default FundingProgrammeStages;
