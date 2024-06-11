import classNames from "classnames";

import PageSelector, { PageSelectorProps } from "./PageSelector";
import PerPageSelector from "./PerPageSelector";

export interface PaginationProps extends PageSelectorProps {
  containerClassName?: string;
  hasPageSizeSelector?: boolean;
  defaultPageSize?: number;
  setPageSize?: (count: number) => void;
}

const Pagination = (props: PaginationProps) => (
  <div className={classNames("flex items-center justify-between", props.containerClassName)}>
    {props.hasPageSizeSelector ? (
      <PerPageSelector
        label="Per page"
        options={[5, 10, 15, 20, 50]}
        defaultValue={props.defaultPageSize}
        onChange={props.setPageSize!}
      />
    ) : (
      <div />
    )}
    <PageSelector {...props} />
  </div>
);

export default Pagination;
