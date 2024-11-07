import "src/styles/globals.css";

import { Hydrate } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useT } from "@transifex/react";
import type { AppContext, AppProps } from "next/app";
import App from "next/app";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import nookies from "nookies";
import { Else, If, Then } from "react-if";
import { Provider as ReduxProvider } from "react-redux";

import Toast from "@/components/elements/Toast/Toast";
import ModalRoot from "@/components/extensive/Modal/ModalRoot";
import DashboardLayout from "@/components/generic/Layout/DashboardLayout";
import MainLayout from "@/components/generic/Layout/MainLayout";
import { loadLogin } from "@/connections/Login";
import { loadMyUser } from "@/connections/User";
import { LoadingProvider } from "@/context/loaderAdmin.provider";
import ModalProvider from "@/context/modal.provider";
import NavbarProvider from "@/context/navbar.provider";
import NotificationProvider from "@/context/notification.provider";
import WrappedQueryClientProvider from "@/context/queryclient.provider";
import RouteHistoryProvider from "@/context/routeHistory.provider";
import ToastProvider from "@/context/toast.provider";
import { getServerSideTranslations, setClientSideTranslations } from "@/i18n";
import { apiSlice } from "@/store/apiSlice";
import { wrapper } from "@/store/store";
import Log from "@/utils/log";
import setupYup from "@/yup.locale";

import DashboardAnalyticsWrapper from "./dashboard/DashboardAnalyticsWrapper";

const CookieBanner = dynamic(() => import("@/components/extensive/CookieBanner/CookieBanner"), {
  ssr: false
});

const _App = ({ Component, ...rest }: AppProps) => {
  const t = useT();
  const router = useRouter();
  const isAdmin = router.asPath.includes("/admin");
  const isOnDashboards = router.asPath.includes("/dashboard");

  const {
    store,
    props: { props, pageProps }
  } = wrapper.useWrappedStore(rest);

  setClientSideTranslations(props);
  setupYup(t);

  if (isAdmin)
    return (
      <ReduxProvider store={store}>
        <WrappedQueryClientProvider>
          <LoadingProvider>
            <NotificationProvider>
              <ModalProvider>
                <ModalRoot />
                <Component {...pageProps} />
              </ModalProvider>
            </NotificationProvider>
          </LoadingProvider>
        </WrappedQueryClientProvider>
      </ReduxProvider>
    );
  else
    return (
      <ReduxProvider store={store}>
        <ToastProvider>
          <WrappedQueryClientProvider>
            <Hydrate state={pageProps.dehydratedState}>
              <RouteHistoryProvider>
                <LoadingProvider>
                  <NotificationProvider>
                    <ModalProvider>
                      <NavbarProvider>
                        <ModalRoot />
                        <Toast />
                        <If condition={isOnDashboards}>
                          <Then>
                            <DashboardAnalyticsWrapper>
                              <DashboardLayout>
                                <Component {...pageProps} />
                              </DashboardLayout>
                            </DashboardAnalyticsWrapper>
                          </Then>
                          <Else>
                            <MainLayout>
                              <Component {...pageProps} />
                              <CookieBanner />
                            </MainLayout>
                          </Else>
                        </If>
                      </NavbarProvider>
                    </ModalProvider>
                  </NotificationProvider>
                </LoadingProvider>
              </RouteHistoryProvider>
            </Hydrate>
            <ReactQueryDevtools initialIsOpen={false} />
          </WrappedQueryClientProvider>
        </ToastProvider>
      </ReduxProvider>
    );
};

_App.getInitialProps = wrapper.getInitialAppProps(store => async (context: AppContext) => {
  const authToken = nookies.get(context.ctx).accessToken;
  if (authToken != null && (await loadLogin()).token !== authToken) {
    store.dispatch(apiSlice.actions.setInitialAuthToken({ authToken }));
    await loadMyUser();
  }

  const ctx = await App.getInitialProps(context);
  let translationsData = {};
  try {
    translationsData = await getServerSideTranslations(context.ctx);
  } catch (err) {
    Log.warn("Failed to get Serverside Transifex", err);
  }
  return { ...ctx, props: { ...translationsData } };
});

export default _App;
