"use client";
import { FC, PropsWithChildren } from "react";

const LoginLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="relative flex h-screen w-full bg-square-pattern bg-contain bg-right bg-no-repeat mobile:bg-mask">
      <div className="mt-[-78px] flex w-[45%] flex-col items-center justify-center py-[78px] mobile:mb-[78px] mobile:w-full mobile:px-4">
        {children}
      </div>
      <div className="flex w-[55%] items-center justify-end mobile:hidden" />
    </div>
  );
};

export default LoginLayout;
