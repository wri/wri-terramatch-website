import { Grid } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import type { FC } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { DownloadIcon, EditIcon } from "@/redesignComponents/foundations/Icons";

const PopupFooterPolygon: FC = () => {
  const t = useT();

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={3} width="100%">
      <Button variant="secondary" size="small" leftIcon={<DownloadIcon />}>
        {t("Download")}
      </Button>
      <Button variant="secondary" size="small" leftIcon={<EditIcon />}>
        {t("Edit")}
      </Button>
      <Button variant="primary" size="small">
        {t("Submit")}
      </Button>
    </Grid>
  );
};
export default PopupFooterPolygon;
