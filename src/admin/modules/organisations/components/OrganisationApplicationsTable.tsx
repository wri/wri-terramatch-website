import { Typography } from "@mui/material";
import { Datagrid, FunctionField, ReferenceField, ReferenceManyField, TextField } from "react-admin";

import modules from "../..";
import { statusChoices } from "../../application/components/ApplicationList";

const OrganisationApplicationsTable = () => {
  return (
    <div>
      <Typography variant="h6" component="h3" mb={2}>
        Applications
      </Typography>
      <ReferenceManyField
        reference={modules.application.ResourceName}
        target="organisation_uuid"
        label={false}
        emptyText="Not Provided"
      >
        <Datagrid bulkActionButtons={false} rowClick="show">
          <ReferenceField
            source="funding_programme_uuid"
            reference={modules.fundingProgramme.ResourceName}
            label="Funding Programme"
          >
            <TextField label="Name" source="name" />
          </ReferenceField>
          <ReferenceField
            source="current_submission.stage.uuid"
            reference={modules.stage.ResourceName}
            label="Stage"
            sortable={false}
          >
            <TextField label="Stage" source="name" />
          </ReferenceField>
          <FunctionField
            label="Status"
            source="current_submission.status"
            render={(record: any) =>
              statusChoices.find(status => status.id === record?.current_submission?.status)?.name ||
              record?.current_submission?.status
            }
            sortable={false}
          />
        </Datagrid>
      </ReferenceManyField>
    </div>
  );
};

export default OrganisationApplicationsTable;
