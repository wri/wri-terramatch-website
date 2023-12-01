import { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html>
      <Head>
        <Script id="google-tag-manager-gtm" strategy="lazyOnload" async>
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TPQBZVF');
          `}
        </Script>
        <Script
          id="google-tag-manager-gtag"
          src="https://www.googletagmanager.com/gtag/js?id=G-2K60BYCCPY"
          strategy="lazyOnload"
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
        <noscript
          dangerouslySetInnerHTML={{
            __html: `
            <iframe 
              src="https://www.googletagmanager.com/ns.html?id=GTM-TPQBZVF" 
              height="0" 
              width="0" 
              style="display:none;visibility:hidden"></iframe>
            </noscript>
          `
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
