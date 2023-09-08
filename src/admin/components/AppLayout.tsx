import { Box } from "@mui/material";
import { Layout, LayoutProps } from "react-admin";

import { BackButton } from "@/admin/components/BackButton";
import ExportProvider from "@/admin/modules/application/context/export.provider";

import { AppBar } from "./AppBar";

export const AppLayout = (props: LayoutProps) => {
  return (
    <ExportProvider>
      <Layout {...props} appBar={AppBar}>
        <Box marginTop={2}>
          <BackButton />
        </Box>
        {props.children}
      </Layout>
    </ExportProvider>
  );
};
