import { Datagrid, ReferenceManyField, ShowButton, TextField } from "react-admin";

import modules from "../..";

const FundingProgrammeOrganisations = () => (
  <ReferenceManyField label="Organisations" reference={modules.organisation.ResourceName} target="organisationUuid">
    <Datagrid bulkActionButtons={false}>
      <TextField source="name" />
      <ShowButton />
    </Datagrid>
  </ReferenceManyField>
);

export default FundingProgrammeOrganisations;
