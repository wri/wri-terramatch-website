import { Box, BoxProps, Card, CardContent, Divider, Typography } from "@mui/material";
import { FC } from "react";
import { When } from "react-if";

const Aside: FC<BoxProps> = ({ children, title, ...rest }) => {
  return (
    <Box ml={2} minWidth={350} maxWidth={350}>
      <Card>
        <CardContent>
          <When condition={!!title}>
            <Typography variant="h5" gutterBottom>
              {title}
            </Typography>
            <Divider />
          </When>
          {children}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Aside;
