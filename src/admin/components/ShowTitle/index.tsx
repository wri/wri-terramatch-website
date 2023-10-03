import { RaRecord, useRecordContext, useShowContext } from "react-admin";
import { Else, If, Then, When } from "react-if";

interface IProps {
  moduleName?: string;
  getTitle: (record: RaRecord) => string;
}

const ShowTitle = (props: IProps) => {
  const record = useRecordContext();
  const { isLoading } = useShowContext();

  const title = props.getTitle(record);

  return (
    <If condition={isLoading}>
      <Then>Loading {props.moduleName}</Then>
      <Else>
        <When condition={props.moduleName}>
          {props.moduleName}
          {title && ": "}
        </When>
        <When condition={!!title}>{title}</When>
      </Else>
    </If>
  );
};

export default ShowTitle;
