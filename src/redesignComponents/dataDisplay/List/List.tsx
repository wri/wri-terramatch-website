import { Box } from "@chakra-ui/react";
import { List as WriList, ListProps as WriListProps } from "@worldresources/wri-design-systems";
import { FC } from "react";

export type { WriListProps };

const List: FC<WriListProps> = props => {
  return (
    <Box>
      <WriList {...props} />
    </Box>
  );
};

export default List;
