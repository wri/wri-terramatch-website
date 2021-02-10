import React, { useEffect, useCallback } from 'react';
import LandingPublic from './LandingPublic';
import LandingPrivate from './LandingPrivate';
import { useTranslation } from 'react-i18next';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default (props) => {
  const { isLoggedIn,
    newsItemsState,
    getNewsItems,
    projectsState,
    getProjects,
    testimonialsState,
    } = props;
  const { i18n } = useTranslation();
  const languageCode = i18n.language;

  const fetchPosts = useCallback((lngCode) => {
    getNewsItems(lngCode);
    getProjects(lngCode);
  }, [getNewsItems, getProjects]);

  useEffect(() => {
    fetchPosts(languageCode);
  }, [languageCode, fetchPosts]);

  const mapDefaultConfig = {
    minZoom: 2,
    zoom: 2,
    center: [51.505, -0.09],
    detectRetina: true,
    zoomControl: false,
    scrollWheelZoom: false,
    boxZoom: false,
    doubleClickZoom: false,
    dragging: false
  }

  return isLoggedIn ?
        <LandingPrivate
          newsArr={newsItemsState.data ? newsItemsState.data : []}
          newsArrLoading={newsItemsState.isFetching}
        /> :
        <LandingPublic
          testimonialArr={testimonialsState.data ? testimonialsState.data : []}
          testimonialArrLoading={testimonialsState.isFetching}
          projectsArr={projectsState.data ? projectsState.data : []}
          projectsArrLoading={projectsState.isFetching}
          mapDefaultConfig={mapDefaultConfig}
        />
};
