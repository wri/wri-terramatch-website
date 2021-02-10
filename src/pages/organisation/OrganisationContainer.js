import { connect } from 'react-redux'
import Organisation from './Organisation';
import { getOrganisationVersions, clearOrganisationVersions, getOrganisation, clearGetOrganisation } from '../../redux/modules/organisation';
import { showNotificationBar, closeNotificationBar } from '../../redux/modules/app';

const mapStateToProps = ({ auth, organisations }) => ({
  meState: auth.me,
  organisationVersions: organisations.getOrganisationVersions,
  getOrganisationState: organisations.getOrganisation
});

const mapDispatchToProps = (dispatch) => {
  return {
    getOrganisationVersions: (id) => {
      dispatch(getOrganisationVersions(id));
    },
    getOrganisation: (id) => {
      dispatch(getOrganisation(id));
    },
    showNotificationBar: (message, title, messageParams) => {
      dispatch(showNotificationBar(message, title, messageParams));
    },
    closeNotificationBar: () => {
      dispatch(closeNotificationBar());
    },
    clearState: () => {
      dispatch(clearOrganisationVersions());
      dispatch(clearGetOrganisation());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Organisation);
