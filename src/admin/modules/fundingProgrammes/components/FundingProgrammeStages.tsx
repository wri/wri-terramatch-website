import { ArrayField, Datagrid, FunctionField, ReferenceField, SimpleShowLayout, TextField } from "react-admin";

import modules from "@/admin/modules";
import { FormLightDto } from "@/generated/v3/entityService/entityServiceSchemas";

const FundingProgrammeStages = () => (
  <SimpleShowLayout>
    <ArrayField label="Stages" source="stages">
      <Datagrid>
        <TextField source="name" label="Stage Name" />
        <ReferenceField source="formUuid" label="Form" reference={modules.form.ResourceName}>
          <FunctionField render={(record: FormLightDto) => `${record?.title ?? ""}`} />
        </ReferenceField>
      </Datagrid>
    </ArrayField>
  </SimpleShowLayout>
);

export default FundingProgrammeStages;
