import { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <Script
          id="google-tag-manager-gtag"
          src="https://www.googletagmanager.com/gtag/js?id=G-2K60BYCCPY"
          async
          onLoad={() => {
            // @ts-ignore
            window.dataLayer = window.dataLayer || [];
            function gtag() {
              // @ts-ignore
              dataLayer.push(arguments);
            }
            // @ts-ignore
            gtag("js", new Date());
            // @ts-ignore
            gtag("config", "G-2K60BYCCPY");
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
