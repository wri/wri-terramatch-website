import { useEffect } from "react";

const withNotificationRoot = (Component: React.ComponentType<any>) => {
  useEffect(() => {
    const notificationRootId = "notification-root";
    let notificationRoot = document.getElementById(notificationRootId);
    if (!notificationRoot) {
      notificationRoot = document.createElement("div");
      notificationRoot.setAttribute("id", notificationRootId);
      document.body.appendChild(notificationRoot);
    }
    return () => {
      document.body.removeChild(notificationRoot);
    };
  }, []);

  return (props: any) => <Component {...props} portalRootId="notification-root" />;
};

export default withNotificationRoot;
