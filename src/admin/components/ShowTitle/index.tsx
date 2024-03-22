import { Link, RaRecord, useRecordContext, useResourceContext, useShowContext } from "react-admin";
import { Else, If, Then, When } from "react-if";

import Text from "@/components/elements/Text/Text";
import Icon from "@/components/extensive/Icon/Icon";
import { IconNames } from "@/components/extensive/Icon/Icon";
interface IProps {
  moduleName?: string;
  getTitle: (record: RaRecord) => string;
}

const ShowTitle = (props: IProps) => {
  const record = useRecordContext();
  const { isLoading } = useShowContext();
  const title = props.getTitle(record);
  const resource = useResourceContext();

  return (
    <If condition={isLoading}>
      <Then>Loading {props.moduleName}</Then>
      <Else>
        <When condition={props.moduleName}>
          {props.moduleName}
          {title && ": "}
        </When>
        <When condition={!!title}>
          <If condition={resource === "site"}>
            <Then>
              <Text variant="text-36-bold" className="flex items-center">
                <Link to={"/site"}>
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
