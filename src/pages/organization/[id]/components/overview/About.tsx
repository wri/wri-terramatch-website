import { Box, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { ChevronRightIcon } from "@/redesignComponents/foundations/Icons";

type AboutProps = {
  description: string | null;
  onAddInformation: () => void;
};

const About: FC<AboutProps> = ({ description, onAddInformation }) => {
  const t = useT();

  return (
    <Box backgroundColor="neutral.100" padding={5} borderRadius={1}>
      {description != null ? (
        <Text textStyle="400" color="neutral.900" lineClamp={4} className="whitespace-pre-line">
          {description}
        </Text>
      ) : (
        <Button type="button" variant="borderless" rightIcon={<ChevronRightIcon />} onClick={onAddInformation}>
          {t("Add Information")}
        </Button>
      )}
    </Box>
  );
};

export default About;
