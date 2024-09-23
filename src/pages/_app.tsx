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

import Toast from "@/components/elements/Toast/Toast";
import ModalRoot from "@/components/extensive/Modal/ModalRoot";
import DashboardLayout from "@/components/generic/Layout/DashboardLayout";
import MainLayout from "@/components/generic/Layout/MainLayout";
import { LoadingProvider } from "@/context/loaderAdmin.provider";
import ModalProvider from "@/context/modal.provider";
import NavbarProvider from "@/context/navbar.provider";
import NotificationProvider from "@/context/notification.provider";
import WrappedQueryClientProvider from "@/context/queryclient.provider";
import RouteHistoryProvider from "@/context/routeHistory.provider";
import ToastProvider from "@/context/toast.provider";
import { getServerSideTranslations, setClientSideTranslations } from "@/i18n";
import StoreProvider from "@/store/StoreProvider";
import setupYup from "@/yup.locale";

const CookieBanner = dynamic(() => import("@/components/extensive/CookieBanner/CookieBanner"), {
  ssr: false
});

const _App = ({ Component, pageProps, props, authToken }: AppProps & { authToken?: string; props: any }) => {
  const t = useT();
  const router = useRouter();
  const isAdmin = router.asPath.includes("/admin");
  const isOnDashboards = router.asPath.includes("/dashboard");

  setClientSideTranslations(props);
  setupYup(t);

  if (isAdmin)
    return (
      <StoreProvider {...{ authToken }}>
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
      </StoreProvider>
    );
  else
    return (
      <StoreProvider {...{ authToken }}>
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
                            <DashboardLayout>
                              <Component {...pageProps} />
                            </DashboardLayout>
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
      </StoreProvider>
    );
};

_App.getInitialProps = async (context: AppContext) => {
  const ctx = await App.getInitialProps(context);
  const cookies = nookies.get(context.ctx);
  let translationsData = {};
  try {
    translationsData = await getServerSideTranslations(context.ctx);
  } catch (err) {
    console.log("Failed to get Serverside Transifex", err);
  }
  return { ...ctx, props: { ...translationsData }, authToken: cookies.accessToken };
};

export default _App;
