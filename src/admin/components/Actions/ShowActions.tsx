import { Box, Typography } from "@mui/material";
import { get } from "lodash";
import {
  Button,
  DeleteWithConfirmButton,
  DeleteWithConfirmButtonProps,
  EditButton,
  Link,
  RaRecord,
  TopToolbar,
  useRecordContext,
  useResourceContext
} from "react-admin";
import { When } from "react-if";

import { useCanUserEdit } from "@/admin/hooks/useCanUserEdit";
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
  toggleTestStatus?: (record: any) => void;
}

const ShowActions = ({
  titleSource,
  getTitle,
  resourceName,
  moduleName,
  hasDelete = true,
  hasEdit = true,
  toggleTestStatus,
  deleteProps = {}
}: IProps) => {
  const record = useRecordContext<any>();
  const resource = useResourceContext();

  const title = titleSource ? get(record, titleSource) : "";

  if (titleSource && resourceName) {
    deleteProps.confirmTitle = `Delete ${resourceName} ${record?.[titleSource]}`;
    deleteProps.confirmContent = `You are about to delete this ${resourceName}. This action will permanently remove the item from the system, and it cannot be undone. Are you sure you want to delete this item?`;
  }

  const canEdit = useCanUserEdit(record, resource);

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <When condition={resource === "siteReport" || resource === "nurseryReport"}>
        <Link to={`/${resource}`}>
          <Icon name={IconNames.CHEVRON_LEFT_PA} className="mr-2 h-10 w-9" />
        </Link>
      </When>
      <When condition={!!(title || getTitle)}>
        <Typography variant="h4" component="h2" sx={{ flexGrow: 1 }}>
          <ShowTitle moduleName={moduleName} getTitle={getTitle ? getTitle : () => title} />
        </Typography>
      </When>
      <TopToolbar sx={{ marginBottom: 2, marginLeft: "auto" }}>
        {record && toggleTestStatus && (
          <Button
            label="Toggle Test"
            className="!text-sm !font-semibold !capitalize  lg:!text-base wide:!text-md"
            onClick={() => toggleTestStatus(record)}
          >
            <Icon className="h-5 w-5" name={record?.is_test ? IconNames.SORT_DOWN : IconNames.SORT_UP} />
          </Button>
        )}
        {canEdit && hasDelete && (
          <DeleteWithConfirmButton
            {...deleteProps}
            mutationMode="undoable"
            className="!text-sm !font-semibold !capitalize  lg:!text-base wide:!text-md"
            icon={<Icon className="h-5 w-5" name={IconNames.TRASH_PA} />}
          />
        )}
        {canEdit && hasEdit && (
          <EditButton
            className="!text-sm !font-semibold !capitalize !text-blueCustom-900 lg:!text-base wide:!text-md"
            icon={<Icon className="h-6 w-6" name={IconNames.EDIT} />}
          />
        )}
      </TopToolbar>
    </Box>
  );
};

export default ShowActions;
