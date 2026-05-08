import { useT } from "@transifex/react";
import React, { FC, useCallback, useMemo } from "react";
import { twMerge as tw } from "tailwind-merge";

import Text from "@/components/elements/Text/Text";
import { useMyUser } from "@/connections/User";
import { TEXT_TYPES } from "@/constants/dashboardConsts";
import { checkUserAccess, getBlurTextType } from "@/utils/userAccessUtils";

type BlurContainerProps = {
  isBlur?: boolean;
  textType?: string;
  children: React.ReactNode;
  className?: string;
  logout?: () => void;
  projectFrameworkKey?: string | null;
  backendHasAccess?: boolean;
};

const getCurrentPath = () =>
  typeof window === "undefined" ? "" : `${window.location.pathname}${window.location.search}`;

const BlurContainer: FC<BlurContainerProps> = ({
  isBlur,
  textType,
  children,
  className,
  logout,
  projectFrameworkKey,
  backendHasAccess
}) => {
  const t = useT();
  const [, { user }] = useMyUser();

  const hasAccess = useMemo(() => {
    return checkUserAccess(user, projectFrameworkKey, backendHasAccess);
  }, [user, projectFrameworkKey, backendHasAccess]);

  const shouldBlur = hasAccess !== undefined && projectFrameworkKey !== undefined ? !hasAccess : isBlur;

  const displayTextType = useMemo(
    () => (textType == null ? getBlurTextType(user, hasAccess) : textType),
    [textType, user, hasAccess]
  );

  const handleLogout = useCallback(() => {
    if (typeof window !== "undefined") {
      const currentPath = getCurrentPath();
      localStorage.setItem("dashboardReturnUrl", currentPath);
      localStorage.setItem("dashboardReturnUrlTimestamp", new Date().toISOString());
    }

    logout && logout();
  }, [logout]);

  if (!shouldBlur) {
    return <>{children}</>;
  }

  const currentPath = getCurrentPath();
  const returnUrl = encodeURIComponent(currentPath);

  const renderText = () => {
    switch (displayTextType) {
      case TEXT_TYPES.LOGGED_USER:
        return (
          <>
            <button onClick={handleLogout} className="text-12-semibold underline">
              {t("Sign in")}
            </button>{" "}
            {t("with an account associated with this project")}
          </>
        );
      case TEXT_TYPES.NOT_LOGGED_USER:
        return (
          <>
            <a href={`/auth/login?returnUrl=${returnUrl}`} className="text-12-semibold underline">
              {t("Login to view.")}
            </a>{" "}
            {t("If you are a funder or representing a government agency, please")}{" "}
            <a
              href="https://terramatchsupport.zendesk.com/hc/en-us/requests/new?ticket_form_id=30623040820123&tf_subject=Account%20Access%20Request%20for%20TerraMatch%20Dashboard&tf_description=Please%20provide%20your%20details%20to%20request%20access%20to%20the%20TerraMatch%20Dashboard.%20Once%20your%20information%20is%20submitted,%20our%20team%20will%20review%20your%20request%20and%20set%20up%20an%20account%20for%20you.%20You%E2%80%99ll%20receive%20an%20email%20with%20further%20instructions%20once%20your%20account%20is%20ready"
              className="text-12-semibold underline"
            >
              {t("click here to request an account.")}
            </a>
          </>
        );
      case TEXT_TYPES.NO_DATA:
        return (
          <a>
            {t(
              "Data is still being collected and checked. This visual will remain empty until data is properly quality assured."
            )}
          </a>
        );
      case TEXT_TYPES.NO_GRAPH:
        return <a>{t("Graph not available.")}</a>;
      default:
        return null;
    }
  };

  return (
    <div className={tw("relative w-full text-black", className)}>
      <div
        className={`absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-xl ${
          shouldBlur ? "z-[2] bg-[#9d9a9a29] backdrop-blur-sm" : ""
        }`}
      >
        {shouldBlur && displayTextType != null && (
          <Text variant="text-12-semibold" className="h-fit w-fit max-w-[80%] rounded-lg bg-white px-4 py-3">
            {renderText()}
          </Text>
        )}
      </div>
      {children}
    </div>
  );
};

export default BlurContainer;
