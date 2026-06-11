import "src/styles/globals.css";

import { ChakraProvider } from "@chakra-ui/react";
import { tx } from "@transifex/native";
import { useT } from "@transifex/react";
import { Toast as WRIToast } from "@worldresources/wri-design-systems";
import { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";

import Toast from "@/components/elements/Toast/Toast";
import CookieBanner from "@/components/extensive/CookieBanner/CookieBanner";
import ModalRoot from "@/components/extensive/Modal/ModalRoot";
import DashboardLayout from "@/components/generic/Layout/DashboardLayout";
import MainLayout from "@/components/generic/Layout/MainLayout";
import * as environment from "@/constants/environment";
import EntityScopeFromRouter from "@/context/EntityScopeFromRouter";
import FloatNotificationProvider from "@/context/floatNotification.provider";
import { LoadingProvider } from "@/context/loaderAdmin.provider";
import ModalProvider from "@/context/modal.provider";
import { MonitoredDataProvider } from "@/context/monitoredData.provider";
import NavbarProvider from "@/context/navbar.provider";
import NotificationProvider from "@/context/notification.provider";
import RouteHistoryProvider from "@/context/routeHistory.provider";
import ToastProvider from "@/context/toast.provider";
import { system } from "@/lib/theme";
import { WrappedReduxProvider } from "@/store/store";
import Bootstrap from "@/utils/Bootstrap";
import setupYup from "@/yup.locale";

import DashboardAnalyticsWrapper from "./dashboard/DashboardAnalyticsWrapper";

if (typeof window !== "undefined") {
  // Make some things available to the browser console for easy debugging.
  (window as any).terramatch = { environment };
}

tx.init({
  token: process.env.NEXT_PUBLIC_TRANSIFEX_TOKEN
});

const DashboardStack = ({ children }: PropsWithChildren) => (
  <RouteHistoryProvider>
    <NavbarProvider>
      <ModalRoot />
      <Toast />
      <WRIToast />
      <DashboardAnalyticsWrapper>
        <DashboardLayout>{children}</DashboardLayout>
      </DashboardAnalyticsWrapper>
    </NavbarProvider>
  </RouteHistoryProvider>
);

const AdminStack = ({ children }: PropsWithChildren) => (
  <LoadingProvider>
    <FloatNotificationProvider>
      <MonitoredDataProvider>
        <ModalRoot />
        {children}
      </MonitoredDataProvider>
    </FloatNotificationProvider>
  </LoadingProvider>
);

const PDStack = ({ children }: PropsWithChildren) => (
  <RouteHistoryProvider>
    <FloatNotificationProvider>
      <NavbarProvider>
        <ModalRoot />
        <Toast />
        <WRIToast />
        <MainLayout>
          {children}
          <CookieBanner />
        </MainLayout>
      </NavbarProvider>
    </FloatNotificationProvider>
  </RouteHistoryProvider>
);

const SiteStack = ({ children }: PropsWithChildren) => (
  <RouteHistoryProvider>
    <NavbarProvider>
      <ModalRoot />
      <Toast />
      <WRIToast />
      <MainLayout>
        {children}
        <CookieBanner />
      </MainLayout>
    </NavbarProvider>
  </RouteHistoryProvider>
);

// Standalone admin polygon review: same providers as SiteStack but without MainLayout,
// since the page brings its own admin header and sidebar.
const SitePolygonReviewStack = ({ children }: PropsWithChildren) => (
  <RouteHistoryProvider>
    <NavbarProvider>
      <ModalRoot />
      <Toast />
      <WRIToast />
      {children}
    </NavbarProvider>
  </RouteHistoryProvider>
);

const _App = ({ Component, pageProps }: AppProps) => {
  const t = useT();
  const router = useRouter();
  const isAdmin = router.asPath.includes("/admin");
  const isOnDashboards = router.asPath.includes("/dashboard");
  const isOnSitePolygonReview = /^\/site\/[^/]+\/polygon-review(?:[/?#]|$)/.test(router.asPath);
  const isOnSite = router.asPath.includes("/site");

  setupYup(t);

  return (
    <ChakraProvider value={system}>
      <ToastProvider>
        <WrappedReduxProvider>
          <Bootstrap>
            <LoadingProvider>
              <NotificationProvider>
                <ModalProvider>
                  <EntityScopeFromRouter>
                    {isOnDashboards ? (
                      <DashboardStack>
                        <Component {...pageProps} />
                      </DashboardStack>
                    ) : isAdmin ? (
                      <AdminStack>
                        <Component {...pageProps} />
                      </AdminStack>
                    ) : isOnSitePolygonReview ? (
                      <SitePolygonReviewStack>
                        <Component {...pageProps} />
                      </SitePolygonReviewStack>
                    ) : isOnSite ? (
                      <SiteStack>
                        <Component {...pageProps} />
                      </SiteStack>
                    ) : (
                      <PDStack>
                        <Component {...pageProps} />
                      </PDStack>
                    )}
                  </EntityScopeFromRouter>
                </ModalProvider>
              </NotificationProvider>
            </LoadingProvider>
          </Bootstrap>
        </WrappedReduxProvider>
      </ToastProvider>
    </ChakraProvider>
  );
};

// Disable all server side pre-rendering.
export default dynamic(() => Promise.resolve(_App), {
  ssr: false
});
