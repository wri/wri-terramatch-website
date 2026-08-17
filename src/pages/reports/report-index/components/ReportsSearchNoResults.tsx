import { Box, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";

const ReportsSearchNoResults = () => {
  const t = useT();

  return (
    <Box>
      <Text textStyle="400-bold">{t("No results found")}</Text>
      <Text textStyle="400">{t(" We couldn’t find any reports matching your search. Try a different keyword.")}</Text>
    </Box>
  );
};

export default ReportsSearchNoResults;
