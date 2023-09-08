import { ArrayField, Datagrid, ShowButton, TextField, useRecordContext } from "react-admin";

import modules from "../..";

const OrgShowButton = () => {
  const record = useRecordContext();

  return record ? (
    <ShowButton resource={modules.organisation.ResourceName} record={{ ...record, id: record.uuid }} />
  ) : null;
};

const FundingProgrammeOrganisations = () => {
  return (
    <ArrayField label="Organisations" source="organisations">
      <Datagrid bulkActionButtons={false}>
        <TextField source="name" />
        <OrgShowButton />
      </Datagrid>
    </ArrayField>
  );
};

export default FundingProgrammeOrganisations;
