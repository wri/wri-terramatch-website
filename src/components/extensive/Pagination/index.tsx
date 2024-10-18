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
  isImageGallery?: boolean;
}

function Pagination(props: PaginationProps) {
  const t = useT();
  return (
    <div className={classNames("flex items-center justify-between", props.containerClassName)}>
      {props.hasPageSizeSelector ? (
        <PerPageSelector
          label={t(props.variant?.labelText || "Per page")}
          options={props.isImageGallery ? [3, 6, 12, 30, 60] : [5, 10, 15, 20, 50]}
          variantText={props.variant?.VariantPrePageText}
          defaultValue={props.defaultPageSize}
          onChange={props.setPageSize!}
          invertSelect={props.invertSelect}
          variant={props.variant}
        />
      ) : (
        <div />
      )}
      <PageSelector variantText={props.variant?.VariantPageText} {...props} variant={props.variant} />
    </div>
  );
}

export default Pagination;
