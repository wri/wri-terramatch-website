import { useT } from "@transifex/react";
import classNames from "classnames";

import PageSelector, { PageSelectorProps } from "./PageSelector";
import { VariantPagination } from "./PaginationVariant";
import PerPageSelector from "./PerPageSelector";

export interface PaginationProps extends PageSelectorProps {
  containerClassName?: string;
  hasPageSizeSelector?: boolean;
  defaultPageSize?: number;
  setPageSize?: (count: number) => void;
  variant?: VariantPagination;
  invertSelect?: boolean;
}

function Pagination(props: PaginationProps) {
  const t = useT();
  return (
    <div className={classNames("flex items-center justify-between", props.containerClassName)}>
      {props.hasPageSizeSelector ? (
        <PerPageSelector
          label={t("Per page")}
          options={[5, 10, 15, 20, 50]}
          variantText={props.variant?.VariantPrePageText}
          defaultValue={props.defaultPageSize}
          onChange={props.setPageSize!}
          invertSelect={props.invertSelect}
        />
      ) : (
        <div />
      )}
      <PageSelector variantText={props.variant?.VariantPageText} {...props} />
    </div>
  );
}

export default Pagination;
