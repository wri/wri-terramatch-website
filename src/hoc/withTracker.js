import React, { useEffect } from "react";
import ReactGA from "react-ga";

export const withTracker = (WrappedComponent, options = {}) => {

  if (process.env.NODE_ENV === 'production') {
    ReactGA.initialize(process.env.REACT_APP_GA);
  }

  const trackPage = page => {
    ReactGA.set({
      page,
      ...options
    });
    ReactGA.pageview(page);
  };

  const HOC = props => {
    useEffect(() => {
      if (process.env.NODE_ENV === 'production') {
        trackPage(props.location.pathname);
      }
    }, [
      props.location.pathname
    ]);

    return <WrappedComponent {...props} />;
  };

  return HOC;
};
