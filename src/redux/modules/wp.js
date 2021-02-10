import { createAsyncAction } from "../conditionalActions";
import { getPosts, POST_TYPES } from '../services/wpAPIClient';

// Actions
export const GET_CASE_STUDIES = 'wp/GET_CASE_STUDIES';
export const GET_NEWS_ITEMS = 'wp/GET_NEWS_ITEMS';
export const GET_TESTIMONIALS = 'wp/GET_TESTIMONIALS';
export const GET_PROJECTS = 'wp/GET_PROJECTS';

// Action Creators
export function getCaseStudies(langCode) {
  return (dispatch, getState) => {
    const action = createAsyncAction({
      type: GET_CASE_STUDIES,
      payload: {
        promise: new getPosts(POST_TYPES.CASE_STUDY, langCode)
      }
    });

    dispatch(action);

    return action.payload.promise;
  };
};

export function getNewsItems(langCode) {
  return (dispatch, getState) => {
    const action = createAsyncAction({
      type: GET_NEWS_ITEMS,
      payload: {
        promise: new getPosts(POST_TYPES.NEWS_ITEM, langCode)
      }
    });

    dispatch(action);

    return action.payload.promise;
  };
};

export function getTestimonials(langCode) {
  return (dispatch, getState) => {
    const action = createAsyncAction({
      type: GET_TESTIMONIALS,
      payload: {
        promise: new getPosts(POST_TYPES.TESTIMONIAL, langCode)
      }
    });

    dispatch(action);

    return action.payload.promise;
  };
};

export function getProjects(langCode) {
  return (dispatch, getState) => {
    const action = createAsyncAction({
      type: GET_PROJECTS,
      payload: {
        promise: new getPosts(POST_TYPES.PROJECT, langCode)
      }
    });

    dispatch(action);
    return action.payload.promise;
  };
};