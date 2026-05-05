import { Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import type { FC } from "react";

const PopupHeaderPolygon: FC = () => {
  const t = useT();

  return (
    <Text textStyle="400-bold" color="neutral.900">
      {t("Title")}
    </Text>
  );
};
export default PopupHeaderPolygon;
