import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";

type PolygonReviewEmptyStateProps = {
  onSelectProject: () => void;
};

const PolygonReviewEmptyState: FC<PolygonReviewEmptyStateProps> = ({ onSelectProject }) => {
  const t = useT();

  return (
    <Flex direction="column" align="center" gap={2} paddingX={6} paddingY={8} textAlign="center">
      <Text as="h2" textStyle="400-bold" color="neutral.900">
        {t("Select a project to see polygons")}
      </Text>
      <Text textStyle="300" color="neutral.800" maxWidth="56rem">
        {t(
          "Start by selecting a project using filters or the map above to see polygons. Use the filters to narrow down project or look for polygons with specific attributes within a project. No polygons appear until the scope is specific enough."
        )}
      </Text>
      <Button variant="secondary" size="small" onClick={onSelectProject}>
        {t("Select a project")}
      </Button>
    </Flex>
  );
};

export default PolygonReviewEmptyState;
