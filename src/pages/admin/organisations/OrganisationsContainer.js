import { connect } from 'react-redux';
import Organisations from './Organisations';
import { getOrganisationTasks,
         clearGetOrganisationTasks,
         clearApproveOrganisationTasks,
         clearRejectOrganisationTasks } from '../../../redux/modules/admin';
import { clearOrganisationVersions,
         clearOrganisationVersion,
         getOrganisations,
         clearGetOrganisations } from '../../../redux/modules/organisation';
const mapStateToProps = ({ admin, organisations }) => ({
  organisationTasksState: admin.getOrganisationTasks,
  organisationsState: organisations.getOrganisations
});

const mapDispatchToProps = (dispatch) => {
  return {
    getOrganisationTasks: () => {
      dispatch(getOrganisationTasks());
    },
    getOrganisations: () => {
      dispatch(getOrganisations());
    },
    clearOrganisationTasks: () => {
      dispatch(clearGetOrganisationTasks());
    },
    clearGetOrganisations: () => {
      dispatch(clearGetOrganisations())
    },
    clearOrganisation: () => {
      dispatch(clearOrganisationVersions());
      dispatch(clearOrganisationVersion());
      dispatch(clearApproveOrganisationTasks());
      dispatch(clearRejectOrganisationTasks());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Organisations);
