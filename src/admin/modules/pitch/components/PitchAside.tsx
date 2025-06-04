import { Grid } from "@mui/material";
import { Labeled, ReferenceField, TextField } from "react-admin";

import Aside from "@/admin/components/Aside/Aside";

import modules from "../..";

interface PitchAsideProps {
  asideType: "show" | "edit";
}

export const PitchAside = (props: PitchAsideProps) => {
  return (
    <Aside title="Pitch Review">
      <Grid container spacing={2} marginY={2}>
        <Grid item xs={6}>
          <Labeled label="Name">
            <TextField source="projectName" />
          </Labeled>
        </Grid>
        <Grid item xs={6}>
          <Labeled label="Name">
            <ReferenceField source="organisationId" reference={modules.organisation.ResourceName} link="show">
              <TextField source="name" />
            </ReferenceField>
          </Labeled>
        </Grid>
        <Grid item xs={6}>
          <Labeled label="Status">
            <TextField source="readableStatus" />
          </Labeled>
        </Grid>
      </Grid>
    </Aside>
  );
};
