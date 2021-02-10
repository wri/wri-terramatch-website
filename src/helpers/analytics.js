import ReactGA from "react-ga";

export const gaEvent = (options) => {
  ReactGA.event(options);
};
