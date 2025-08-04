import Script from "next/script";
import React from "react";

import { useMyOrg } from "@/connections/Organisation";
import { useMyUser } from "@/connections/User";

interface DashboardAnalyticsWrapperProps {
  children: React.ReactNode;
}

const DashboardAnalyticsWrapper = ({ children }: DashboardAnalyticsWrapperProps) => {
  const [, { user }] = useMyUser();
  const [, { organisation }] = useMyOrg();

  return (
    <>
      <Script id="hotjar" strategy="afterInteractive">
        {`
          (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:3357710,hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `}
      </Script>

      {user && (
        <Script id="hotjar-identify" strategy="afterInteractive">
          {`
            var userId = '${user.uuid ?? ""}' || null;
            window.hj('identify', userId, {
              'first_name': '${user.firstName ?? ""}',
              'last_name': '${user.lastName ?? ""}',
              'full_name': '${user.fullName ?? ""}',
              'role': '${user.primaryRole ?? ""}',
              'email_address': '${user.emailAddress ?? ""}',
              'locale': '${user.locale ?? ""}',
              'organisation_name': '${organisation?.name ?? ""}',
              'frameworks': ${JSON.stringify(user.frameworks?.map(f => f.slug) ?? [])}
            });
          `}
        </Script>
      )}

      {/* Google Analytics Script */}
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-2K60BYCCPY" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-2K60BYCCPY');
        `}
      </Script>

      {children}
    </>
  );
};

export default DashboardAnalyticsWrapper;
