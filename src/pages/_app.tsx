import "src/styles/globals.css";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { normalizeLocale, tx } from "@transifex/native";
import { useT } from "@transifex/react";
import { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect } from "react";
import { Provider as ReduxProvider } from "react-redux";

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
import { wrapper } from "@/store/store";
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
  <ToastProvider>
    <RouteHistoryProvider>
      <NavbarProvider>
        <ModalRoot />
        <Toast />
        <DashboardAnalyticsWrapper>
          <DashboardLayout>{children}</DashboardLayout>
        </DashboardAnalyticsWrapper>
      </NavbarProvider>
    </RouteHistoryProvider>
  </ToastProvider>
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
  <ToastProvider>
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
  </ToastProvider>
);

const _App = ({ Component, ...rest }: AppProps) => {
  const t = useT();
  const router = useRouter();
  const isAdmin = router.asPath.includes("/admin");
  const isOnDashboards = router.asPath.includes("/dashboard");

  const {
    store,
    props: { pageProps }
  } = wrapper.useWrappedStore(rest);

  setupYup(t);

  return (
    <ReduxProvider store={store}>
      <Bootstrap>
        <WrappedQueryClientProvider>
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
        </WrappedQueryClientProvider>
      </Bootstrap>
    </ReduxProvider>
  );
};

// Disable all server side pre-rendering.
export default dynamic(() => Promise.resolve(_App), {
  ssr: false
});
