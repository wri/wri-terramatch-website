import { useT } from "@transifex/react";
import { useCookies } from "react-cookie";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import { privacyPolicyLink } from "@/constants/links";

const CookieBanner = () => {
  const [cookies, setCookie] = useCookies();
  const t = useT();

  const acceptCookies = () => {
    // ensure the cookie expires one year from now
    const secondsInYear = 31536000;
    setCookie("cookieConsent", true, { maxAge: secondsInYear });
  };

  // don’t show if user has the cookie
  if (cookies.cookieConsent) {
    return null;
  } else {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-4 bg-black py-4 px-8  md:flex-row">
        <Text
          variant="text-heading-200"
          containHtml
          className="u-text-center u-font-gold u-text-decoration-none text-white"
        >
          {t(
            `This website uses cookies to provide you with an improved user experience. By continuing to browse this site, you consent to the use of cookies and similar technologies. For further details please visit our <a href="{privacyPolicyLink}">privacy policy.</a>`,
            { privacyPolicyLink }
          )}
        </Text>
        <Button variant="primary" onClick={acceptCookies}>
          {t("Ok")}
        </Button>
      </div>
    );
  }
};

export default CookieBanner;
