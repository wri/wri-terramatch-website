import { type ToastProps, showToast as showDesignSystemToast } from "@worldresources/wri-design-systems";

export const showToast = (props: ToastProps) => showDesignSystemToast({ maxWidth: "auto", ...props });
