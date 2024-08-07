import "src/styles/globals.css";

import { Hydrate } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useT } from "@transifex/react";
import type { AppContext, AppProps } from "next/app";
import App from "next/app";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import nookies from "nookies";

import Toast from "@/components/elements/Toast/Toast";
import ModalRoot from "@/components/extensive/Modal/ModalRoot";
import MainLayout from "@/components/generic/Layout/MainLayout";
import AuthProvider from "@/context/auth.provider";
import { LoadingProvider } from "@/context/loaderAdmin.provider";
import ModalProvider from "@/context/modal.provider";
import NavbarProvider from "@/context/navbar.provider";
import WrappedQueryClientProvider from "@/context/queryclient.provider";
import RouteHistoryProvider from "@/context/routeHistory.provider";
import ToastProvider from "@/context/toast.provider";
import { getServerSideTranslations, setClientSideTranslations } from "@/i18n";
import setupYup from "@/yup.locale";

const CookieBanner = dynamic(() => import("@/components/extensive/CookieBanner/CookieBanner"), {
  ssr: false
});

const _App = ({ Component, pageProps, props, accessToken }: AppProps & { accessToken?: string; props: any }) => {
  const t = useT();
  const router = useRouter();
  const isAdmin = router.asPath.includes("/admin");

  setClientSideTranslations(props);
  setupYup(t);

  if (isAdmin)
    return (
      <>
        <WrappedQueryClientProvider>
          <LoadingProvider>
            <ModalProvider>
              <ModalRoot />
              <Component {...pageProps} />
            </ModalProvider>
          </LoadingProvider>
        </WrappedQueryClientProvider>
      </>
    );
  else
    return (
      <>
        <ToastProvider>
          <WrappedQueryClientProvider>
            <Hydrate state={pageProps.dehydratedState}>
              <AuthProvider token={accessToken}>
                <RouteHistoryProvider>
                  <LoadingProvider>
                    <ModalProvider>
                      <NavbarProvider>
                        <ModalRoot />
                        <Toast />
                        <MainLayout isLoggedIn={!!accessToken}>
                          <Component {...pageProps} accessToken={accessToken} />
                          <CookieBanner />
                        </MainLayout>
                      </NavbarProvider>
                    </ModalProvider>
                  </LoadingProvider>
                </RouteHistoryProvider>
              </AuthProvider>
            </Hydrate>
            <ReactQueryDevtools initialIsOpen={false} />
          </WrappedQueryClientProvider>
        </ToastProvider>
      </>
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
  return { ...ctx, props: { ...translationsData }, accessToken: cookies.accessToken };
};

export default _App;
