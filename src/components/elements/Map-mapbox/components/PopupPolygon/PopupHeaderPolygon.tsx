import { Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import type { FC } from "react";

type PopupHeaderPolygonProps = {
  polygonName?: string;
};

const PopupHeaderPolygon: FC<PopupHeaderPolygonProps> = ({ polygonName }) => {
  const t = useT();
  const resolvedTitle = polygonName != null && polygonName !== "" ? polygonName : t("Unnamed Polygon");

  return (
    <Text textStyle="400-bold" color="neutral.900">
      {resolvedTitle}
    </Text>
  );
};
export default PopupHeaderPolygon;
