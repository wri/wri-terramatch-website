import { Box } from "@chakra-ui/react";
import { Search as WriSearch } from "@worldresources/wri-design-systems";
import { FC } from "react";

import { searchStyles } from "./Search.styled";

const Search: FC<React.ComponentProps<typeof WriSearch>> = ({ ...props }) => {
  return (
    <Box css={searchStyles}>
      <WriSearch {...props} />
    </Box>
  );
};

export default Search;
