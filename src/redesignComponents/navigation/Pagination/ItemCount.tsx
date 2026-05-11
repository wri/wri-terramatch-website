import { Box } from "@chakra-ui/react";
import { ItemCount as WriItemCount } from "@worldresources/wri-design-systems";
import { FC } from "react";

import { itemCountStyles } from "./paginationStyles";

export type ItemCountProps = {
  pageSize: number;
  currentPage: number;
  totalItems: number;
  onPageSizeChange?: (pageSize: number) => void;
  showItemCountText?: boolean;
  css?: any;
};

const ItemCount: FC<ItemCountProps> = ({
  pageSize,
  currentPage,
  totalItems,
  onPageSizeChange,
  showItemCountText,
  css
}) => {
  return (
    <Box
      css={itemCountStyles({
        ...css,
        width: "100%",
        justifyContent: "space-between",
        "& > div": {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%"
        },
        "& > div > div": {
          marginBottom: "0rem !important",
          zIndex: 10,
          justifyContent: "space-between"
        }
      })}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <WriItemCount
        pageSize={pageSize}
        currentPage={currentPage}
        totalItems={totalItems}
        onPageSizeChange={onPageSizeChange}
        showItemCountText={showItemCountText}
      />
    </Box>
  );
};

export default ItemCount;
