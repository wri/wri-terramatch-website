import { Box, BoxProps, Card, CardContent, Divider, Typography } from "@mui/material";
import { FC } from "react";

const Aside: FC<Pick<BoxProps, "children" | "title">> = ({ children, title }) => (
  <Box ml={2} minWidth={350} maxWidth={350}>
    <Card>
      <CardContent>
        {title != null && (
          <>
            <Typography variant="h5" gutterBottom>
              {title}
            </Typography>
            <Divider />
          </>
        )}
        {children}
      </CardContent>
    </Card>
  </Box>
);

export default Aside;
