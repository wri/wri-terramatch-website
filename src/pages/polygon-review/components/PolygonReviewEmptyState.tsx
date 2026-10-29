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
    <Flex direction="column" align="center" gap={3} paddingX={4} paddingY={5} textAlign="center">
      <Flex direction="column" gap={1}>
        <Text as="h2" textStyle="400-bold" color="neutral.800">
          {t("Select a project to see polygons")}
        </Text>
        <Text textStyle="400" color="neutral.700">
          {t(
            "Start by selecting a project using filters or the map above to see polygons. Use the filters to narrow down a project or look for polygons with specific attributes within a project. No polygons appear until the scope is specific enough."
          )}
        </Text>
      </Flex>
      <Button className="w-[7.5rem]" variant="secondary" size="small" onClick={onSelectProject}>
        {t("Select a project")}
      </Button>
    </Flex>
  );
};

export default PolygonReviewEmptyState;
