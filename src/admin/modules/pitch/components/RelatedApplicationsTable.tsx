import { Card, Typography } from "@mui/material";
import {
  Datagrid,
  FilterPayload,
  FunctionField,
  ListBase,
  Pagination,
  ReferenceField,
  TextField,
  useRecordContext
} from "react-admin";

import modules from "../..";
import { statusChoices } from "../../application/components/ApplicationList";

const RelatedApplicationsTable = ({ filters }: { filters?: FilterPayload }) => {
  const record = useRecordContext<any>();

  return (
    record && (
      <ListBase resource={modules.application.ResourceName} filter={filters || { project_pitch_uuid: record.uuid }}>
        <Typography variant="h6" component="h3" mb={2}>
          Related Applications
        </Typography>
        <Card>
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
        </Card>
        <Pagination />
      </ListBase>
    )
  );
};

export default RelatedApplicationsTable;
