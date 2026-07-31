import { ItemCount as WriItemCount } from "@worldresources/wri-design-systems";
import { FC } from "react";

export type ItemCountProps = {
  pageSize: number;
  currentPage: number;
  totalItems: number;
  onPageSizeChange?: (pageSize: number) => void;
  showItemCountText?: boolean;
  css?: any;
};

const ItemCount: FC<ItemCountProps> = ({ pageSize, currentPage, totalItems, onPageSizeChange, showItemCountText }) => {
  return (
    <WriItemCount
      pageSize={pageSize}
      currentPage={currentPage}
      totalItems={totalItems}
      onPageSizeChange={onPageSizeChange}
      showItemCountText={showItemCountText}
    />
  );
};

export default ItemCount;
