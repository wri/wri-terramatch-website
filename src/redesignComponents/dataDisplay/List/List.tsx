import { Box } from "@chakra-ui/react";
import { List as WriList, ListProps as WriListProps } from "@worldresources/wri-design-systems";
import { FC } from "react";

export type { WriListProps };

type ListProps = WriListProps & { itemsAlignItems?: boolean };
const List: FC<ListProps> = ({ itemsAlignItems = true, ...props }) => {
  return (
    <Box
      css={
        itemsAlignItems && {
          "& > div > div > div": {
            display: "flex !important",
            alignItems: "center !important"
          }
        }
      }
    >
      <WriList {...props} />
    </Box>
  );
};

export default List;
