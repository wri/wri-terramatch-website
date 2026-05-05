import { Grid } from "@chakra-ui/react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { DownloadIcon, EditIcon } from "@/redesignComponents/foundations/Icons";

const PopupFooterPolygon = () => {
  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={3} width="100%">
      <Button variant="secondary" size="small" leftIcon={<DownloadIcon />}>
        Download
      </Button>
      <Button variant="secondary" size="small" leftIcon={<EditIcon />}>
        Edit
      </Button>
      <Button variant="primary" size="small">
        Submit
      </Button>
    </Grid>
  );
};
export default PopupFooterPolygon;
