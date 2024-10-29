import "src/styles/globals.css";

import { Hydrate } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useT } from "@transifex/react";
import type { AppContext, AppProps } from "next/app";
import App from "next/app";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import nookies from "nookies";
import { useEffect } from "react";
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

const CookieBanner = dynamic(() => import("@/components/extensive/CookieBanner/CookieBanner"), {
  ssr: false
});

const _App = ({ Component, ...rest }: AppProps) => {
  const t = useT();
  const router = useRouter();
  const isAdmin = router.asPath.includes("/admin");
  const isOnDashboards = router.asPath.includes("/dashboard");

  const { store, props } = wrapper.useWrappedStore(rest);

  useEffect(() => {
    if (isOnDashboards) {
      // Hotjar Script
      const hotjarScript = document.createElement("script");
      hotjarScript.innerHTML = `
        (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:3357710,hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
      `;
      document.head.appendChild(hotjarScript);

      // Google Analytics Script
      const gaScript = document.createElement("script");
      gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-2K60BYCCPY";
      gaScript.async = true;
      document.head.appendChild(gaScript);

      const gaConfigScript = document.createElement("script");
      gaConfigScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-2K60BYCCPY');
      `;
      document.head.appendChild(gaConfigScript);
    }
  }, [isOnDashboards]);

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
                <Component {...props.pageProps} />
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
            <Hydrate state={props.pageProps.dehydratedState}>
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
                              <Component {...props.pageProps} />
                            </DashboardLayout>
                          </Then>
                          <Else>
                            <MainLayout>
                              <Component {...props.pageProps} />
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
