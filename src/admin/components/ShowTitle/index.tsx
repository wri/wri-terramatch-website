import { Chip } from "@mui/material";
import { FC } from "react";
import { Link, useGetRecordRepresentation, useRecordContext, useResourceContext, useShowContext } from "react-admin";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

type ShowTitleProps = {
  moduleName?: string;
};

const ShowTitle: FC<ShowTitleProps> = props => {
  const record = useRecordContext();
  const { isLoading } = useShowContext();
  const resource = useResourceContext();
  const titleGetter = useGetRecordRepresentation(resource);

  const title = (
    <>
      {titleGetter(record)}
      {(record?.is_test || record?.isTest) && <Chip className="mx-4" label={`test ${resource}`} color="info" />}
    </>
  );

  if (isLoading) return <>`Loading ${props.moduleName}`</>;

  const hasResourceLink =
    resource === "site" ||
    resource === "project" ||
    resource === "projectReport" ||
    resource === "nursery" ||
    resource === "disturbanceReport";
  return (
    <>
      {props.moduleName != null && (
        <>
          {props.moduleName}
          {title && ": "}
        </>
      )}
      {title != null && hasResourceLink ? (
        <Text variant="text-36-bold" className="flex items-center">
          <Link to={`/${resource}`}>
            <Icon name={IconNames.CHEVRON_LEFT_PA} className="mr-2 h-10 w-9" />
          </Link>
          {title}
          {props.moduleName}
        </Text>
      ) : (
        title
      )}
    </>
  );
};

export default ShowTitle;
