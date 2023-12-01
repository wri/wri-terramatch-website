import { Box, Typography } from "@mui/material";
import { get } from "lodash";
import {
  DeleteWithConfirmButton,
  DeleteWithConfirmButtonProps,
  EditButton,
  RaRecord,
  TopToolbar,
  useRecordContext
} from "react-admin";
import { When } from "react-if";

import ShowTitle from "../ShowTitle";

interface IProps {
  titleSource?: string;
  getTitle?: (record: RaRecord) => string;
  resourceName?: string;
  moduleName?: string;
  hasDelete?: boolean;
  deleteProps?: DeleteWithConfirmButtonProps<any>;
  hasEdit?: boolean;
}

const ShowActions = ({
  titleSource,
  getTitle,
  resourceName,
  moduleName,
  hasDelete = true,
  hasEdit = true,
  deleteProps = {}
}: IProps) => {
  const record = useRecordContext<any>();

  const title = titleSource ? get(record, titleSource) : "";

  if (titleSource && resourceName) {
    deleteProps.confirmTitle = `Delete ${resourceName} ${record?.[titleSource]}`;
    deleteProps.confirmContent = `You are about to delete this ${resourceName}. This action will permanently remove the item from the system, and it cannot be undone. Are you sure you want to delete this item?`;
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <When condition={!!(title || getTitle)}>
        <Typography variant="h4" component="h2" sx={{ flexGrow: 1 }}>
          <ShowTitle moduleName={moduleName} getTitle={getTitle ? getTitle : () => title} />
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
