import "src/styles/globals.css";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { normalizeLocale, tx } from "@transifex/native";
import { useT } from "@transifex/react";
import { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect } from "react";

import Toast from "@/components/elements/Toast/Toast";
import CookieBanner from "@/components/extensive/CookieBanner/CookieBanner";
import ModalRoot from "@/components/extensive/Modal/ModalRoot";
import DashboardLayout from "@/components/generic/Layout/DashboardLayout";
import MainLayout from "@/components/generic/Layout/MainLayout";
import { useMyUser } from "@/connections/User";
import * as environment from "@/constants/environment";
import FloatNotificationProvider from "@/context/floatNotification.provider";
import { LoadingProvider } from "@/context/loaderAdmin.provider";
import ModalProvider from "@/context/modal.provider";
import { MonitoredDataProvider } from "@/context/monitoredData.provider";
import NavbarProvider from "@/context/navbar.provider";
import NotificationProvider from "@/context/notification.provider";
import WrappedQueryClientProvider from "@/context/queryclient.provider";
import RouteHistoryProvider from "@/context/routeHistory.provider";
import ToastProvider from "@/context/toast.provider";
import { WrappedReduxProvider } from "@/store/store";
import setupYup from "@/yup.locale";

import DashboardAnalyticsWrapper from "./dashboard/DashboardAnalyticsWrapper";

if (typeof window !== "undefined") {
  // Make some things available to the browser console for easy debugging.
  (window as any).terramatch = { environment };
}

tx.init({
  token: process.env.NEXT_PUBLIC_TRANSIFEX_TOKEN
});

const Bootstrap = ({ children }: PropsWithChildren) => {
  const [loaded, { user }] = useMyUser();
  useEffect(() => {
    tx.setCurrentLocale(normalizeLocale(user?.locale ?? "en-US"));
  }, [user?.locale]);

  // TODO: refactor middleware routing to this component.

  return loaded ? <>{children}</> : null;
};

const DashboardStack = ({ children }: PropsWithChildren) => (
  <RouteHistoryProvider>
    <NavbarProvider>
      <ModalRoot />
      <Toast />
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
        <MainLayout>
          {children}
          <CookieBanner />
        </MainLayout>
      </NavbarProvider>
    </FloatNotificationProvider>
  </RouteHistoryProvider>
);

const _App = ({ Component, pageProps }: AppProps) => {
  const t = useT();
  const router = useRouter();
  const isAdmin = router.asPath.includes("/admin");
  const isOnDashboards = router.asPath.includes("/dashboard");

  setupYup(t);

  return (
    <ToastProvider>
      <WrappedQueryClientProvider>
        <WrappedReduxProvider>
          <Bootstrap>
            <LoadingProvider>
              <NotificationProvider>
                <ModalProvider>
                  {isOnDashboards ? (
                    <DashboardStack>
                      <Component {...pageProps} />
                    </DashboardStack>
                  ) : isAdmin ? (
                    <AdminStack>
                      <Component {...pageProps} />
                    </AdminStack>
                  ) : (
                    <PDStack>
                      <Component {...pageProps} />
                    </PDStack>
                  )}
                </ModalProvider>
              </NotificationProvider>
            </LoadingProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </Bootstrap>
        </WrappedReduxProvider>
      </WrappedQueryClientProvider>
    </ToastProvider>
  );
};

// Disable all server side pre-rendering.
export default dynamic(() => Promise.resolve(_App), {
  ssr: false
});
