import classNames from "classnames";

import { TextVariants } from "@/types/common";

import PageSelector, { PageSelectorProps } from "./PageSelector";
import PerPageSelector from "./PerPageSelector";

export interface PaginationProps extends PageSelectorProps {
  containerClassName?: string;
  hasPageSizeSelector?: boolean;
  defaultPageSize?: number;
  setPageSize?: (count: number) => void;
  treeSpeciesShow?: boolean;
  variantText?: TextVariants;
}

function Pagination(props: PaginationProps) {
  return props.treeSpeciesShow ? (
    <div className={classNames("flex items-center justify-between", props.containerClassName)}>
      <PageSelector {...props} />
    </div>
  ) : (
    <div className={classNames("flex items-center justify-between", props.containerClassName)}>
      {props.hasPageSizeSelector ? (
        <PerPageSelector
          label="Per page"
          options={[5, 10, 15, 20, 50]}
          variantText={props.variantText}
          defaultValue={props.defaultPageSize}
          onChange={props.setPageSize!}
        />
      ) : (
        <div />
      )}
      <PageSelector {...props} />
    </div>
  );
}

export default Pagination;
