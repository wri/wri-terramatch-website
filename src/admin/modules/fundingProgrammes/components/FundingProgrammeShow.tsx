import { Divider } from "@mui/material";
import { ImageField, Show, SimpleShowLayout, TabbedShowLayout, TextField } from "react-admin";

import FundingProgrammeStages from "@/admin/modules/fundingProgrammes/components/FundingProgrammeStages";

import FundingProgrammeOrganisations from "./FundingProgrammeOrganisations";
import FundingProgrammeTitle from "./FundingProgrammeTitle";

export const FundingProgrammeShow = () => {
  return (
    <Show title={<FundingProgrammeTitle />} sx={{ mb: 2 }}>
      <TabbedShowLayout>
        <TabbedShowLayout.Tab label="Details">
          <SimpleShowLayout>
            <TextField source="name" label="Name" fullWidth />
            <TextField source="description" label="Description" fullWidth />
            <ImageField source="cover.url" label="Cover Photo" title="cover.file_name" emptyText="Not Provided" />
            <TextField source="status" label="Status" fullWidth sx={{ textTransform: "capitalize" }} />
          </SimpleShowLayout>
          <Divider />
        </TabbedShowLayout.Tab>
        <TabbedShowLayout.Tab label="Stages">
          <FundingProgrammeStages />
        </TabbedShowLayout.Tab>
        <TabbedShowLayout.Tab label="Applied Organisations">
          <FundingProgrammeOrganisations />
        </TabbedShowLayout.Tab>
      </TabbedShowLayout>
    </Show>
  );
};
