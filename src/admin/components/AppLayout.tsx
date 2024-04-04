import { Box } from "@mui/material";
// import { useState } from "react";
import { Layout, LayoutProps } from "react-admin";
import { When } from "react-if";

import { BackButton } from "@/admin/components/BackButton";
import ExportProvider from "@/admin/modules/application/context/export.provider";

// import Drawer from "@/components/elements/Drawer/Drawer";
import { AppBar } from "./AppBar";

export const AppLayout = (props: LayoutProps) => {
  const regex = new RegExp("[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}", "gi");

  const isDetailPage = regex.test(window.location.hash);
  // const [isOpen, setIsOpen] = useState(true);
  return (
    <ExportProvider>
      <Layout {...props} appBar={AppBar}>
        {/* <Drawer title={"asdfsad"} setIsOpen={setIsOpen} isOpen={isOpen}>
          {" "}
          asdfas
        </Drawer> */}
        <When condition={isDetailPage}>
          <Box marginTop={2}>
            <BackButton />
          </Box>
        </When>
        {props.children}
      </Layout>
    </ExportProvider>
  );
};
