import { Search as WriSearch } from "@worldresources/wri-design-systems";
import { FC } from "react";

import { StyledSearchWrapper } from "./Search.styled";

const Search: FC<React.ComponentProps<typeof WriSearch>> = ({ ...props }) => {
  return (
    <StyledSearchWrapper>
      <WriSearch {...props} />
    </StyledSearchWrapper>
  );
};

export default Search;
