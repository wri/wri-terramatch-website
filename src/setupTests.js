import '@testing-library/react/cleanup-after-each';

// Polyfill matchMedia: https://github.com/akiran/react-slick/issues/742
window.matchMedia = window.matchMedia || function() {
  return {
    matches : false,
    addListener : function() {},
    removeListener: function() {}
  };
};
