import { captureException, captureMessage, SeverityLevel, withScope } from "@sentry/nextjs";

const IS_PROD = process.env.NODE_ENV === "production";

const sentryLog = (level: SeverityLevel, message: any, optionalParams: any[]) => {
  const error = optionalParams.find(param => param instanceof Error);

  withScope(scope => {
    if (error == null) {
      scope.setExtras({ optionalParams });
      captureMessage(message, level);
    } else {
      scope.setExtras({ message, optionalParams });
      captureException(error);
    }
  });
};

export default class Log {
  static debug(message: any, ...optionalParams: any[]) {
    if (!IS_PROD) console.debug(message, ...optionalParams);
  }

  static info(message: any, ...optionalParams: any[]) {
    if (!IS_PROD) console.info(message, ...optionalParams);
  }

  static warn(message: any, ...optionalParams: any[]) {
    console.warn(message, ...optionalParams);
    sentryLog("warning", message, optionalParams);
  }

  static error(message: any, ...optionalParams: any[]) {
    console.error(message, ...optionalParams);
    sentryLog("error", message, optionalParams);
  }
}
