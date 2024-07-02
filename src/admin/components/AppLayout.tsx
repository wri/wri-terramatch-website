import { Box } from "@mui/material";
import { Layout, LayoutProps } from "react-admin";
import { When } from "react-if";

import { BackButton } from "@/admin/components/BackButton";
import ExportProvider from "@/admin/modules/application/context/export.provider";
import Loader from "@/components/generic/Loading/Loader";
import { useLoading } from "@/context/loaderAdmin.provider";

import { AppBar } from "./AppBar";
import AppMenu from "./AppMenu";

export const AppLayout = (props: LayoutProps) => {
  const { loading } = useLoading();
  const regex = new RegExp("[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}", "gi");

  const isDetailPage = regex.test(window.location.hash);
  return (
    <ExportProvider>
      {loading && (
        <div className="fixed z-50 flex h-screen w-full items-center justify-center backdrop-brightness-50">
          <Loader />
        </div>
      )}
      <Layout {...props} appBar={AppBar} menu={AppMenu}>
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
