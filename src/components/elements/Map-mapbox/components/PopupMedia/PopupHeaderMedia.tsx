import { Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { type FC, memo } from "react";

type PopupHeaderMediaProps = {
  name: string;
};

const PopupHeaderMedia: FC<PopupHeaderMediaProps> = ({ name }) => {
  const t = useT();
  const resolvedName = name !== "" ? name : t("Untitled photo");

  return (
    <Text textStyle="400-bold" color="neutral.900" lineClamp={1} title={resolvedName}>
      {resolvedName}
    </Text>
  );
};

export default memo(PopupHeaderMedia);
