import { Box } from "@mui/material";
import { FC } from "react";
import { Layout, LayoutProps } from "react-admin";

import { BackButton } from "@/admin/components/BackButton";
import ExportProvider from "@/admin/modules/application/context/export.provider";
import Loader from "@/components/generic/Loading/Loader";
import { useLoading } from "@/context/loaderAdmin.provider";

import { AppBar } from "./AppBar";
import AppMenu from "./AppMenu";

const IS_DETAIL_PAGE = new RegExp("[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}", "gi");

const AppLayout: FC<LayoutProps> = props => {
  const { loading } = useLoading();
  const isDetailPage = IS_DETAIL_PAGE.test(window.location.hash);

  return (
    <ExportProvider>
      {loading && (
        <div className="fixed z-50 flex h-screen w-full items-center justify-center backdrop-brightness-50">
          <Loader />
        </div>
      )}
      <Layout {...props} appBar={AppBar} menu={AppMenu}>
        {isDetailPage && (
          <Box marginTop={2}>
            <BackButton />
          </Box>
        )}
        {props.children}
      </Layout>
    </ExportProvider>
  );
};

export default AppLayout;
