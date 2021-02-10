import { connect } from 'react-redux';
import { getNewsItems, getTestimonials, getProjects } from '../../redux/modules/wp';

import Landing from './Landing';

const mapStateToProps = ({ auth, wp }) => ({
  isLoggedIn: auth.jwt && auth.me.data,
  caseStudiesState: wp.getCaseStudies,
  newsItemsState: wp.getNewsItems,
  testimonialsState: wp.getTestimonials,
  projectsState: wp.getProjects
});

const mapDispatchToProps = (dispatch) => {
  return {
    getNewsItems: (langCode) => {
      dispatch(getNewsItems(langCode));
    },
    getTestimonials: (langCode) => {
      dispatch(getTestimonials(langCode));
    },
    getProjects: (langCode) => {
      dispatch(getProjects(langCode));
    }
   };
};


export default connect(mapStateToProps, mapDispatchToProps)(Landing);
