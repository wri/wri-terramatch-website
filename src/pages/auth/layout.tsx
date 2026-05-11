"use client";
import { Button } from "@mui/material";
import { useT } from "@transifex/react";
import { usePathname } from "next/navigation";
import { FC, PropsWithChildren } from "react";

import Text from "@/components/elements/Text/Text";

const LoginLayout: FC<PropsWithChildren> = ({ children }) => {
  const pathname = usePathname();
  const t = useT();
  return (
    <div className="relative flex h-screen w-full bg-square-pattern bg-contain bg-right bg-no-repeat mobile:bg-mask">
      <div className="mt-[-78px] flex w-[45%] flex-col items-center justify-center py-[78px] mobile:mb-[78px] mobile:w-full mobile:px-4">
        {children}
        {pathname !== "/sign-up" && (
          <div className="absolute bottom-[1.5vh] left-6">
            <Button>
              <Text variant="text-12-bold" className="text-primary">
                {t("English (United Kingdom)")}
              </Text>
            </Button>
          </div>
        )}
      </div>
      <div className="flex w-[55%] items-center justify-end mobile:hidden" />
    </div>
  );
};

export default LoginLayout;
