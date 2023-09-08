import { Box, Typography } from "@mui/material";
import { get } from "lodash";
import {
  DeleteWithConfirmButton,
  DeleteWithConfirmButtonProps,
  EditButton,
  TopToolbar,
  useRecordContext
} from "react-admin";
import { When } from "react-if";

import ShowTitle from "../ShowTitle";

interface IProps {
  titleSource?: string;
  moduleName?: string;
  hasDelete?: boolean;
  deleteProps?: DeleteWithConfirmButtonProps<any>;
  hasEdit?: boolean;
}

const ShowActions = ({ titleSource, moduleName, hasDelete = true, hasEdit = true, deleteProps = {} }: IProps) => {
  const record = useRecordContext<any>();

  const title = titleSource ? get(record, titleSource) : "";

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <When condition={!!title}>
        <Typography variant="h4" component="h2" sx={{ flexGrow: 1 }}>
          <ShowTitle moduleName={moduleName} getTitle={() => title} />
        </Typography>
      </When>
      <TopToolbar sx={{ marginBottom: 2, marginLeft: "auto" }}>
        <When condition={record && hasDelete}>
          <DeleteWithConfirmButton {...deleteProps} mutationMode="undoable" />
        </When>
        <When condition={record && hasEdit}>
          <EditButton />
        </When>
      </TopToolbar>
    </Box>
  );
};

export default ShowActions;
