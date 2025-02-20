import { Chip } from "@mui/material";
import { Link, useGetRecordRepresentation, useRecordContext, useResourceContext, useShowContext } from "react-admin";
import { Else, If, Then, When } from "react-if";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

interface IProps {
  moduleName?: string;
}

const ShowTitle = (props: IProps) => {
  const record = useRecordContext();
  const { isLoading } = useShowContext();
  const resource = useResourceContext();
  const titleGetter = useGetRecordRepresentation(resource);

  const title = (
    <>
      {titleGetter(record)}
      {record?.is_test && <Chip className="mx-4" label={`test ${resource}`} color="info" />}
    </>
  );

  return (
    <If condition={isLoading}>
      <Then>Loading {props.moduleName}</Then>
      <Else>
        <When condition={props.moduleName}>
          {props.moduleName}
          {title && ": "}
        </When>
        <When condition={!!title}>
          <If
            condition={
              resource === "site" || resource === "project" || resource === "projectReport" || resource === "nursery"
            }
          >
            <Then>
              <Text variant="text-36-bold" className="flex items-center">
                <Link to={`/${resource}`}>
                  <Icon name={IconNames.CHEVRON_LEFT_PA} className="mr-2 h-10 w-9" />
                </Link>
                {title}
                {props.moduleName}
              </Text>
            </Then>
            <Else>{title}</Else>
          </If>
        </When>
      </Else>
    </If>
  );
};

export default ShowTitle;
