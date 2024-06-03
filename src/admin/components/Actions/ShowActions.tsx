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

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

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
          <DeleteWithConfirmButton
            {...deleteProps}
            mutationMode="undoable"
            className="!text-sm !font-semibold !capitalize  lg:!text-base wide:!text-md"
            icon={<Icon className="h-6 w-6" name={IconNames.TRASH_PA} />}
          />
        </When>
        <When condition={record && hasEdit}>
          <EditButton
            className="!text-sm !font-semibold !capitalize !text-blueCustom-900 lg:!text-base wide:!text-md"
            icon={<Icon className="h-6 w-6" name={IconNames.EDIT} />}
          />
        </When>
      </TopToolbar>
    </Box>
  );
};

export default ShowActions;
