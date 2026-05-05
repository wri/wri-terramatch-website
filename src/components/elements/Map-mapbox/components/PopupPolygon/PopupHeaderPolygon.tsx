import { Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";

type PopupHeaderPolygonProps = {
  polygonName: string | null | undefined;
};

const PopupHeaderPolygon = ({ polygonName }: PopupHeaderPolygonProps) => {
  const t = useT();
  const title = polygonName != null && polygonName !== "" ? polygonName : t("Unnamed Polygon");

  return (
    <Text textStyle="400-bold" color="neutral.900">
      {title}
    </Text>
  );
};
export default PopupHeaderPolygon;
